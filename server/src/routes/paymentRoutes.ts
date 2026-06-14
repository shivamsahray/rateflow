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
import { recordPayment, getPaymentsByInvoice } from "../controllers/paymentController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const auth = [authMiddleware, subscriptionMiddleware];

router.post("/",                    ...auth, recordPayment);
router.get("/invoice/:invoiceId",   ...auth, getPaymentsByInvoice);

export default router;