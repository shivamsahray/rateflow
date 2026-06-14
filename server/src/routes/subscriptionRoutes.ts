// routes/subscriptionRoutes.ts
import express from "express";
import {
  createPaymentRequest,
  listPaymentRequests,
  approvePaymentRequest,
  rejectPaymentRequest
} from "../controllers/paymentRequestController";
import { authMiddleware } from "../middleware/authMiddleware";
import { paymentUpload } from "../utils/upload";  // Multer config from above

const router = express.Router();

// Tenant submits subscription payment request
router.post(
  "/request",
  authMiddleware,
  paymentUpload.single("screenshot"),   // handle file upload
  createPaymentRequest
);

// Admin views and manages requests
// (Assume authMiddleware sets req.user, and we check req.user.role == "ADMIN" inside or via another middleware)
router.get("/admin/requests", authMiddleware, listPaymentRequests);
router.post("/admin/requests/:id/approve", authMiddleware, approvePaymentRequest);
router.post("/admin/requests/:id/reject", authMiddleware, rejectPaymentRequest);

export default router;
