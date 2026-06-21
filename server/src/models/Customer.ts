// import mongoose from "mongoose";

// const customerSchema = new mongoose.Schema(
//   {
//     tenantId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Tenant",
//       required: true,
//       index: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     gstNumber: {
//       type: String,
//       default: "",
//     },

//     phone: {
//       type: String,
//       default: "",
//     },

//     email: {
//       type: String,
//       default: "",
//     },

//     address: {
//       type: String,
//       default: "",
//     },

//     creditLimit: {
//       type: Number,
//       default: 0,
//     },

//     outstandingAmount: {
//       type: Number,
//       default: 0,
//     },
//     isDefault: {
//       type: Boolean,
//       default: false,
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model(
//   "Customer",
//   customerSchema
// );
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

    // ✅ NEW: Naya customer add karte time pehle se jo balance baki tha
    // Ye sirf reference ke liye save rehta hai (kabhi change nahi hota)
    openingBalance: {
      type: Number,
      default: 0,
    },

    // outstandingAmount ab openingBalance + unpaid invoices - payments hota hai
    outstandingAmount: {
      type: Number,
      default: 0,
    },

    // ✅ NEW: Opening balance kab se hai (ledger mein date dikhane ke liye)
    openingBalanceDate: {
      type: Date,
      default: Date.now,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Customer", customerSchema);