// import { Response } from "express";
// import Customer from "../models/Customer";
// import { AuthRequest } from "../middleware/authMiddleware";

// export const createCustomer = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const customer =
//       await Customer.create({
//         ...req.body,
//         tenantId: req.user?.tenantId,
//       });

//     res.status(201).json(customer);
//   } catch (error) {
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// export const getCustomers = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const customers = await Customer.find({
//       tenantId: req.user?.tenantId,
//     }).sort({
//       isDefault: -1,
//       name: 1,
//     });

//     res.status(200).json(customers);
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// export const updateCustomer = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const customer =
//       await Customer.findOneAndUpdate(
//         {
//           _id: req.params.id,
//           tenantId: req.user?.tenantId,
//         },
//         req.body,
//         {
//           new: true,
//         }
//       );

//     res.status(200).json(customer);
//   } catch {
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// export const deleteCustomer = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {

//     const customer =
//       await Customer.findOne({
//         _id: req.params.id,
//         tenantId: req.user?.tenantId,
//       });

//     if (!customer) {
//       return res.status(404).json({
//         message: "Customer not found",
//       });
//     }

//     if (customer.isDefault) {
//       return res.status(400).json({
//         message:
//           "Default customer cannot be deleted",
//       });
//     }

//     await Customer.findOneAndDelete({
//       _id: req.params.id,
//       tenantId: req.user?.tenantId,
//     });

//     res.status(200).json({
//       message: "Customer Deleted",
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Server Error",
//     });

//   }
// };
import { Response } from "express";
import Customer from "../models/Customer";
import { AuthRequest } from "../middleware/authMiddleware";

export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const openingBalance = Number(req.body.openingBalance) || 0;

    const customer = await Customer.create({
      ...req.body,
      tenantId: req.user?.tenantId,
      openingBalance,
      // ✅ Naya customer ka outstanding shuru mein = opening balance
      // (aage invoices/payments isi mein add/subtract honge)
      outstandingAmount: openingBalance,
      openingBalanceDate: req.body.openingBalanceDate || new Date(),
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await Customer.find({
      tenantId: req.user?.tenantId,
    }).sort({ isDefault: -1, name: 1 });

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Opening balance edit hone par outstandingAmount bhi recalculate karna padega
    // (kyunki outstandingAmount = openingBalance + unpaid invoices - payments)
    const existing = await Customer.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!existing) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updateData = { ...req.body };

    if (
      updateData.openingBalance !== undefined &&
      Number(updateData.openingBalance) !== existing.openingBalance
    ) {
      const oldOpeningBalance = existing.openingBalance || 0;
      const newOpeningBalance = Number(updateData.openingBalance) || 0;
      const diff = newOpeningBalance - oldOpeningBalance;

      // outstandingAmount ko bhi usi farak se adjust karo
      updateData.outstandingAmount = (existing.outstandingAmount || 0) + diff;
      updateData.openingBalance = newOpeningBalance;
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      updateData,
      { new: true }
    );

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.isDefault) {
      return res.status(400).json({
        message: "Default customer cannot be deleted",
      });
    }

    await Customer.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    res.status(200).json({ message: "Customer Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};