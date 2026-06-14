import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },
        plan: {
        type: String,
        enum: ["FREE", "TRIAL", "MONTHLY", "YEARLY"], 
        default: "TRIAL"
        },
        accountStatus: {
        type: String,
        enum: ["ACTIVE", "PENDING", "EXPIRED"],
        default: "ACTIVE"
        },
        subscriptionType: {
        type: String,
        enum: ["TRIAL", "MONTHLY", "YEARLY"],
        default: "TRIAL"
        },
        trialEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 7*24*60*60*1000)  // 7 days from now
        },
        subscriptionEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 7*24*60*60*1000)
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