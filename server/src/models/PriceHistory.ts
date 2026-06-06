import mongoose, { InferSchemaType } from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  soldPrice: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  soldAt: {
    type: Date,
    default: Date.now,
  },
});

export type PriceHistoryType =
  InferSchemaType<typeof priceHistorySchema>;

const PriceHistory = mongoose.model(
  "PriceHistory",
  priceHistorySchema
);

export default PriceHistory;