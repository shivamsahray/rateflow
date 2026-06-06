import express from "express";

import {
  recordPayment,
} from "../controllers/paymentController";

import { authMiddleware } from "../middleware/authMiddleware";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  recordPayment
);

export default router;
