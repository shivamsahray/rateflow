import express from "express";
import { getCustomerLedger } from "../controllers/ledgerController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/ledger/:customerId
router.get("/:customerId", authMiddleware, getCustomerLedger);

export default router;