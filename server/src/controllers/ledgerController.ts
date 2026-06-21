import { Response } from "express";
import Invoice from "../models/Invoice";
import Payment from "../models/Payment";
import Customer from "../models/Customer";
import { AuthRequest } from "../middleware/authMiddleware";

export const getCustomerLedger = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.user?.tenantId;

    const customer = await Customer.findOne({ _id: customerId, tenantId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const invoices = await Invoice.find({ customerId, tenantId })
      .sort({ invoiceDate: 1, createdAt: 1 });

    const payments = await Payment.find({ customerId, tenantId })
      .sort({ paymentDate: 1, createdAt: 1 });

    type LedgerEntry = {
      date: Date;
      type: "opening" | "invoice" | "payment";
      description: string;
      invoiceNumber?: string;
      invoiceId?: string;
      debit: number;
      credit: number;
      balance: number;
    };

    const rawEntries: Omit<LedgerEntry, "balance">[] = [];

    // ✅ NEW: Opening Balance ko sabse pehli entry banao
    const openingBalance = customer.openingBalance || 0;
    if (openingBalance !== 0) {
      rawEntries.push({
        date: customer.openingBalanceDate || (customer as any).createdAt,
        type: "opening",
        description: "Opening Balance (Brought Forward)",
        debit:  openingBalance > 0 ? openingBalance : 0,
        credit: openingBalance < 0 ? Math.abs(openingBalance) : 0,
      });
    }

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

    for (const pay of payments) {
      const discount = (pay as any).discount || 0;
      const totalCredit = pay.amount + discount;

      const linkedInvoice = invoices.find(
        (inv) => inv._id.toString() === pay.invoiceId?.toString()
      );
      const invRef = linkedInvoice ? ` (Invoice #${linkedInvoice.invoiceNumber})` : "";

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

    // ✅ Opening balance hamesha sabse pehle rahe — date se sort karne ke baad
    // bhi agar koi invoice opening date se pehle ki ho (edge case), opening ko
    // top pe hi pin karo
    rawEntries.sort((a, b) => {
      if (a.type === "opening") return -1;
      if (b.type === "opening") return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    let runningBalance = 0;
    const entries: LedgerEntry[] = rawEntries.map((entry) => {
      runningBalance += entry.debit - entry.credit;
      return { ...entry, balance: runningBalance };
    });

    // ── Summary ───────────────────────────────────────────────────────────────
    const totalInvoiced = invoices.reduce((s, inv) => s + inv.grandTotal, 0);
    const totalPaid     = payments.reduce((s, pay) => s + pay.amount, 0);
    const totalDiscount = payments.reduce((s, pay) => s + ((pay as any).discount || 0), 0);

    // ✅ outstanding ab opening balance ko bhi include karta hai
    const outstanding = openingBalance + totalInvoiced - totalPaid - totalDiscount;

    res.json({
      customer,
      entries,
      summary: {
        openingBalance,        // ✅ NEW
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