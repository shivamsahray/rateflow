import Product from "../models/Product";
import StockLedger from "../models/StockLedger";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const getStockList = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;

  const products = await Product.find({ tenantId }).select(
    "name stock lowStockThreshold unit"
  );

  res.json(products);
};

export const getStockLedger = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const productId = req.query.productId as string | undefined;

    const filter: Record<string, unknown> = { tenantId };
    if (productId) {
      filter.productId = productId;
    }

    const ledger = await StockLedger.find(filter)
      .populate("productId", "name sku")
      .sort({ createdAt: -1 });

    return res.json(ledger);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
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