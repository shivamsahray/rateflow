// import { Response } from "express";

// import Payment from "../models/Payment";
// import Invoice from "../models/Invoice";

// import { AuthRequest } from "../middleware/authMiddleware";

// export const recordPayment = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const {
//       invoiceId,
//       amount,
//       discount,
//       paymentMode,
//       referenceNumber,
//       notes,
//     } = req.body;

//     const invoice =
//       await Invoice.findOne({
//         _id: invoiceId,
//         tenantId:
//           req.user?.tenantId,
//       });

//     if (!invoice) {
//       return res.status(404).json({
//         message: "Invoice not found",
//       });
//     }

//     const discountAmount = Number(discount) || 0;
//     const receivedAmount = Number(amount) || 0;

//     // Total being settled = amount received + discount given
//     const totalSettled = receivedAmount + discountAmount;

//     const payment =
//       await Payment.create({
//         tenantId:
//           req.user?.tenantId,
//         customerId:
//           invoice.customerId,
//         invoiceId,
//         amount: receivedAmount,
//         discount: discountAmount,
//         paymentMode,
//         referenceNumber,
//         notes,
//       });

//     // Update paidAmount (only actual cash received, not discount)
//     invoice.paidAmount =
//       (invoice.paidAmount || 0) + receivedAmount;

//     // discountAmount is also settled from outstanding
//     const totalPaidAndDiscounted =
//       invoice.paidAmount + discountAmount;

//     invoice.outstandingAmount = Math.max(
//       invoice.grandTotal - totalPaidAndDiscounted,
//       0
//     );

//     // Update payment status
//     if (invoice.outstandingAmount <= 0) {
//       invoice.paymentStatus = "Paid";
//     } else if (invoice.paidAmount > 0 || discountAmount > 0) {
//       invoice.paymentStatus = "Partial";
//     } else {
//       invoice.paymentStatus = "Pending";
//     }

//     await invoice.save();

//     res.status(201).json(payment);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Payment creation failed",
//     });
//   }
// };

// // GET /api/payments/invoice/:invoiceId — payment history for an invoice
// export const getPaymentsByInvoice = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const payments = await Payment.find({
//       invoiceId: req.params.invoiceId,
//       tenantId: req.user?.tenantId,
//     }).sort({ createdAt: -1 });

//     res.json(payments);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

import { Response } from "express";

import Payment from "../models/Payment";
import Invoice from "../models/Invoice";
import Customer from "../models/Customer";
import Tenant from "../models/Tenant";

import { AuthRequest } from "../middleware/authMiddleware";
import {
  sendWhatsAppMessage,
  buildPaymentReceivedMessage,
} from "../services/whatsappService";
import { normalizePaymentDate } from "../utils/date";

const recalculateInvoiceTotals = async (tenantId: string, invoiceId: string) => {
  const invoice = await Invoice.findOne({ _id: invoiceId, tenantId });
  if (!invoice) return;

  const payments = await Payment.find({ tenantId, invoiceId });
  const paidAmount = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const discountGiven = payments.reduce((sum, payment) => sum + Number(payment.discount || 0), 0);

  invoice.paidAmount = paidAmount;
  invoice.outstandingAmount = Math.max(Number(invoice.grandTotal || 0) - paidAmount - discountGiven, 0);
  invoice.paymentStatus = invoice.outstandingAmount <= 0 ? "Paid" : paidAmount > 0 || discountGiven > 0 ? "Partial" : "Pending";

  await invoice.save();
};

const recalculateCustomerOutstanding = async (tenantId: string, customerId: string) => {
  const customer = await Customer.findOne({ _id: customerId, tenantId });
  if (!customer) return;

  const invoices = await Invoice.find({ tenantId, customerId });
  const totalOutstanding = invoices.reduce((sum, invoice) => sum + Number(invoice.outstandingAmount || 0), 0);

  await Customer.findByIdAndUpdate(customerId, {
    outstandingAmount: (Number(customer.openingBalance || 0) + totalOutstanding),
  });
};

export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      invoiceId,
      customerId,
      amount,
      discount,
      paymentMode,
      referenceNumber,
      notes,
      paymentDate,
    } = req.body;

    const tenantId = req.user?.tenantId as string;
    const discountAmount = Number(discount) || 0;
    const receivedAmount = Number(amount) || 0;

    if (receivedAmount <= 0) {
      return res.status(400).json({ message: "Payment amount must be greater than 0" });
    }

    let resolvedCustomerId = customerId || null;
    let resolvedInvoiceId = invoiceId || null;

    if (!resolvedInvoiceId && !resolvedCustomerId) {
      return res.status(400).json({ message: "Customer or invoice is required" });
    }

    if (resolvedInvoiceId) {
      const invoice = await Invoice.findOne({
        _id: resolvedInvoiceId,
        tenantId,
      });

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      resolvedCustomerId = invoice.customerId.toString();
    } else {
      const customer = await Customer.findOne({ _id: resolvedCustomerId, tenantId });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    const payment = await Payment.create({
      tenantId,
      customerId: resolvedCustomerId,
      invoiceId: resolvedInvoiceId,
      amount: receivedAmount,
      discount: discountAmount,
      paymentDate: normalizePaymentDate(paymentDate) || new Date(),
      paymentMode,
      referenceNumber,
      notes,
    });

    if (resolvedInvoiceId) {
      await recalculateInvoiceTotals(tenantId, resolvedInvoiceId.toString());
    }

    if (resolvedCustomerId) {
      await recalculateCustomerOutstanding(tenantId, resolvedCustomerId.toString());
    }

    if (resolvedInvoiceId) {
      try {
        const tenant = await Tenant.findById(tenantId);
        const invoice = await Invoice.findById(resolvedInvoiceId);
        if (tenant?.whatsappConnected) {
          const customer = await Customer.findById(resolvedCustomerId);
          if (customer?.phone && !customer.isDefault && invoice) {
            const message = buildPaymentReceivedMessage(
              tenant.companyName,
              customer.name,
              invoice.invoiceNumber,
              receivedAmount,
              invoice.outstandingAmount,
              paymentMode
            );

            await sendWhatsAppMessage(tenantId, customer.phone, message);
          }
        }
      } catch (waError) {
        console.error("WhatsApp payment notification failed:", waError);
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment creation failed" });
  }
};

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 25));
    const q = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const filter: Record<string, unknown> = { tenantId: req.user?.tenantId };
    if (q) {
      filter.$or = [
        { referenceNumber: { $regex: q, $options: "i" } },
        { paymentMode: { $regex: q, $options: "i" } },
      ];
    }

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .sort({ paymentDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("customerId", "name phone")
      .populate("invoiceId", "invoiceNumber");

    res.status(200).json({
      data: payments,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPaymentById = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    }).populate("customerId", "name phone").populate("invoiceId", "invoiceNumber");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await Payment.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!existing) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const paymentDate = normalizePaymentDate(req.body.paymentDate) || existing.paymentDate || new Date();
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        paymentDate,
      },
      { new: true }
    );

    if (existing.invoiceId) {
      await recalculateInvoiceTotals(req.user?.tenantId as string, existing.invoiceId.toString());
    }

    if (existing.customerId) {
      await recalculateCustomerOutstanding(req.user?.tenantId as string, existing.customerId.toString());
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment update failed" });
  }
};

export const deletePayment = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await Payment.deleteOne({ _id: req.params.id, tenantId: req.user?.tenantId });

    if (payment.invoiceId) {
      await recalculateInvoiceTotals(req.user?.tenantId as string, payment.invoiceId.toString());
    }

    if (payment.customerId) {
      await recalculateCustomerOutstanding(req.user?.tenantId as string, payment.customerId.toString());
    }

    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment deletion failed" });
  }
};

export const getPaymentsByInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await Payment.find({
      invoiceId: req.params.invoiceId,
      tenantId: req.user?.tenantId,
    }).sort({ paymentDate: -1, createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};