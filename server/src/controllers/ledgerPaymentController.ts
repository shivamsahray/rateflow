import { Response } from "express";
import Invoice from "../models/Invoice";
import Payment from "../models/Payment";
import Customer from "../models/Customer";
import Tenant from "../models/Tenant";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  sendWhatsAppMessage,
  buildPaymentReceivedMessage,
} from "../services/whatsappService";

// ─── POST /api/ledger/:customerId/payment ─────────────────────────────────────
// FIFO logic: oldest unpaid invoice pehle settle hogi

export const recordLedgerPayment = async (req: AuthRequest, res: Response) => {
  try {
    const customerIdParam = req.params.customerId;
    const customerId = Array.isArray(customerIdParam)
      ? customerIdParam[0]
      : customerIdParam;
    const tenantId = req.user?.tenantId as string;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const {
      amount,
      discount,
      paymentMode,
      referenceNumber,
      notes,
    } = req.body;

    const receivedAmount  = Number(amount)   || 0;
    const discountAmount  = Number(discount) || 0;
    let   remainingAmount = receivedAmount + discountAmount; // total to distribute

    if (remainingAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Verify customer
    const customer = await Customer.findOne({ _id: customerId, tenantId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ── Get all pending/partial invoices sorted by date ASCENDING (FIFO) ──
    const pendingInvoices = await Invoice.find({
      tenantId,
      customerId,
      paymentStatus: { $in: ["Pending", "Partial"] },
    }).sort({ invoiceDate: 1, createdAt: 1 });

    if (pendingInvoices.length === 0) {
      return res.status(400).json({ message: "No pending invoices for this customer" });
    }

    const settledInvoices: {
      invoiceNumber: string;
      amountApplied: number;
      discountApplied: number;
      newStatus: string;
    }[] = [];

    // ── FIFO: distribute amount across invoices ───────────────────────────────
    for (const invoice of pendingInvoices) {
      if (remainingAmount <= 0) break;

      const invoiceOutstanding = invoice.outstandingAmount || 0;
      if (invoiceOutstanding <= 0) continue;

      // How much can we apply to this invoice
      const applyAmount = Math.min(remainingAmount, invoiceOutstanding);

      // Split proportionally: if discount > 0, apply discount first then cash
      // Simple approach: apply full applyAmount as credit (mix of cash + discount)
      const cashApplied     = Math.min(receivedAmount, applyAmount);
      const discountApplied = applyAmount - cashApplied;

      // Create payment record for this invoice
      await Payment.create({
        tenantId,
        customerId,
        invoiceId:       invoice._id,
        amount:          cashApplied,
        discount:        discountApplied,
        paymentMode,
        referenceNumber,
        notes: notes || `Ledger payment — distributed`,
      });

      // Update invoice
      invoice.paidAmount        = (invoice.paidAmount || 0) + cashApplied;
      invoice.outstandingAmount = Math.max(invoiceOutstanding - applyAmount, 0);

      if (invoice.outstandingAmount <= 0) {
        invoice.paymentStatus = "Paid";
      } else {
        invoice.paymentStatus = "Partial";
      }

      await invoice.save();

      settledInvoices.push({
        invoiceNumber:   invoice.invoiceNumber,
        amountApplied:   applyAmount,
        discountApplied,
        newStatus:       invoice.paymentStatus,
      });

      remainingAmount -= applyAmount;
    }

    // ── Update customer outstanding ───────────────────────────────────────────
    const recalculated = await Invoice.find({
      tenantId,
      customerId,
      paymentStatus: { $in: ["Pending", "Partial"] },
    });
    const newOutstanding = recalculated.reduce(
      (sum, inv) => sum + (inv.outstandingAmount || 0), 0
    );
    await Customer.findByIdAndUpdate(customerId, {
      outstandingAmount: newOutstanding,
    });

    // ── WhatsApp notification ─────────────────────────────────────────────────
    try {
      const tenant = await Tenant.findById(tenantId);
      if (tenant?.whatsappConnected && customer.phone && !customer.isDefault) {
        // Build summary message for ledger payment
        const invoiceRefs = settledInvoices
          .map((s) => `#${s.invoiceNumber} (₹${s.amountApplied.toFixed(2)})`)
          .join(", ");

        const message =
          `Hello *${customer.name}*,\n\n` +
          `We have received your payment. Thank you! 🙏\n\n` +
          `💰 *Payment Details:*\n` +
          `• Amount Received: *₹${receivedAmount.toFixed(2)}*\n` +
          (discountAmount > 0 ? `• Discount Given: *₹${discountAmount.toFixed(2)}*\n` : "") +
          `• Mode: *${paymentMode}*\n` +
          `• Applied To: ${invoiceRefs}\n` +
          (newOutstanding > 0
            ? `• Outstanding Balance: *₹${newOutstanding.toFixed(2)}*\n`
            : `• All dues cleared ✅\n`) +
          `\n_This is an automated message from ${tenant.companyName} via RateFlow ERP._`;

        await sendWhatsAppMessage(tenantId, customer.phone, message);
      }
    } catch (waErr) {
      console.error("WhatsApp ledger payment notification failed:", waErr);
    }

    return res.status(201).json({
      message:          "Payment recorded successfully",
      settledInvoices,
      newOutstanding,
      remainingUnused:  remainingAmount, // > 0 means overpaid beyond all invoices
    });
  } catch (error) {
    console.error("Ledger payment error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};