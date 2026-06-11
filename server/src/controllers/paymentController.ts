import { Response } from "express";

import Payment from "../models/Payment";
import Invoice from "../models/Invoice";

import { AuthRequest } from "../middleware/authMiddleware";

export const recordPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      invoiceId,
      amount,
      discount,
      paymentMode,
      referenceNumber,
      notes,
    } = req.body;

    const invoice =
      await Invoice.findOne({
        _id: invoiceId,
        tenantId:
          req.user?.tenantId,
      });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const discountAmount = Number(discount) || 0;
    const receivedAmount = Number(amount) || 0;

    // Total being settled = amount received + discount given
    const totalSettled = receivedAmount + discountAmount;

    const payment =
      await Payment.create({
        tenantId:
          req.user?.tenantId,
        customerId:
          invoice.customerId,
        invoiceId,
        amount: receivedAmount,
        discount: discountAmount,
        paymentMode,
        referenceNumber,
        notes,
      });

    // Update paidAmount (only actual cash received, not discount)
    invoice.paidAmount =
      (invoice.paidAmount || 0) + receivedAmount;

    // discountAmount is also settled from outstanding
    const totalPaidAndDiscounted =
      invoice.paidAmount + discountAmount;

    invoice.outstandingAmount = Math.max(
      invoice.grandTotal - totalPaidAndDiscounted,
      0
    );

    // Update payment status
    if (invoice.outstandingAmount <= 0) {
      invoice.paymentStatus = "Paid";
    } else if (invoice.paidAmount > 0 || discountAmount > 0) {
      invoice.paymentStatus = "Partial";
    } else {
      invoice.paymentStatus = "Pending";
    }

    await invoice.save();

    res.status(201).json(payment);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Payment creation failed",
    });
  }
};

// GET /api/payments/invoice/:invoiceId — payment history for an invoice
export const getPaymentsByInvoice = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const payments = await Payment.find({
      invoiceId: req.params.invoiceId,
      tenantId: req.user?.tenantId,
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};