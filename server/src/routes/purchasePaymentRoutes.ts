import express from "express";
import { createPurchasePayment, deletePurchasePayment, getPurchasePayments } from "../controllers/purchasePaymentController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const auth = [authMiddleware, subscriptionMiddleware];

router.get("/", ...auth, getPurchasePayments);
router.post("/", ...auth, createPurchasePayment);
router.delete("/:id", ...auth, deletePurchasePayment);

export default router;
