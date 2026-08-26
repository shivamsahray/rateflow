import { Response } from "express";
import Invoice from "../models/Invoice";
import Payment from "../models/Payment";
import Customer from "../models/Customer";
import Tenant from "../models/Tenant";
import { AuthRequest } from "../middleware/authMiddleware";
import { sendWhatsAppMessage } from "../services/whatsappService";
import { normalizePaymentDate } from "../utils/date";

// FIFO logic: opening balance > oldest unpaid invoice > next, etc.

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

    const { amount, discount, paymentMode, referenceNumber, notes, paymentDate } = req.body;

    const receivedAmount = Number(amount) || 0;
    const discountAmount = Number(discount) || 0;
    let remainingAmount = receivedAmount + discountAmount;

    if (remainingAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const customer = await Customer.findOne({ _id: customerId, tenantId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const settledInvoices: {
      invoiceNumber: string;
      amountApplied: number;
      discountApplied: number;
      newStatus: string;
    }[] = [];

    let openingBalanceSettled = 0;

    const currentOpeningOutstanding = Math.max(
      (customer.openingBalance || 0) - (await getOpeningBalanceAlreadyPaid(tenantId, customerId)),
      0
    );

    if (currentOpeningOutstanding > 0 && remainingAmount > 0) {
      const applyToOpening = Math.min(remainingAmount, currentOpeningOutstanding);
      const cashApplied = Math.min(receivedAmount, applyToOpening);
      const discountApplied = applyToOpening - cashApplied;

      await Payment.create({
        tenantId,
        customerId,
        amount: cashApplied,
        discount: discountApplied,
        paymentDate: normalizePaymentDate(paymentDate) || new Date(),
        paymentMode,
        referenceNumber,
        notes: "OPENING_BALANCE_SETTLEMENT" + (notes ? ` — ${notes}` : ""),
      });

      openingBalanceSettled = applyToOpening;
      remainingAmount -= applyToOpening;
    }

    const pendingInvoices = await Invoice.find({
      tenantId,
      customerId,
      paymentStatus: { $in: ["Pending", "Partial"] },
    }).sort({ invoiceDate: 1, createdAt: 1 });

    for (const invoice of pendingInvoices) {
      if (remainingAmount <= 0) break;

      const invoiceOutstanding = invoice.outstandingAmount || 0;
      if (invoiceOutstanding <= 0) continue;

      const applyAmount = Math.min(remainingAmount, invoiceOutstanding);
      const cashApplied = Math.min(receivedAmount, applyAmount);
      const discountApplied = applyAmount - cashApplied;

      await Payment.create({
        tenantId,
        customerId,
        invoiceId: invoice._id,
        amount: cashApplied,
        discount: discountApplied,
        paymentDate: normalizePaymentDate(paymentDate) || new Date(),
        paymentMode,
        referenceNumber,
        notes: notes || "Ledger payment — distributed",
      });

      invoice.paidAmount = (invoice.paidAmount || 0) + cashApplied;
      invoice.outstandingAmount = Math.max(invoiceOutstanding - applyAmount, 0);
      invoice.paymentStatus = invoice.outstandingAmount <= 0 ? "Paid" : "Partial";

      await invoice.save();

      settledInvoices.push({
        invoiceNumber: invoice.invoiceNumber,
        amountApplied: applyAmount,
        discountApplied,
        newStatus: invoice.paymentStatus,
      });

      remainingAmount -= applyAmount;
    }

    const recalcInvoices = await Invoice.find({
      tenantId,
      customerId,
      paymentStatus: { $in: ["Pending", "Partial"] },
    });
    const invoiceOutstandingTotal = recalcInvoices.reduce(
      (sum, inv) => sum + (inv.outstandingAmount || 0), 0
    );

    const remainingOpeningBalance = Math.max(
      (customer.openingBalance || 0) - (await getOpeningBalanceAlreadyPaid(tenantId, customerId)),
      0
    );

    const newOutstanding = remainingOpeningBalance + invoiceOutstandingTotal;

    await Customer.findByIdAndUpdate(customerId, {
      outstandingAmount: newOutstanding,
    });

    try {
      const tenant = await Tenant.findById(tenantId);
      if (tenant?.whatsappConnected && customer.phone && !customer.isDefault) {
        const invoiceRefs = settledInvoices
          .map((s) => `#${s.invoiceNumber} (₹${s.amountApplied.toFixed(2)})`)
          .join(", ");

        const openingRef = openingBalanceSettled > 0
          ? `Opening Balance (₹${openingBalanceSettled.toFixed(2)})${invoiceRefs ? ", " : ""}`
          : "";

        const message =
          `Hello *${customer.name}*,\n\n` +
          `We have received your payment. Thank you! 🙏\n\n` +
          `💰 *Payment Details:*\n` +
          `• Amount Received: *₹${receivedAmount.toFixed(2)}*\n` +
          (discountAmount > 0 ? `• Discount Given: *₹${discountAmount.toFixed(2)}*\n` : "") +
          `• Mode: *${paymentMode}*\n` +
          `• Applied To: ${openingRef}${invoiceRefs || "—"}\n` +
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
      message: "Payment recorded successfully",
      openingBalanceSettled,
      settledInvoices,
      newOutstanding,
      remainingUnused: remainingAmount,
    });
  } catch (error) {
    console.error("Ledger payment error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

async function getOpeningBalanceAlreadyPaid(tenantId: string, customerId: string): Promise<number> {
  const settlements = await Payment.find({
    tenantId,
    customerId,
    invoiceId: null,
    notes: { $regex: "^OPENING_BALANCE_SETTLEMENT" },
  });

  return settlements.reduce(
    (sum, p) => sum + (p.amount || 0) + ((p as any).discount || 0),
    0
  );
}