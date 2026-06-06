import Customer from "../models/Customer";
import Product from "../models/Product";
import Invoice from "../models/Invoice";
import { Request, Response } from "express";

export const getDashboardStats =
  async (req: Request, res: Response) => {

    const totalCustomers =
      await Customer.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalInvoices =
      await Invoice.countDocuments();

    const invoices =
      await Invoice.find();

    const outstanding =
      invoices.reduce(
        (sum, invoice) =>
          sum + (invoice.outstandingAmount || 0),
        0
      );

    const paidInvoices =
      invoices.filter(
        i => i.paymentStatus === "Paid"
      ).length;

    const pendingInvoices =
      invoices.filter(
        i =>
          i.paymentStatus === "Pending" ||
          i.paymentStatus === "Partial"
      ).length;

      

    res.json({
      totalCustomers,
      totalProducts,
      totalInvoices,
      outstanding,
      paidInvoices,
      pendingInvoices
    });
};

