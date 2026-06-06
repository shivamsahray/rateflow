import express from "express";

import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  getNextInvoiceNumber,
} from "../controllers/invoiceController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createInvoice
);

router.get(
  "/",
  authMiddleware,
  getInvoices
);

router.get(
  "/next-number",
  authMiddleware,
  getNextInvoiceNumber
);

router.get(
  "/:id",
  authMiddleware,
  getInvoiceById
);



export default router;