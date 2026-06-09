import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Tenant from '../models/Tenant';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import Customer from '../models/Customer';

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

        const tenant = await Tenant.create({
            companyName,
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            tenantId: tenant._id,
            name,
            email,
            password: hashedPassword,
            role: "OWNER",
        });

        await Customer.create({
            tenantId: tenant._id,
            name: "CASH",
            phone: "N/A",
            gstNumber: "",
            address: "Walk-in Customer",
            outstandingAmount: 0,
            isDefault: true
        })

        const token = generateToken(
            user._id.toString(),
            tenant._id.toString()
        );

        res.status(201).json({
            token,
            user,
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