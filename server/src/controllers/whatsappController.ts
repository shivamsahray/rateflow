import QRCode from "qrcode";
import {
  getOrCreateClient,
  sendWhatsAppMessage,
  buildOutstandingReminderMessage,
  disconnectClient,
} from "../services/whatsappService";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Tenant from "../models/Tenant";
import Customer from "../models/Customer";
import Invoice from "../models/Invoice";

// ─── Get QR Code ──────────────────────────────────────────────────────────────

export const getWhatsAppQR = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId as string;
  if (!tenantId) return res.status(401).json({ message: "Tenant not found" });

  const client = getOrCreateClient(tenantId);

  // Agar already connected hai toh QR mat bhejo
  try {
    const state = await client.getState();
    if (state === "CONNECTED") {
      return res.json({ qr: null, connected: true });
    }
  } catch {}

  // QR event — once only
  client.once("qr", async (qr) => {
    const qrImage = await QRCode.toDataURL(qr);
    return res.json({ qr: qrImage, connected: false });
  });
};

// ─── Get Status ───────────────────────────────────────────────────────────────

export const getWhatsAppStatus = async (req: AuthRequest, res: Response) => {
  const tenant = await Tenant.findById(req.user?.tenantId);
  return res.json({ connected: tenant?.whatsappConnected || false });
};

// ─── ✅ NEW: Disconnect WhatsApp ──────────────────────────────────────────────
// POST /api/settings/whatsapp/disconnect

export const disconnectWhatsApp = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId as string;
    await disconnectClient(tenantId);
    return res.json({ message: "WhatsApp disconnected" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ─── Send ledger reminder to customer ────────────────────────────────────────

export const sendLedgerUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId as string;
    const { customerId } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant?.whatsappConnected) {
      return res.status(400).json({ message: "WhatsApp not connected" });
    }

    const customer = await Customer.findOne({ _id: customerId, tenantId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    if (!customer.phone) return res.status(400).json({ message: "Customer has no phone number" });

    const pendingInvoices = await Invoice.find({
      tenantId,
      customerId,
      paymentStatus: { $in: ["Pending", "Partial"] },
    }).select("invoiceNumber outstandingAmount");

    const totalOutstanding = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.outstandingAmount || 0), 0
    );

    if (totalOutstanding <= 0) {
      return res.status(400).json({ message: "No outstanding amount for this customer" });
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
    if (!result.success) return res.status(500).json({ message: result.error });

    return res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};