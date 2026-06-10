import express from "express";
import { getStockList, updateStock } from "../controllers/stockController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getStockList);
router.patch("/:id", authMiddleware, updateStock);

export default router;