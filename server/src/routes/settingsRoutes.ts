import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController";

import { authMiddleware } from "../middleware/authMiddleware";
import { getWhatsAppQR, getWhatsAppStatus, sendLedgerUpdate } from "../controllers/whatsappController";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getSettings
);

router.put(
  "/",
  authMiddleware,
  updateSettings
);

router.get(
  "/whatsapp/qr",
  authMiddleware,
  getWhatsAppQR
);

router.get(
  "/whatsapp/status",
  authMiddleware,
  getWhatsAppStatus
);

router.post("/whatsapp/send-ledger/:customerId", authMiddleware, sendLedgerUpdate);

export default router;