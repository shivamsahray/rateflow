import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes      from "./routes/authRoute";
import customerRoutes  from "./routes/customerRoutes";
import productRoutes   from "./routes/productRoutes";
import pricingRoutes   from "./routes/pricingRoutes";
import invoiceRoutes   from "./routes/invoiceRoutes";
import settingsRoutes  from "./routes/settingsRoutes";
import uploadRoutes    from "./routes/uploadRoutes";
import paymentRoutes   from "./routes/paymentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import stockRoutes     from "./routes/stockRoutes";
import ledgerRoutes    from "./routes/ledgerRoutes";
import adminRoutes     from "./routes/adminRoutes";
import cron            from "node-cron";
import { sendOutstandingReminders, restoreWhatsAppClients } from "./services/whatsappService";
import Tenant          from "./models/Tenant";

connectDB();

const app = express();
// app.use(cors());
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://rateflow.in",
  "https://www.rateflow.in",
  "https://rateflow-1pf4.onrender.com",
  "https://rateflow-lake.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth",      authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products",  productRoutes);
app.use("/api/pricing",   pricingRoutes);
app.use("/api/invoices",  invoiceRoutes);
app.use("/api/settings",  settingsRoutes);
app.use("/api/upload",    uploadRoutes);
app.use("/api/payments",  paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stock",     stockRoutes);
app.use("/api/ledger",    ledgerRoutes);
app.use("/api/admin",     adminRoutes);

app.get("/api/health", (_, res) =>
  res.json({ success: true, message: "RateFlow API running" })
);

// ─── Cron: Daily subscription expiry ─────────────────────────────────────────

cron.schedule("0 0 * * *", async () => {
  console.log("[CRON] Running daily subscription expiry check...");
  const now = new Date();
  const result = await Tenant.updateMany(
    { subscriptionEndDate: { $lt: now }, accountStatus: "ACTIVE" },
    { $set: { accountStatus: "EXPIRED" } }
  );
  console.log(`[CRON] Expired ${result.modifiedCount} tenants`);
});

// ─── Cron: 15-day WhatsApp reminders ─────────────────────────────────────────

cron.schedule("0 9 */15 * *", () => {
  console.log("[CRON] Triggering 15-day outstanding reminder...");
  sendOutstandingReminders();
});

// ─── Server start ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // ✅ restoreWhatsAppClients — session check ke saath
  // await restoreWhatsAppClients();
});



// import dotenv from 'dotenv';

// dotenv.config();
// import express from 'express';
// import cors from 'cors';
// import { connectDB } from './config/db';
// import authRoutes from './routes/authRoute';
// import customerRoutes from "./routes/customerRoutes";

// import productRoutes from "./routes/productRoutes";
// import pricingRoutes from "./routes/pricingRoutes";
// import invoiceRoutes from "./routes/invoiceRoutes";
// import settingsRoutes from "./routes/settingsRoutes";
// import uploadRoutes from "./routes/uploadRoutes";
// import paymentRoutes from "./routes/paymentRoutes";
// import upload from './middleware/uploadMiddleware';
// import dashboardRoutes from './routes/dashboardRoutes'
// import stockRoutes from "./routes/stockRoutes";
// import ledgerRoutes from "./routes/ledgerRoutes"
// import cron from "node-cron";
// import { sendOutstandingReminders } from "./services/whatsappService";
// import Tenant from "./models/Tenant";
// import { getOrCreateClient } from "./services/whatsappService";
// import subscriptionRoutes from "./routes/subscriptionRoutes";


// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use(
//   "/api/customers",
//   customerRoutes
// );  
// app.use(
//   "/api/products",
//   productRoutes
// );
// app.use(
//   "/api/pricing",
//   pricingRoutes
// );

// app.use(
//   "/api/invoices",
//   invoiceRoutes
// );
// app.use(
//   "/api/settings",
//   settingsRoutes
// );
// app.use("/api/ledger", ledgerRoutes);

// app.get('/api/health',(_, res) => {
//     res.status(200).json({
//         success: true,
//         message: "RateFlow API running"
//     });
// });
// app.use(
//   "/api/dashboard",
//   dashboardRoutes
// );
// app.use(
//   "/api/upload",
//   uploadRoutes
// );
// app.use("/api/subscription", subscriptionRoutes)
// app.use("/api/stock", stockRoutes);
// app.use(
//   "/api/payments",
//   paymentRoutes
// );
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running daily subscription check");
//   const now = new Date();
//   const res = await Tenant.updateMany(
//     { subscriptionEndDate: { $lt: now }, accountStatus: { $in: ["ACTIVE", "PENDING"] } },
//     { $set: { accountStatus: "EXPIRED" } }
//   );
//   console.log(`Expired ${res.modifiedCount} tenants whose subscription ended`);
// });
// cron.schedule("0 9 */15 * *", () => {
//   console.log("Triggering 15-day outstanding reminder...");
//   sendOutstandingReminders();
// });
// const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });
// app.listen(PORT, async () => {

//   console.log(
//     `Server is running on port ${PORT}`
//   );

//   const tenants =
//     await Tenant.find({
//       whatsappConnected: true
//     });

//   for (const tenant of tenants) {

//     console.log(
//       `Restoring WhatsApp for ${tenant.companyName}`
//     );

//     getOrCreateClient(
//       tenant._id.toString()
//     );
//   }

// });
