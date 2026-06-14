
import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
    planType: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      required: true
    },
    amount: { type: Number, required: true },
    screenshot: { type: String, required: true },  // Path to uploaded proof image
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("PaymentRequest", paymentRequestSchema);
