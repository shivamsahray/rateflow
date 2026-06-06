import jwt from 'jsonwebtoken';

export const generateToken = (
    userId: string,
    tenantId: string
) => {
    return jwt.sign(
        {
            userId,
            tenantId,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: '7d',
        }
    );
};