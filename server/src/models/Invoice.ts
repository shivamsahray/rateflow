import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    gstPercent: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const invoiceSchema = new mongoose.Schema(
  {
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

    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceDate: {
    type: Date,
    default: Date.now,
    },

    paymentStatus: {
    type: String,
    enum: [
        "Pending",
        "Partial",
        "Paid",
    ],
    default: "Pending",
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    outstandingAmount: {
      type: Number,
      default: 0,
    },

    notes: {
    type: String,
    default: "",
    },

    paymentTerms: {
    type: String,
    default: "",
    },

    items: [invoiceItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Invoice",
  invoiceSchema
);
