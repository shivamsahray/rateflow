import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController";

import { authMiddleware } from "../middleware/authMiddleware";
import { getWhatsAppQR, getWhatsAppStatus } from "../controllers/whatsappController";

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

export default router;