import express from "express";
import {
  recordPayment,
  getPaymentsByInvoice,
} from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, recordPayment);
router.get("/invoice/:invoiceId", authMiddleware, getPaymentsByInvoice);

export default router;  