import Product from "../models/Product";
import StockLedger from "../models/StockLedger";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getStockList = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  const searchTerm = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const stockStatus = typeof req.query.stockStatus === "string" ? req.query.stockStatus : "all";

  const filter: Record<string, any> = { tenantId };

  if (searchTerm) {
    const pattern = new RegExp(escapeRegex(searchTerm), "i");
    filter.$or = [
      { name: pattern },
      { sku: pattern },
      { unit: pattern },
    ];
  }

  if (stockStatus !== "all") {
    const statusFilters: Record<string, any>[] = [];

    if (stockStatus === "in-stock") {
      statusFilters.push({ $expr: { $gt: ["$stock", "$lowStockThreshold"] } });
    }

    if (stockStatus === "low-stock") {
      statusFilters.push({
        $expr: {
          $and: [
            { $lte: ["$stock", "$lowStockThreshold"] },
            { $gt: ["$stock", 0] },
          ],
        },
      });
    }

    if (stockStatus === "out-of-stock") {
      statusFilters.push({ stock: { $lte: 0 } });
    }

    if (statusFilters.length > 0) {
      filter.$and = [...(filter.$and || []), ...statusFilters];
    }
  }

  const products = await Product.find(filter)
    .sort({ name: 1 })
    .select("name sku stock lowStockThreshold unit");

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