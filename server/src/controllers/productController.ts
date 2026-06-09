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
    const products =
      await Product.find({
        tenantId: req.user?.tenantId,
      });

    res.status(200).json(products);
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
