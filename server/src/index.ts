import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoute';
import customerRoutes from "./routes/customerRoutes";

import productRoutes from "./routes/productRoutes";
import pricingRoutes from "./routes/pricingRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import upload from './middleware/uploadMiddleware';
import dashboardRoutes from './routes/dashboardRoutes'
import stockRoutes from "./routes/stockRoutes";
import ledgerRoutes from "./routes/ledgerRoutes"
import cron from "node-cron";
import { sendOutstandingReminders } from "./services/whatsappService";



connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(
  "/api/customers",
  customerRoutes
);  
app.use(
  "/api/products",
  productRoutes
);
app.use(
  "/api/pricing",
  pricingRoutes
);

app.use(
  "/api/invoices",
  invoiceRoutes
);
app.use(
  "/api/settings",
  settingsRoutes
);
app.use("/api/ledger", ledgerRoutes);

app.get('/api/health',(_, res) => {
    res.status(200).json({
        success: true,
        message: "RateFlow API running"
    });
});
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/upload",
  uploadRoutes
);
app.use("/api/stock", stockRoutes);
app.use(
  "/api/payments",
  paymentRoutes
);
cron.schedule("0 9 */15 * *", () => {
  console.log("Triggering 15-day outstanding reminder...");
  sendOutstandingReminders();
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
