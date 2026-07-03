import crypto from 'crypto';

export const generateOTP = (digits = 6) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return String(num);
};

export const hashOTP = (otp: string) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

export const isOTPExpired = (expiry?: Date) => {
    if (!expiry) return true;
    return new Date() > expiry;
};
