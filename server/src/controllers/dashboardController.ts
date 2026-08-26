import mongoose from "mongoose";
import Customer from "../models/Customer";
import Product from "../models/Product";
import Invoice from "../models/Invoice";
import Purchase from "../models/Purchase";
import Payment from "../models/Payment";
import Vendor from "../models/Vendor";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

const buildTrendSeries = (items: Array<{ _id: string; amount: number }>, days = 14) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const map = new Map<string, number>();
  for (let i = 0; i < days; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const key = current.toISOString().slice(0, 10);
    map.set(key, 0);
  }

  items.forEach((item) => {
    if (map.has(item._id)) {
      map.set(item._id, item.amount);
    }
  });

  return Array.from(map.entries()).map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }));
};

const parseLocalDate = (value?: string) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const [year, month, day] = trimmed.split("-").map(Number);
  if (![year, month, day].every((part) => Number.isFinite(part))) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const resolveSalesWindow = (period: string, fromDate?: string, toDate?: string) => {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const base = {
    period,
    start: startOfToday,
    end: endOfToday,
  };

  if (period === "custom") {
    const from = parseLocalDate(fromDate) || startOfToday;
    const to = parseLocalDate(toDate) || endOfToday;
    return {
      period: "custom",
      start: new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0, 0),
      end: new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999),
    };
  }

  if (period === "week") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { period: "week", start, end };
  }

  if (period === "lastMonth") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { period: "lastMonth", start, end };
  }

  if (period === "last3Months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { period: "last3Months", start, end };
  }

  if (period === "last6Months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { period: "last6Months", start, end };
  }

  if (period === "year") {
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { period: "year", start, end };
  }

  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { period: "month", start, end };
  }

  if (period === "today") {
    return base;
  }

  return {
    period: "month",
    start: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const filter = { tenantId };
  const tenantObjectId = new mongoose.Types.ObjectId(String(tenantId));
  const period = String(req.query.period || "month");
  const fromDate = typeof req.query.from === "string" ? req.query.from : undefined;
  const toDate = typeof req.query.to === "string" ? req.query.to : undefined;
  const salesWindow = resolveSalesWindow(period, fromDate, toDate);
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalCustomers,
    totalProducts,
    totalInvoices,
    totalVendors,
    invoices,
    purchaseSummary,
    purchaseTrendItems,
    recentPurchases,
    pendingVendorPayments,
    topVendors,
    customers,
    lowStockList,
  ] = await Promise.all([
    Customer.countDocuments(filter),
    Product.countDocuments(filter),
    Invoice.countDocuments(filter),
    Vendor.countDocuments({ tenantId, status: "Active" }),
    Invoice.find(filter).populate("customerId", "name").sort({ createdAt: -1 }),
    Purchase.aggregate([
      { $match: { tenantId: tenantObjectId } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: "$grandTotal" },
          vendorOutstanding: { $sum: "$outstandingAmount" },
          purchaseOrdersThisMonth: {
            $sum: {
              $cond: [{ $gte: ["$purchaseDate", startOfThisMonth] }, 1, 0],
            },
          },
          purchasesThisMonth: {
            $sum: {
              $cond: [{ $gte: ["$purchaseDate", startOfThisMonth] }, "$grandTotal", 0],
            },
          },
          paidPurchases: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, 1, 0],
            },
          },
          partialPurchases: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Partial"] }, 1, 0],
            },
          },
          pendingPurchases: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0],
            },
          },
        },
      },
    ]),
    Purchase.aggregate([
      { $match: { tenantId: tenantObjectId, purchaseDate: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          amount: { $sum: "$grandTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Purchase.find(filter)
      .populate("vendorId", "name")
      .sort({ purchaseDate: -1, createdAt: -1 })
      .limit(5)
      .select("purchaseNumber vendorId grandTotal paymentStatus purchaseDate dueDate"),
    Purchase.find({ tenantId, outstandingAmount: { $gt: 0 } })
      .populate("vendorId", "name")
      .sort({ dueDate: 1, purchaseDate: 1 })
      .limit(5)
      .select("purchaseNumber vendorId outstandingAmount dueDate"),
    Purchase.aggregate([
      { $match: { tenantId: tenantObjectId } },
      {
        $group: {
          _id: "$vendorId",
          totalPurchase: { $sum: "$grandTotal" },
          outstanding: { $sum: "$outstandingAmount" },
        },
      },
      { $sort: { totalPurchase: -1 } },
      { $limit: 5 },
    ]),
    Customer.find({
      tenantId,
      outstandingAmount: { $gt: 0 },
      isDefault: false,
    })
      .sort({ outstandingAmount: -1 })
      .limit(5)
      .select("name outstandingAmount phone"),
    Product.find({
      tenantId,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    })
      .sort({ stock: 1 })
      .limit(5)
      .select("name stock lowStockThreshold unit"),
  ]);

  const outstanding = invoices.reduce((sum, invoice) => sum + (invoice.outstandingAmount || 0), 0);
  const paidInvoices = invoices.filter((i) => i.paymentStatus === "Paid").length;
  const pendingInvoices = invoices.filter((i) => i.paymentStatus === "Pending" || i.paymentStatus === "Partial").length;

  const lowStockProducts = await Product.countDocuments({
    tenantId,
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    stock: { $gt: 0 },
  });

  const outOfStockProducts = await Product.countDocuments({
    tenantId,
    stock: { $lte: 0 },
  });

  const thisMonthInvoices = invoices.filter((i) => new Date(i.invoiceDate || (i as any).createdAt) >= startOfThisMonth);
  const lastMonthInvoices = invoices.filter((i) => {
    const d = new Date(i.invoiceDate || (i as any).createdAt);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  });

  const thisMonthRevenue = thisMonthInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const lastMonthRevenue = lastMonthInvoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const thisMonthCollected = thisMonthInvoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
  const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : thisMonthRevenue > 0 ? 100 : 0;

  const purchaseStats = purchaseSummary[0] || {
    totalPurchases: 0,
    vendorOutstanding: 0,
    purchaseOrdersThisMonth: 0,
    purchasesThisMonth: 0,
    paidPurchases: 0,
    partialPurchases: 0,
    pendingPurchases: 0,
  };

  const salesTrend = buildTrendSeries(
    invoices
      .filter((inv) => {
        const d = new Date(inv.invoiceDate || (inv as any).createdAt);
        return d >= fourteenDaysAgo;
      })
      .map((inv) => ({
        _id: new Date(inv.invoiceDate || (inv as any).createdAt).toISOString().slice(0, 10),
        amount: inv.grandTotal || 0,
      }))
  );

  const purchaseTrend = buildTrendSeries(
    purchaseTrendItems.map((item) => ({ _id: item._id, amount: item.amount || 0 })),
    14
  );

  const salesOverviewInvoices = await Invoice.find({
    tenantId,
    invoiceDate: { $gte: salesWindow.start, $lte: salesWindow.end },
  }).select("grandTotal paidAmount outstandingAmount invoiceNumber");

  const salesOverviewPayments = await Payment.find({
    tenantId,
    paymentDate: { $gte: salesWindow.start, $lte: salesWindow.end },
  }).select("amount discount");

  const salesOverview = {
    period: salesWindow.period,
    start: salesWindow.start.toISOString(),
    end: salesWindow.end.toISOString(),
    totalSales: salesOverviewInvoices.reduce((sum, invoice) => sum + Number(invoice.grandTotal || 0), 0),
    invoiceCount: salesOverviewInvoices.length,
    paidAmount: salesOverviewPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    outstandingAmount: salesOverviewInvoices.reduce((sum, invoice) => sum + Number(invoice.outstandingAmount || 0), 0),
    discount: salesOverviewPayments.reduce((sum, payment) => sum + Number(payment.discount || 0), 0),
  };

  const recentInvoices = invoices.slice(0, 5).map((inv) => ({
    _id: inv._id,
    invoiceNumber: inv.invoiceNumber,
    customerName: (inv.customerId as any)?.name || "—",
    grandTotal: inv.grandTotal,
    paymentStatus: inv.paymentStatus,
    invoiceDate: inv.invoiceDate || (inv as any).createdAt,
  }));

  const recentPurchasesList = recentPurchases.map((purchase: any) => ({
    _id: purchase._id,
    purchaseNumber: purchase.purchaseNumber,
    vendorName: purchase.vendorId?.name || "—",
    grandTotal: purchase.grandTotal,
    paymentStatus: purchase.paymentStatus,
    purchaseDate: purchase.purchaseDate || purchase.createdAt,
  }));

  const pendingPayments = pendingVendorPayments.map((purchase: any) => ({
    _id: purchase._id,
    vendorName: purchase.vendorId?.name || "—",
    outstandingAmount: purchase.outstandingAmount || 0,
    dueDate: purchase.dueDate,
  }));

  const topVendorList = await Promise.all(
    topVendors.map(async (vendorSummary: any) => {
      const vendor = await Vendor.findById(vendorSummary._id).select("name");
      return {
        _id: vendorSummary._id,
        name: vendor?.name || "—",
        totalPurchase: vendorSummary.totalPurchase || 0,
        outstanding: vendorSummary.outstanding || 0,
      };
    })
  );

  res.json({
    totalCustomers,
    totalProducts,
    totalInvoices,
    totalVendors,
    outstanding,
    paidInvoices,
    pendingInvoices,
    lowStockProducts,
    outOfStockProducts,
    thisMonthRevenue,
    lastMonthRevenue,
    thisMonthCollected,
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    salesTrend,
    purchaseTrend,
    recentInvoices,
    recentPurchases: recentPurchasesList,
    purchaseSummary: {
      totalPurchases: Number(purchaseStats.totalPurchases || 0),
      vendorOutstanding: Number(purchaseStats.vendorOutstanding || 0),
      purchaseOrdersThisMonth: Number(purchaseStats.purchaseOrdersThisMonth || 0),
      purchasesThisMonth: Number(purchaseStats.purchasesThisMonth || 0),
      paidPurchases: Number(purchaseStats.paidPurchases || 0),
      partialPurchases: Number(purchaseStats.partialPurchases || 0),
      pendingPurchases: Number(purchaseStats.pendingPurchases || 0),
      netBusiness: thisMonthRevenue - Number(purchaseStats.purchasesThisMonth || 0),
    },
    topOutstandingCustomers: customers,
    lowStockList: lowStockList.map((item: any) => ({
      _id: item._id,
      name: item.name,
      stock: item.stock,
      lowStockThreshold: item.lowStockThreshold,
      unit: item.unit,
      suggestedReorderQty: Math.max(Number(item.lowStockThreshold || 0) - Number(item.stock || 0), Number(item.lowStockThreshold || 0)),
    })),
    pendingVendorPayments: pendingPayments,
    topVendors: topVendorList,
    salesOverview,
  });
};