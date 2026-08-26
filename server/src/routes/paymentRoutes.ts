// import express from "express";
// import {
//   recordPayment,
//   getPaymentsByInvoice,
// } from "../controllers/paymentController";
// import { authMiddleware } from "../middleware/authMiddleware";

// const router = express.Router();

// router.post("/", authMiddleware, recordPayment);
// router.get("/invoice/:invoiceId", authMiddleware, getPaymentsByInvoice);

// export default router;  

import express from "express";
import {
  recordPayment,
  getPayments,
  getPaymentById,
  getPaymentsByInvoice,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const auth = [authMiddleware, subscriptionMiddleware];

router.get("/", ...auth, getPayments);
router.post("/", ...auth, recordPayment);
router.get("/invoice/:invoiceId", ...auth, getPaymentsByInvoice);
router.get("/:id", ...auth, getPaymentById);
router.put("/:id", ...auth, updatePayment);
router.delete("/:id", ...auth, deletePayment);

export default router;