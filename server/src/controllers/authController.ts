import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Tenant from '../models/Tenant';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import Customer from '../models/Customer';
import { generateOTP, hashOTP, isOTPExpired } from '../services/otpService';
import { sendVerificationEmail, sendResetOTPEmail, sendPasswordChangedEmail } from '../services/emailService';

const OTP_TTL_MINUTES = 10;
const RESEND_LIMIT = 3;
const RESEND_COOLDOWN_SECONDS = 60;

export const register = async (
    req: Request,
    res: Response
) => {
    // console.log("BODY:", req.body);
    try {
        const {
            companyName,
            name,
            email,
            password,
        } = req.body;
            

        const existingUser = await User.findOne({
            email,
        });

        if(existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const tenant = await Tenant.create({ companyName });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            tenantId: tenant._id,
            name,
            email,
            password: hashedPassword,
            role: 'OWNER',
            isVerified: false,
        });

        await Customer.create({
            tenantId: tenant._id,
            name: 'CASH',
            phone: 'N/A',
            gstNumber: '',
            address: 'Walk-in Customer',
            outstandingAmount: 0,
            isDefault: true,
        });

        // generate verification OTP and send email
        const otp = generateOTP(6);
        const otpHash = hashOTP(otp);
        const expiry = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

        user.verificationOTPHash = otpHash;
        user.verificationOTPExpiry = expiry;
        user.lastVerificationSentAt = new Date();
        user.verificationResendCount = 0;

        await user.save();

        try {
            await sendVerificationEmail(email, name, otp);
        } catch (e) {
            console.error('Failed sending verification email', e);
        }

        res.status(201).json({
            message: 'Registered. Please verify your email.',
            email: user.email,
        });
    } catch (error){
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { email , password } = req.body;
        
        const user = await User.findOne({
            email,
        });

        if(!user){
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email first.',
                resendAvailable: (user.verificationResendCount || 0) < RESEND_LIMIT,
                email: user.email,
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if(!match) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken(
            user._id.toString(),
            user.tenantId.toString()
        );

        res.status(200).json({
            token,
            user,
        });
    }catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

        if (!user.verificationOTPHash || !user.verificationOTPExpiry) {
            return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
        }

        if (isOTPExpired(user.verificationOTPExpiry)) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const hashed = hashOTP(otp);
        if (hashed !== user.verificationOTPHash) {
            return res.status(400).json({ message: 'Wrong OTP' });
        }

        user.isVerified = true;
        user.verificationOTPHash = undefined;
        user.verificationOTPExpiry = undefined;
        user.verificationResendCount = 0;
        user.lastVerificationSentAt = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const resendVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

        const now = new Date();
        if (user.lastVerificationSentAt) {
            const diff = (now.getTime() - user.lastVerificationSentAt.getTime()) / 1000;
            if (diff < RESEND_COOLDOWN_SECONDS) {
                return res.status(400).json({ message: `Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - diff)} seconds before resending` });
            }
        }

        if ((user.verificationResendCount || 0) >= RESEND_LIMIT) {
            return res.status(429).json({ message: 'Maximum resend attempts exceeded' });
        }

        const otp = generateOTP(6);
        user.verificationOTPHash = hashOTP(otp);
        user.verificationOTPExpiry = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
        user.verificationResendCount = (user.verificationResendCount || 0) + 1;
        user.lastVerificationSentAt = new Date();
        await user.save();

        try { await sendVerificationEmail(email, user.name, otp); } catch (e) { console.error(e); }

        res.status(200).json({ message: 'OTP resent' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });

        const otp = generateOTP(6);
        user.resetOTPHash = hashOTP(otp);
        user.resetOTPExpiry = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
        await user.save();

        try { await sendResetOTPEmail(email, user.name, otp); } catch (e) { console.error(e); }

        res.status(200).json({ message: 'Reset OTP sent' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const verifyResetOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });

        if (!user.resetOTPHash || !user.resetOTPExpiry) return res.status(400).json({ message: 'No reset request found' });
        if (isOTPExpired(user.resetOTPExpiry)) return res.status(400).json({ message: 'OTP expired' });

        if (hashOTP(otp) !== user.resetOTPHash) return res.status(400).json({ message: 'Wrong OTP' });

        res.status(200).json({ message: 'OTP verified' });
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server Error' }); }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });

        if (!user.resetOTPHash || !user.resetOTPExpiry) return res.status(400).json({ message: 'No reset request found' });
        if (isOTPExpired(user.resetOTPExpiry)) return res.status(400).json({ message: 'OTP expired' });
        if (hashOTP(otp) !== user.resetOTPHash) return res.status(400).json({ message: 'Wrong OTP' });

        if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'Weak password' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTPHash = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();

        try { await sendPasswordChangedEmail(email, user.name); } catch (e) { console.error(e); }

        res.status(200).json({ message: 'Password updated' });
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server Error' }); }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
        if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'Weak password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        try { await sendPasswordChangedEmail(user.email, user.name); } catch (e) { console.error(e); }

        res.status(200).json({ message: 'Password changed' });
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server Error' }); }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.userId).select("-password");
 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
 
        // Tenant se companyName fetch karo
        const tenant = await Tenant.findById(req.user?.tenantId).select(
            "companyName plan logo"
        );
 
        res.status(200).json({
            ...user.toObject(),
            companyName: tenant?.companyName || "",
            plan: tenant?.plan || "FREE",
            logo: tenant?.logo || "",
        });
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
};