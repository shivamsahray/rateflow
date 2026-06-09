import express from "express";

import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  getNextInvoiceNumber,
  updateInvoice,
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
router.put("/:id", authMiddleware, updateInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);


export default router;