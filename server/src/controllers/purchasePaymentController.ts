import mongoose from "mongoose";
import { Response } from "express";
import PurchasePayment from "../models/PurchasePayment";
import Purchase from "../models/Purchase";
import Vendor from "../models/Vendor";
import { AuthRequest } from "../middleware/authMiddleware";

const resolvePaymentStatus = (paidAmount: number, grandTotal: number) => {
  if (grandTotal <= 0) {
    return "Pending";
  }

  if (paidAmount >= grandTotal) {
    return "Paid";
  }

  if (paidAmount > 0) {
    return "Partial";
  }

  return "Pending";
};

const recalculateVendorOutstanding = async (tenantId: string, vendorId: string, session?: mongoose.ClientSession) => {
  const purchases = await Purchase.find({ tenantId, vendorId }).select("outstandingAmount").session(session as any);
  const outstanding = purchases.reduce((sum, purchase) => sum + Number(purchase.outstandingAmount || 0), 0);

  await Vendor.findByIdAndUpdate(vendorId, { $set: { outstandingAmount: outstanding } }, { session });
  return outstanding;
};

export const createPurchasePayment = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const tenantId = req.user?.tenantId;
    const { vendorId, purchaseId, amount, paymentDate, paymentMode, referenceNumber, notes } = req.body;

    if (!tenantId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!vendorId || !purchaseId || !amount) {
      return res.status(400).json({ message: "Vendor, purchase and amount are required" });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    let payment: any;

    await session.withTransaction(async () => {
      const purchase = await Purchase.findOne({ _id: purchaseId, tenantId, vendorId }).session(session);

      if (!purchase) {
        throw new Error("Purchase not found");
      }

      const outstanding = Number(purchase.outstandingAmount || 0);

      if (numericAmount > outstanding) {
        throw new Error("Payment amount cannot exceed outstanding amount");
      }

      payment = new PurchasePayment({
        tenantId,
        vendorId,
        purchaseId,
        amount: numericAmount,
        paymentDate,
        paymentMode,
        referenceNumber,
        notes,
      });

      await payment.save({ session });

      purchase.paidAmount = Math.max(0, Number(purchase.paidAmount || 0) + numericAmount);
      purchase.outstandingAmount = Math.max(0, Number(purchase.grandTotal || 0) - purchase.paidAmount);
      purchase.paymentStatus = resolvePaymentStatus(purchase.paidAmount, Number(purchase.grandTotal || 0));
      await purchase.save({ session });

      await recalculateVendorOutstanding(tenantId, vendorId, session);
    });

    return res.status(201).json(payment);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Payment amount cannot exceed outstanding amount") {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "Purchase not found") {
        return res.status(404).json({ message: error.message });
      }
    }

    return res.status(500).json({ message: "Server Error" });
  } finally {
    session.endSession();
  }
};

export const deletePurchasePayment = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payment = await PurchasePayment.findOne({ _id: req.params.id, tenantId }).session(session);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await session.withTransaction(async () => {
      if (payment.purchaseId) {
        const purchase = await Purchase.findOne({ _id: payment.purchaseId, tenantId }).session(session);

        if (purchase) {
          purchase.paidAmount = Math.max(0, Number(purchase.paidAmount || 0) - Number(payment.amount || 0));
          purchase.outstandingAmount = Math.max(0, Number(purchase.grandTotal || 0) - purchase.paidAmount);
          purchase.paymentStatus = resolvePaymentStatus(purchase.paidAmount, Number(purchase.grandTotal || 0));
          await purchase.save({ session });
        }
      }

      await PurchasePayment.deleteOne({ _id: payment._id }).session(session);
      if (payment.vendorId) {
        await recalculateVendorOutstanding(tenantId, payment.vendorId.toString(), session);
      }
    });

    return res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  } finally {
    session.endSession();
  }
};

export const getPurchasePayments = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await PurchasePayment.find({ tenantId: req.user?.tenantId })
      .populate("vendorId")
      .populate("purchaseId")
      .sort({ paymentDate: -1 });

    return res.json(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
