// import express from "express";
// import { getCustomerLedger } from "../controllers/ledgerController";
// import { authMiddleware } from "../middleware/authMiddleware";
// import { recordLedgerPayment } from "../controllers/ledgerPaymentController";

// const router = express.Router();

// // GET /api/ledger/:customerId
// router.get("/:customerId", authMiddleware, getCustomerLedger);
// router.post("/:customerId/payment", authMiddleware, recordLedgerPayment);

// export default router;

import express from "express";
import { getCustomerLedger } from "../controllers/ledgerController";
import { recordLedgerPayment } from "../controllers/ledgerPaymentController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const auth = [authMiddleware, subscriptionMiddleware];

router.get("/:customerId",          ...auth, getCustomerLedger);
router.post("/:customerId/payment", ...auth, recordLedgerPayment);

export default router;