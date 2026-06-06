import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
    user?:{
        userId: string;
        tenantId: string;
    };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            userId: string;
            tenantId: string;
        };

        req.user = decoded;

        next();
    }catch(error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};

