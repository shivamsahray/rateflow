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
        message:
          "Invoice not found",
      });
    }

    const invoiceTotal =
      invoice.grandTotal ||
      invoice.totalAmount * 1.18;

    const payment =
      await Payment.create({
        tenantId:
          req.user?.tenantId,
        customerId:
          invoice.customerId,
        invoiceId,
        amount,
        paymentMode,
        referenceNumber,
        notes,
      });

    invoice.paidAmount =
      (invoice.paidAmount || 0) +
      amount;

    invoice.outstandingAmount =
      Math.max(
        invoiceTotal -
          invoice.paidAmount,
        0
      );

    if (
      invoice.outstandingAmount <=
      0
    ) {
      invoice.paymentStatus =
        "Paid";
    } else if (
      invoice.paidAmount > 0
    ) {
      invoice.paymentStatus =
        "Partial";
    } else {
      invoice.paymentStatus =
        "Pending";
    }

    await invoice.save();

    res.status(201).json(
      payment
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Payment creation failed",
    });
  }
};
