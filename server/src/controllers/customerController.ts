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
      outstandingAmount: openingBalance,
      openingBalanceDate: req.body.openingBalanceDate || new Date(),
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCustomerListQuery = (tenantId: string, search?: string) => {
  const baseFilter = { tenantId };
  const query = typeof search === "string" ? search.trim() : "";

  if (!query) {
    return baseFilter;
  }

  return {
    ...baseFilter,
    $or: [
      { name: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { gstNumber: { $regex: query, $options: "i" } },
    ],
  };
};

export const getAllCustomers = async (req: AuthRequest, res: Response) => {
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

export const searchCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const searchTerm = typeof req.query.query === "string" ? req.query.query : "";
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const filter = getCustomerListQuery(req.user?.tenantId as string, searchTerm);

    const customers = await Customer.find(filter)
      .sort({ isDefault: -1, name: 1 })
      .limit(limit);

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const hasPaginationParams = req.query.page !== undefined || req.query.limit !== undefined || req.query.search !== undefined;
    const tenantId = req.user?.tenantId as string;
    const searchTerm = typeof req.query.search === "string" ? req.query.search : "";

    if (hasPaginationParams) {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 25));
      const filter = getCustomerListQuery(tenantId, searchTerm);
      const total = await Customer.countDocuments(filter);
      const customers = await Customer.find(filter)
        .sort({ isDefault: -1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({
        data: customers,
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      });
    }

    const customers = await Customer.find({ tenantId }).sort({ isDefault: -1, name: 1 });
    return res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
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