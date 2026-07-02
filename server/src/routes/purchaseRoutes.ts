import express from "express";
import {
  createPurchase,
  deletePurchase,
  getPurchaseById,
  getPurchases,
} from "../controllers/purchaseController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const auth = [authMiddleware, subscriptionMiddleware];

router.get("/", ...auth, getPurchases);
router.get("/:id", ...auth, getPurchaseById);
router.post("/", ...auth, createPurchase);
router.delete("/:id", ...auth, deletePurchase);

export default router;
