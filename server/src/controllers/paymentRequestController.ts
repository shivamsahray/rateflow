// controllers/paymentRequestController.ts
import { Request, Response } from "express";
import Tenant from "../models/Tenant";
import PaymentRequest from "../models/PaymentRequest";
import { AuthRequest } from "../middleware/authMiddleware";

// User submits payment proof
export const createPaymentRequest = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { planType } = req.body;
    if (!tenantId || !planType) {
      return res.status(400).json({ message: "Missing plan type" });
    }
    const plan = planType.toUpperCase();
    if (plan !== "MONTHLY" && plan !== "YEARLY") {
      return res.status(400).json({ message: "Invalid plan type" });
    }
    const amount = plan === "YEARLY" ? 1299 : 149;

    // Uploaded file via Multer
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Payment screenshot is required" });
    }

    // Create payment request
    const request = await PaymentRequest.create({
      tenantId,
      planType: plan,
      amount,
      screenshot: file.path,
      status: "PENDING"
    });

    // Mark tenant as PENDING while awaiting admin approval
    await Tenant.findByIdAndUpdate(tenantId, { accountStatus: "PENDING" });

    res.status(201).json({ message: "Payment request submitted", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin: list all payment requests
export const listPaymentRequests = async (_req: Request, res: Response) => {
  try {
    const requests = await PaymentRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin: approve a payment request
export const approvePaymentRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await PaymentRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "PENDING") {
      return res.status(400).json({ message: "Request already processed" });
    }
    const tenant = await Tenant.findById(request.tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Set subscription dates from now
    const now = new Date();
    let newEnd: Date;
    if (request.planType === "MONTHLY") {
      newEnd = new Date(now.getTime() + 30*24*60*60*1000);
      tenant.subscriptionType = "MONTHLY";
    } else {
      newEnd = new Date(now.getTime() + 365*24*60*60*1000);
      tenant.subscriptionType = "YEARLY";
    }
    tenant.subscriptionEndDate = newEnd;
    tenant.accountStatus = "ACTIVE";
    await tenant.save();

    request.status = "APPROVED";
    await request.save();

    res.json({ message: "Subscription activated", tenantId: tenant._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin: reject a payment request
export const rejectPaymentRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await PaymentRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "PENDING") {
      return res.status(400).json({ message: "Request already processed" });
    }
    await PaymentRequest.findByIdAndUpdate(id, { status: "REJECTED" });
    // Mark tenant expired if pending
    await Tenant.findByIdAndUpdate(request.tenantId, { accountStatus: "EXPIRED" });
    res.json({ message: "Payment request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
