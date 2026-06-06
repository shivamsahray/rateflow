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
    res.status(500).json({
      message: "Server Error",
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
  } catch {
    res.status(500).json({
      message: "Server Error",
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
  } catch {
    res.status(500).json({
      message: "Server Error",
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
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
