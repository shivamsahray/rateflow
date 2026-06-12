import { Response } from "express";
import Invoice from "../models/Invoice";
import Payment from "../models/Payment";
import Customer from "../models/Customer";
import { AuthRequest } from "../middleware/authMiddleware";

export const getCustomerLedger = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.user?.tenantId;

    // Verify customer belongs to this tenant
    const customer = await Customer.findOne({ _id: customerId, tenantId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch all invoices for this customer
    const invoices = await Invoice.find({ customerId, tenantId })
      .sort({ invoiceDate: 1, createdAt: 1 });

    // Fetch all payments for this customer
    const payments = await Payment.find({ customerId, tenantId })
      .sort({ paymentDate: 1, createdAt: 1 });

    // ── Build ledger entries ──────────────────────────────────────────────────
    // Each entry is: date, type (invoice/payment), description, debit, credit
    // Running balance = sum of debits - sum of credits (positive = customer owes)

    type LedgerEntry = {
      date: Date;
      type: "invoice" | "payment";
      description: string;
      invoiceNumber?: string;
      invoiceId?: string;
      debit: number;    // Amount customer owes (invoice raised)
      credit: number;   // Amount customer paid (payment received + discount)
      balance: number;  // Running balance
    };

    const rawEntries: Omit<LedgerEntry, "balance">[] = [];

    // Add invoice entries (debit — customer owes us)
    for (const inv of invoices) {
      rawEntries.push({
        date: inv.invoiceDate || inv.createdAt,
        type: "invoice",
        description: `Invoice #${inv.invoiceNumber}`,
        invoiceNumber: inv.invoiceNumber,
        invoiceId: inv._id.toString(),
        debit: inv.grandTotal,
        credit: 0,
      });
    }

    // Add payment entries (credit — customer paid)
    for (const pay of payments) {
      const discount = (pay as any).discount || 0;
      const totalCredit = pay.amount + discount;

      // Find linked invoice number for description
      const linkedInvoice = invoices.find(
        (inv) => inv._id.toString() === pay.invoiceId?.toString()
      );
      const invRef = linkedInvoice
        ? ` (Invoice #${linkedInvoice.invoiceNumber})`
        : "";

      rawEntries.push({
        date: pay.paymentDate || pay.createdAt,
        type: "payment",
        description: `Payment received via ${pay.paymentMode}${invRef}${
          pay.referenceNumber ? ` — Ref: ${pay.referenceNumber}` : ""
        }${discount > 0 ? ` + Discount ₹${discount.toFixed(2)}` : ""}`,
        invoiceNumber: linkedInvoice?.invoiceNumber,
        invoiceId: pay.invoiceId?.toString(),
        debit: 0,
        credit: totalCredit,
      });
    }

    // Sort all entries by date ascending
    rawEntries.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate running balance
    let runningBalance = 0;
    const entries: LedgerEntry[] = rawEntries.map((entry) => {
      runningBalance += entry.debit - entry.credit;
      return { ...entry, balance: runningBalance };
    });

    // ── Summary ───────────────────────────────────────────────────────────────
    const totalInvoiced = invoices.reduce((s, inv) => s + inv.grandTotal, 0);
    const totalPaid     = payments.reduce((s, pay) => s + pay.amount, 0);
    const totalDiscount = payments.reduce((s, pay) => s + ((pay as any).discount || 0), 0);
    const outstanding   = totalInvoiced - totalPaid - totalDiscount;

    res.json({
      customer,
      entries,
      summary: {
        totalInvoiced,
        totalPaid,
        totalDiscount,
        outstanding,
        invoiceCount:  invoices.length,
        paymentCount:  payments.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};