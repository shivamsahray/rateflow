import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Tenant from "../models/Tenant";

// ─── Admin Login ──────────────────────────────────────────────────────────────

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (
      email    !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
    const token = jwt.sign({ role: "ADMIN" }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ token });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// ─── Get all tenants ──────────────────────────────────────────────────────────

export const getAllTenants = async (_req: Request, res: Response) => {
  try {
    const tenants = await Tenant.find()
      .select("companyName email phone plan accountStatus subscriptionEndDate createdAt")
      .sort({ createdAt: -1 });
    res.json(tenants);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// ─── Activate: extend subscription from today or from existing end date ───────

export const activateTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    if (!["MONTHLY", "YEARLY"].includes(plan)) {
      return res.status(400).json({ message: "Plan must be MONTHLY or YEARLY" });
    }

    const tenant = await Tenant.findById(id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    const now      = new Date();
    const baseDate = tenant.subscriptionEndDate && tenant.subscriptionEndDate > now
      ? tenant.subscriptionEndDate
      : now;

    const daysToAdd  = plan === "YEARLY" ? 365 : 30;
    const newEndDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    await Tenant.findByIdAndUpdate(id, {
      plan,
      accountStatus:       "ACTIVE",
      subscriptionEndDate: newEndDate,
    });

    res.json({
      message: `${plan} activated till ${newEndDate.toDateString()}`,
      subscriptionEndDate: newEndDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ─── Suspend tenant ───────────────────────────────────────────────────────────

export const deactivateTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Tenant.findByIdAndUpdate(id, { accountStatus: "EXPIRED" });
    res.json({ message: "Tenant suspended" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// ─── ✅ NEW: Manually edit tenant — date + plan + status ─────────────────────
// PATCH /api/admin/tenants/:id
// Body: { plan?, accountStatus?, subscriptionEndDate? }

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan, accountStatus, subscriptionEndDate } = req.body;

    const allowedPlans    = ["FREE", "TRIAL", "MONTHLY", "YEARLY"];
    const allowedStatuses = ["ACTIVE", "EXPIRED"];

    if (plan && !allowedPlans.includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }
    if (accountStatus && !allowedStatuses.includes(accountStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update: any = {};
    if (plan)                update.plan                = plan;
    if (accountStatus)       update.accountStatus       = accountStatus;
    if (subscriptionEndDate) update.subscriptionEndDate = new Date(subscriptionEndDate);

    const updated = await Tenant.findByIdAndUpdate(id, update, { new: true })
      .select("companyName plan accountStatus subscriptionEndDate");

    if (!updated) return res.status(404).json({ message: "Tenant not found" });

    res.json({ message: "Tenant updated", tenant: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};