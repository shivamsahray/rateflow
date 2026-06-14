import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Tenant from "../models/Tenant";

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



export const subscriptionMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenant = await Tenant.findById(req.user?.tenantId).select(
      "accountStatus subscriptionEndDate plan"
    );
 
    if (!tenant) {
      return res.status(401).json({ message: "Tenant not found" });
    }
 
    if (tenant.accountStatus === "EXPIRED") {
      return res.status(403).json({
        message: "Subscription expired",
        subscriptionExpired: true,   // ← frontend isko check karta hai
        plan: tenant.plan,
      });
    }
 
    // ACTIVE ya TRIAL — allow karo
    next();
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};
 