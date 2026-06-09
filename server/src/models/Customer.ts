import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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

    gstNumber: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    creditLimit: {
      type: Number,
      default: 0,
    },

    outstandingAmount: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Customer",
  customerSchema
);