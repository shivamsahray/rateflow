import express from "express";
import { getCustomerLedger } from "../controllers/ledgerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { recordLedgerPayment } from "../controllers/ledgerPaymentController";

const router = express.Router();

// GET /api/ledger/:customerId
router.get("/:customerId", authMiddleware, getCustomerLedger);
router.post("/:customerId/payment", authMiddleware, recordLedgerPayment);

export default router;