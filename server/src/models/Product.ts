import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    gstPercent: {
      type: Number,
      default: 18,
    },

    defaultPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,  // jab stock 10 se kam ho toh alert
    },
  },
  {
    timestamps: true,
  }
);

// Add a text index on name and sku for faster search
productSchema.index({ name: 'text', sku: 'text' });

export default mongoose.model(
  "Product",
  productSchema
);