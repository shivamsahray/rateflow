import Product from "../models/Product";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const getStockList = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;

  const products = await Product.find({ tenantId }).select(
    "name stock lowStockThreshold unit"
  );

  res.json(products);
};

// PATCH /api/stock/:id — manually stock update karo (purchase/adjustment)
export const updateStock = async (req: AuthRequest, res: Response) => {
  const { quantity, type } = req.body;
  // type: "add" ya "set"

  const update =
    type === "set"
      ? { stock: quantity }
      : { $inc: { stock: quantity } };  // quantity negative bhi ho sakti hai

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  );

  res.json(product);
};