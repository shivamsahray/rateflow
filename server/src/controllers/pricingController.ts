import { Response } from "express";
import mongoose from "mongoose";
import PriceHistory from "../models/PriceHistory";
import { AuthRequest } from "../middleware/authMiddleware";

export const getLastPrice = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const customerId =
        req.query.customerId as string;

    const productId =
        req.query.productId as string;

    const record =
      await PriceHistory.findOne({
        tenantId: req.user?.tenantId,
        customerId,
        productId,
      })
      .sort({
        soldAt: -1,
      });

    if (!record) {
      return res.status(404).json({
        message: "No pricing history found",
      });
    }

    return res.status(200).json({
      lastSoldPrice:
        record.soldPrice,
      soldAt:
        record.soldAt,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};




export const seedPriceHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const {
      customerId,
      productId,
      soldPrice,
      quantity,
    } = req.body;

    const record =
      await PriceHistory.create({
        tenantId:
          new mongoose.Types.ObjectId(
            req.user!.tenantId
          ),

        customerId:
          new mongoose.Types.ObjectId(
            customerId
          ),

        productId:
          new mongoose.Types.ObjectId(
            productId
          ),

        soldPrice,
        quantity,
      });

    res.status(201).json(record);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};