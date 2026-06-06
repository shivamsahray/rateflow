import { Response } from "express";
import Customer from "../models/Customer";
import { AuthRequest } from "../middleware/authMiddleware";

export const createCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customer =
      await Customer.create({
        ...req.body,
        tenantId: req.user?.tenantId,
      });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCustomers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customers = await Customer.find({
      tenantId: req.user?.tenantId,
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customer =
      await Customer.findOneAndUpdate(
        {
          _id: req.params.id,
          tenantId: req.user?.tenantId,
        },
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json(customer);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await Customer.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    res.status(200).json({
      message: "Customer Deleted",
    });
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};