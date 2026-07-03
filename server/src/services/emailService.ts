import nodemailer from 'nodemailer';
import { verifyEmailTemplate, resetPasswordTemplate, passwordChangedTemplate } from '../utils/emailTemplates';

const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
    const secure = process.env.SMTP_SECURE === 'true';

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter;
};

export const sendVerificationEmail = async (to: string, name: string, otp: string) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: 'Verify your RateFlow account',
        html: verifyEmailTemplate(name, otp),
    });

    return info;
};

export const sendResetOTPEmail = async (to: string, name: string, otp: string) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: 'Reset your RateFlow password',
        html: resetPasswordTemplate(name, otp),
    });

    return info;
};

export const sendPasswordChangedEmail = async (to: string, name: string) => {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: 'Your RateFlow password has been changed',
        html: passwordChangedTemplate(name),
    });

    return info;
};
