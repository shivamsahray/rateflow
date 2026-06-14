import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Admin-only middleware — alag JWT role check karta hai

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};