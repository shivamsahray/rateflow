import { Client, LocalAuth } from "whatsapp-web.js";
import Tenant from "../models/Tenant";
import Customer from "../models/Customer";
import Invoice from "../models/Invoice";

const clients = new Map<string, Client>();
export const whatsappStatus = new Map<string, boolean>();

// ─── Cleanup helper ───────────────────────────────────────────────────────────

const cleanupClient = async (tenantId: string) => {
  whatsappStatus.set(tenantId, false);
  clients.delete(tenantId);
  await Tenant.findByIdAndUpdate(tenantId, { whatsappConnected: false });
  console.log(`[WA] Client cleaned up for tenant ${tenantId}`);
};

// ─── Get or create WhatsApp client per tenant ────────────────────────────────

export const getOrCreateClient = (tenantId: string): Client => {
  if (clients.has(tenantId)) {
    return clients.get(tenantId)!;
  }
  console.log(
    "Chrome Path:",
    process.env.PUPPETEER_EXECUTABLE_PATH
  );

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: tenantId }),
    // Puppeteer timeout increase karo
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    },
  });

  client.on("qr", () => {
    console.log(`[WA] QR Generated for tenant ${tenantId}`);
  });

  client.on("authenticated", () => {
    console.log(`[WA] Authenticated for tenant ${tenantId}`);
  });

  client.on("ready", async () => {
    whatsappStatus.set(tenantId, true);
    await Tenant.findByIdAndUpdate(tenantId, { whatsappConnected: true });
    console.log(`[WA] Ready for tenant ${tenantId}`);
  });

  // ✅ FIX 1: auth_failure — linked device se logout hone pe ye fire hota hai
  client.on("auth_failure", async (msg) => {
    console.log(`[WA] Auth failure for tenant ${tenantId}: ${msg}`);
    await cleanupClient(tenantId);
    // Client destroy karo taaki dobara QR loop na ho
    try { await client.destroy(); } catch {}
  });

  // ✅ FIX 2: disconnected — network issue ya WhatsApp se logout
  client.on("disconnected", async (reason) => {
    console.log(`[WA] Disconnected for tenant ${tenantId}: ${reason}`);
    await cleanupClient(tenantId);
    // Destroy karo taaki memory leak na ho
    try { await client.destroy(); } catch {}
  });

  client.initialize();
  clients.set(tenantId, client);
  return client;
};

// ─── ✅ FIX 3: Server start pe restore — sirf agar session file exist kare ──
// Pehle ye seedha getOrCreateClient call karta tha → QR loop
// Ab pehle check karo ki LocalAuth session exist karta hai

import * as fs from "fs";
import * as path from "path";

const sessionExists = (tenantId: string): boolean => {
  // whatsapp-web.js LocalAuth session folder
  const sessionPath = path.join(
    process.cwd(),
    ".wwebjs_auth",
    `session-${tenantId}`
  );
  return fs.existsSync(sessionPath);
};

export const restoreWhatsAppClients = async () => {
  try {
    const connectedTenants = await Tenant.find({ whatsappConnected: true });
    console.log(`[WA] Attempting restore for ${connectedTenants.length} tenant(s)`);

    for (const tenant of connectedTenants) {
      const tenantId = tenant._id.toString();

      // ✅ Session file exist kare tabhi restore karo
      if (sessionExists(tenantId)) {
        console.log(`[WA] Session found — restoring for ${tenant.companyName}`);
        getOrCreateClient(tenantId);
      } else {
        // Session nahi hai — DB mein bhi false kardo
        console.log(`[WA] No session found for ${tenant.companyName} — marking disconnected`);
        await Tenant.findByIdAndUpdate(tenantId, { whatsappConnected: false });
      }
    }
  } catch (error) {
    console.error("[WA] Restore error:", error);
  }
};

// ─── Disconnect a tenant manually ─────────────────────────────────────────────

export const disconnectClient = async (tenantId: string) => {
  const client = clients.get(tenantId);
  if (client) {
    try { await client.logout(); } catch {}
    try { await client.destroy(); } catch {}
  }
  await cleanupClient(tenantId);
};

// ─── Format phone number ──────────────────────────────────────────────────────

const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("91") ? digits : `91${digits}`;
  return `${withCountry}@c.us`;
};

// ─── Core send function ───────────────────────────────────────────────────────

export const sendWhatsAppMessage = async (
  tenantId: string,
  phone: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant?.whatsappConnected) {
      return { success: false, error: "WhatsApp not connected" };
    }

    const client = clients.get(tenantId);
    if (!client) {
      // Client memory mein nahi — DB sync nahi tha
      await Tenant.findByIdAndUpdate(tenantId, { whatsappConnected: false });
      return { success: false, error: "WhatsApp client not in memory. Please reconnect." };
    }

    // Client state check karo
    const state = await client.getState().catch(() => null);
    if (state !== "CONNECTED") {
      await cleanupClient(tenantId);
      return { success: false, error: `WhatsApp not connected (state: ${state})` };
    }

    const chatId = formatPhone(phone);
    console.log(`[WA] Sending to ${chatId}`);
    await client.sendMessage(chatId, message);
    console.log(`[WA] Message sent to ${phone}`);

    return { success: true };
  } catch (error: any) {
    console.error(`[WA] Send error for tenant ${tenantId}:`, error.message);
    return { success: false, error: error.message };
  }
};

// ─── Message Templates ────────────────────────────────────────────────────────

export const buildInvoiceMessage = (
  companyName: string,
  customerName: string,
  invoiceNumber: string,
  grandTotal: number,
  invoiceDate: string
): string =>
  `Hello *${customerName}*,\n\n` +
  `Your invoice has been generated by *${companyName}*.\n\n` +
  `📄 *Invoice Details:*\n` +
  `• Invoice No: *${invoiceNumber}*\n` +
  `• Date: *${invoiceDate}*\n` +
  `• Amount: *₹${grandTotal.toFixed(2)}*\n\n` +
  `Please make the payment at your earliest convenience.\n\n` +
  `_This is an automated message from RateFlow ERP._`;

export const buildPaymentReceivedMessage = (
  companyName: string,
  customerName: string,
  invoiceNumber: string,
  paidAmount: number,
  outstandingAmount: number,
  paymentMode: string
): string => {
  const outstandingLine =
    outstandingAmount > 0
      ? `• Outstanding Balance: *₹${outstandingAmount.toFixed(2)}*\n`
      : `• Status: *Fully Paid ✅*\n`;
  return (
    `Hello *${customerName}*,\n\n` +
    `We have received your payment. Thank you! 🙏\n\n` +
    `💰 *Payment Details:*\n` +
    `• Invoice No: *${invoiceNumber}*\n` +
    `• Amount Received: *₹${paidAmount.toFixed(2)}*\n` +
    `• Mode: *${paymentMode}*\n` +
    outstandingLine +
    `\n_This is an automated message from ${companyName} via RateFlow ERP._`
  );
};

export const buildOutstandingReminderMessage = (
  companyName: string,
  customerName: string,
  outstandingAmount: number,
  pendingInvoices: { invoiceNumber: string; amount: number }[]
): string => {
  const invoiceLines = pendingInvoices
    .slice(0, 5)
    .map((inv) => `  • Invoice #${inv.invoiceNumber}: ₹${inv.amount.toFixed(2)}`)
    .join("\n");
  const moreText =
    pendingInvoices.length > 5
      ? `\n  ...and ${pendingInvoices.length - 5} more invoices`
      : "";
  return (
    `Hello *${customerName}*,\n\n` +
    `This is a friendly reminder from *${companyName}*.\n\n` +
    `📋 *Outstanding Payment Details:*\n` +
    invoiceLines + moreText +
    `\n\n💰 *Total Outstanding: ₹${outstandingAmount.toFixed(2)}*\n\n` +
    `Kindly clear your dues at the earliest.\n\n` +
    `_This is an automated reminder from RateFlow ERP._`
  );
};

// ─── Scheduled: 15-day outstanding reminders ──────────────────────────────────

export const sendOutstandingReminders = async () => {
  console.log("[WA] Running 15-day outstanding reminder job...");
  try {
    const tenants = await Tenant.find({ whatsappConnected: true });
    for (const tenant of tenants) {
      const tenantId = tenant._id.toString();
      const customers = await Customer.find({
        tenantId,
        outstandingAmount: { $gt: 0 },
        isDefault: false,
        phone: { $ne: "", $exists: true },
      });
      for (const customer of customers) {
        if (!customer.phone) continue;
        const pendingInvoices = await Invoice.find({
          tenantId,
          customerId: customer._id,
          paymentStatus: { $in: ["Pending", "Partial"] },
        }).select("invoiceNumber outstandingAmount");
        if (pendingInvoices.length === 0) continue;
        const message = buildOutstandingReminderMessage(
          tenant.companyName,
          customer.name,
          customer.outstandingAmount,
          pendingInvoices.map((inv) => ({
            invoiceNumber: inv.invoiceNumber,
            amount: inv.outstandingAmount,
          }))
        );
        const result = await sendWhatsAppMessage(tenantId, customer.phone, message);
        console.log(result.success
          ? `[WA] Reminder sent to ${customer.name}`
          : `[WA] Failed for ${customer.name}: ${result.error}`
        );
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  } catch (error) {
    console.error("[WA] Outstanding reminder job error:", error);
  }
};