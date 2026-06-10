import Customer from "../models/Customer";
import Product from "../models/Product";
import Invoice from "../models/Invoice";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const filter = { tenantId };

  const totalCustomers = await Customer.countDocuments(filter);
  const totalProducts  = await Product.countDocuments(filter);
  const totalInvoices  = await Invoice.countDocuments(filter);

  const invoices = await Invoice.find(filter);

  const outstanding = invoices.reduce(
    (sum, invoice) => sum + (invoice.outstandingAmount || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (i) => i.paymentStatus === "Paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (i) => i.paymentStatus === "Pending" || i.paymentStatus === "Partial"
  ).length;

  const lowStockProducts = await Product.countDocuments({
  tenantId,
  $expr: { $lte: ["$stock", "$lowStockThreshold"] },
  stock: { $gt: 0 },  // out of stock alag count karo
});

const outOfStockProducts = await Product.countDocuments({
  tenantId,
  stock: { $lte: 0 },
});

  res.json({
    totalCustomers,
    totalProducts,
    totalInvoices,
    outstanding,
    paidInvoices,
    pendingInvoices,
    lowStockProducts,
    outOfStockProducts
  });
};