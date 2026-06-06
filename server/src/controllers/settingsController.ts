import { Request, Response } from "express";
import Tenant from "../models/Tenant";
import { AuthRequest } from "../middleware/authMiddleware";

export const getSettings = async (
  req: AuthRequest,
  res: Response
) => {

  const tenant =
    await Tenant.findById(
      req.user?.tenantId
    );

  res.json(tenant);
};

export const updateSettings = async (
  req: AuthRequest,
  res: Response
) => {

  const tenant =
    await Tenant.findByIdAndUpdate(
      req.user?.tenantId,
      req.body,
      { new: true }
    );

  res.json(tenant);
};