import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },
        plan: {
            type: String,
            default: "FREE",
        },
        invoiceCounter: {
            type: Number,
            default: 1,
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

        logo: {
        type: String,
        default: "",
        },

        signature: {
        type: String,
        default: "",
        },
        whatsappConnected: {
            type: Boolean,
            default: false,
        },

        whatsappNumber: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Tenant", tenantSchema);