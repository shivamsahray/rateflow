import QRCode from "qrcode";
import {
  getOrCreateClient,
  sendWhatsAppMessage,
  buildOutstandingReminderMessage,
} from "../services/whatsappService";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Tenant from "../models/Tenant";
import Customer from "../models/Customer";
import Invoice from "../models/Invoice";

// ─── Get QR Code ──────────────────────────────────────────────────────────────

export const getWhatsAppQR = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId as string;
  if (!tenantId) {
    return res.status(401).json({ message: "Tenant not found" });
  }

  const client = getOrCreateClient(tenantId);

  client.once("qr", async (qr) => {
    const qrImage = await QRCode.toDataURL(qr);
    return res.json({ qr: qrImage });
  });
};

// ─── Get Connection Status ────────────────────────────────────────────────────

export const getWhatsAppStatus = async (req: AuthRequest, res: Response) => {
  const tenant = await Tenant.findById(req.user?.tenantId);
  return res.json({ connected: tenant?.whatsappConnected || false });
};

// ─── Manual: Send ledger summary to a specific customer ──────────────────────
// POST /api/whatsapp/send-ledger/:customerId

export const sendLedgerUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId as string;
    const { customerId } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant?.whatsappConnected) {
      return res.status(400).json({ message: "WhatsApp not connected" });
    }

    const customer = await Customer.findOne({ _id: customerId, tenantId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!customer.phone) {
      return res.status(400).json({ message: "Customer has no phone number" });
    }

    // Get all pending invoices for this customer
    const pendingInvoices = await Invoice.find({
      tenantId,
      customerId,
      paymentStatus: { $in: ["Pending", "Partial"] },
    }).select("invoiceNumber outstandingAmount");
    // console.log("Customer:", customer);
    // console.log("Customer Outstanding:", customer.outstandingAmount);
    // console.log("Invoices:", pendingInvoices.length);
    const totalOutstanding = pendingInvoices.reduce(
    (sum, invoice) => sum + (invoice.outstandingAmount || 0),
    0
    );

    console.log("Total Outstanding:", totalOutstanding);
    if (totalOutstanding <= 0 ) {
    // console.log("FAILED CONDITION");
    // console.log("Outstanding:", customer.outstandingAmount);
    // console.log("Invoices:", pendingInvoices.length);

    return res.status(400).json({
        message: "No outstanding amount for this customer",
    });
    }

    const message = buildOutstandingReminderMessage(
      tenant.companyName,
      customer.name,
      totalOutstanding,
      pendingInvoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        amount: inv.outstandingAmount,
      }))
    );

    const result = await sendWhatsAppMessage(tenantId, customer.phone, message);

    if (!result.success) {
      return res.status(500).json({ message: result.error });
    }

    return res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};