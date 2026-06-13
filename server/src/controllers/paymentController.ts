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

export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      invoiceId,
      amount,
      discount,
      paymentMode,
      referenceNumber,
      notes,
    } = req.body;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      tenantId: req.user?.tenantId,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const discountAmount = Number(discount) || 0;
    const receivedAmount = Number(amount) || 0;

    const payment = await Payment.create({
      tenantId:        req.user?.tenantId,
      customerId:      invoice.customerId,
      invoiceId,
      amount:          receivedAmount,
      discount:        discountAmount,
      paymentMode,
      referenceNumber,
      notes,
    });

    invoice.paidAmount = (invoice.paidAmount || 0) + receivedAmount;

    const totalPaidAndDiscounted = invoice.paidAmount + discountAmount;

    invoice.outstandingAmount = Math.max(
      invoice.grandTotal - totalPaidAndDiscounted,
      0
    );

    if (invoice.outstandingAmount <= 0) {
      invoice.paymentStatus = "Paid";
    } else if (invoice.paidAmount > 0 || discountAmount > 0) {
      invoice.paymentStatus = "Partial";
    } else {
      invoice.paymentStatus = "Pending";
    }

    await invoice.save();

    // ✅ WhatsApp: payment receive hone pe customer ko confirmation bhejo
    try {
      const tenant = await Tenant.findById(req.user?.tenantId);
      if (tenant?.whatsappConnected) {
        const customer = await Customer.findById(invoice.customerId);
        if (customer?.phone && !customer.isDefault) {
          const message = buildPaymentReceivedMessage(
            tenant.companyName,
            customer.name,
            invoice.invoiceNumber,
            receivedAmount,
            invoice.outstandingAmount,
            paymentMode
          );

          await sendWhatsAppMessage(
            req.user?.tenantId as string,
            customer.phone,
            message
          );
        }
      }
    } catch (waError) {
      // WhatsApp fail hone pe payment fail nahi hona chahiye
      console.error("WhatsApp payment notification failed:", waError);
    }

    res.status(201).json(payment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Payment creation failed" });
  }
};

export const getPaymentsByInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await Payment.find({
      invoiceId: req.params.invoiceId,
      tenantId:  req.user?.tenantId,
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};