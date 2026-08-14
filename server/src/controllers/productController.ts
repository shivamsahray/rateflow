import { Response } from "express";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

export const createProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const product =
      await Product.create({
        ...req.body,
        tenantId: req.user?.tenantId,
      });

    res.status(201).json(product);
  } catch (error) {
  console.error("Create Product Error:", error);

  res.status(500).json({
    message: "Server Error",
    error,
  });
}
};

export const getProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 15);
    const search = (req.query.search as string) || "";

    const filter: any = { tenantId: req.user?.tenantId };

    if (search && search.trim().length > 0) {
      // simple case-insensitive partial match on name or sku
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
  console.error("Create Product Error:", error);

  res.status(500).json({
    message: "Server Error",
    error,
  });
}
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const product =
      await Product.findOneAndUpdate(
        {
          _id: req.params.id,
          tenantId: req.user?.tenantId,
        },
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json(product);
  } catch (error) {
  console.error("Create Product Error:", error);

  res.status(500).json({
    message: "Server Error",
    error,
  });
}
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await Product.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    res.status(200).json({
      message: "Product Deleted",
    });
  } catch (error) {
  console.error("Create Product Error:", error);

  res.status(500).json({
    message: "Server Error",
    error,
  });
}
};
