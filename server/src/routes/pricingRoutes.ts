import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLastPrice, seedPriceHistory } from "../controllers/pricingController";

const router = express.Router();

router.get(
  "/last-price",
  authMiddleware,
  getLastPrice
);

router.post(
  "/seed",
  authMiddleware,
  seedPriceHistory
);

export default router;