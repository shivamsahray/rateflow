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

  const invoices = await Invoice.find(filter)
    .populate("customerId", "name")
    .sort({ createdAt: -1 });

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
    stock: { $gt: 0 },
  });

  const outOfStockProducts = await Product.countDocuments({
    tenantId,
    stock: { $lte: 0 },
  });

  // ✅ NEW: This month vs last month revenue (collected = paidAmount sum)
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const thisMonthInvoices = invoices.filter(
    (i) => new Date(i.invoiceDate || (i as any).createdAt) >= startOfThisMonth
  );
  const lastMonthInvoices = invoices.filter((i) => {
    const d = new Date(i.invoiceDate || (i as any).createdAt);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  });

  const thisMonthRevenue = thisMonthInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const lastMonthRevenue = lastMonthInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0);

  const thisMonthCollected = thisMonthInvoices.reduce((s, i) => s + (i.paidAmount || 0), 0);

  // Revenue growth %
  const revenueGrowth =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0 ? 100 : 0;

  // ✅ NEW: Last 30 days daily sales — for chart
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const dailyMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }

  invoices.forEach((inv) => {
    const d = new Date(inv.invoiceDate || (inv as any).createdAt);
    if (d >= thirtyDaysAgo) {
      const key = d.toISOString().slice(0, 10);
      if (dailyMap.has(key)) {
        dailyMap.set(key, (dailyMap.get(key) || 0) + (inv.grandTotal || 0));
      }
    }
  });

  const salesTrend = Array.from(dailyMap.entries()).map(([date, amount]) => ({
    date,
    amount: Math.round(amount * 100) / 100,
  }));

  // ✅ NEW: Recent 5 invoices
  const recentInvoices = invoices.slice(0, 5).map((inv) => ({
    _id: inv._id,
    invoiceNumber: inv.invoiceNumber,
    customerName: (inv.customerId as any)?.name || "—",
    grandTotal: inv.grandTotal,
    paymentStatus: inv.paymentStatus,
    invoiceDate: inv.invoiceDate || (inv as any).createdAt,
  }));

  // ✅ NEW: Top 5 customers by outstanding amount
  const customers = await Customer.find({
    tenantId,
    outstandingAmount: { $gt: 0 },
    isDefault: false,
  })
    .sort({ outstandingAmount: -1 })
    .limit(5)
    .select("name outstandingAmount phone");

  // ✅ NEW: Low stock product list (top 5)
  const lowStockList = await Product.find({
    tenantId,
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
  })
    .sort({ stock: 1 })
    .limit(5)
    .select("name stock lowStockThreshold unit");

  res.json({
    totalCustomers,
    totalProducts,
    totalInvoices,
    outstanding,
    paidInvoices,
    pendingInvoices,
    lowStockProducts,
    outOfStockProducts,

    // ✅ NEW fields
    thisMonthRevenue,
    lastMonthRevenue,
    thisMonthCollected,
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    salesTrend,
    recentInvoices,
    topOutstandingCustomers: customers,
    lowStockList,
  });
};