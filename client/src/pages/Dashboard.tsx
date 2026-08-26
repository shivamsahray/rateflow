import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaUsers,
  FaBoxes,
  FaFileInvoice,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaUserPlus,
  FaExclamationTriangle,
  FaShoppingCart,
  FaHandshake,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";
import API_URL from "../config/api";

interface RecentInvoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  grandTotal: number;
  paymentStatus: string;
  invoiceDate: string;
}

interface RecentPurchase {
  _id: string;
  purchaseNumber: string;
  vendorName: string;
  grandTotal: number;
  paymentStatus: string;
  purchaseDate: string;
}

interface PendingVendorPayment {
  _id: string;
  vendorName: string;
  outstandingAmount: number;
  dueDate: string;
}

interface TopVendor {
  _id: string;
  name: string;
  totalPurchase: number;
  outstanding: number;
}

interface TopCustomer {
  _id: string;
  name: string;
  outstandingAmount: number;
  phone: string;
}

interface LowStockItem {
  _id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  suggestedReorderQty: number;
}

interface SalesTrendPoint {
  date: string;
  amount: number;
}

interface PurchaseSummary {
  totalPurchases: number;
  vendorOutstanding: number;
  purchaseOrdersThisMonth: number;
  purchasesThisMonth: number;
  paidPurchases: number;
  partialPurchases: number;
  pendingPurchases: number;
  netBusiness: number;
}

interface SalesOverview {
  period: string;
  totalSales: number;
  invoiceCount: number;
  paidAmount: number;
  outstandingAmount: number;
  discount: number;
  start: string;
  end: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalInvoices: number;
  totalVendors: number;
  outstanding: number;
  paidInvoices: number;
  pendingInvoices: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  thisMonthCollected: number;
  revenueGrowth: number;
  salesTrend: SalesTrendPoint[];
  purchaseTrend: SalesTrendPoint[];
  recentInvoices: RecentInvoice[];
  recentPurchases: RecentPurchase[];
  purchaseSummary: PurchaseSummary;
  topOutstandingCustomers: TopCustomer[];
  lowStockList: LowStockItem[];
  pendingVendorPayments: PendingVendorPayment[];
  topVendors: TopVendor[];
  salesOverview: SalesOverview;
}

const EMPTY_STATS: DashboardStats = {
  totalCustomers: 0,
  totalProducts: 0,
  totalInvoices: 0,
  totalVendors: 0,
  outstanding: 0,
  paidInvoices: 0,
  pendingInvoices: 0,
  lowStockProducts: 0,
  outOfStockProducts: 0,
  thisMonthRevenue: 0,
  lastMonthRevenue: 0,
  thisMonthCollected: 0,
  revenueGrowth: 0,
  salesTrend: [],
  purchaseTrend: [],
  recentInvoices: [],
  recentPurchases: [],
  purchaseSummary: {
    totalPurchases: 0,
    vendorOutstanding: 0,
    purchaseOrdersThisMonth: 0,
    purchasesThisMonth: 0,
    paidPurchases: 0,
    partialPurchases: 0,
    pendingPurchases: 0,
    netBusiness: 0,
  },
  topOutstandingCustomers: [],
  lowStockList: [],
  pendingVendorPayments: [],
  topVendors: [],
  salesOverview: {
    period: "month",
    totalSales: 0,
    invoiceCount: 0,
    paidAmount: 0,
    outstandingAmount: 0,
    discount: 0,
    start: "",
    end: "",
  },
};

function fmtMoney(n: number) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function TrendChart({ data, barClass, emptyText }: { data: SalesTrendPoint[]; barClass: string; emptyText: string }) {
  if (!data.length) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-300 text-sm">
        {emptyText}
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.amount), 1);
  const points = data.slice(-14);

  return (
    <div className="flex items-end gap-1.5 h-32 border-b border-slate-100 pb-0">
      {points.map((p, i) => {
        const hasSale = p.amount > 0;
        const heightPct = hasSale ? Math.max((p.amount / max) * 100, 4) : 0;
        const isToday = i === points.length - 1;

        return (
          <div key={p.date} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full group relative">
            <div className="absolute -top-7 hidden group-hover:flex bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
              {fmtMoney(p.amount)}
            </div>
            {hasSale ? (
              <div
                className={`w-full rounded-t transition-all ${barClass} ${isToday ? "opacity-100" : "group-hover:opacity-90"}`}
                style={{ height: `${heightPct}%` }}
              />
            ) : (
              <div className="w-full h-[3px] rounded-full bg-slate-200 group-hover:bg-slate-300" />
            )}
            <span className="text-[9px] text-slate-400">{fmtDate(p.date).slice(0, 2)}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
  link,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  iconBg: string;
  iconColor: string;
  link?: string;
}) {
  const content = (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
      <h2 className="text-2xl font-bold text-slate-800 mt-1">{value}</h2>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Paid: "bg-green-50 text-green-600",
    Partial: "bg-blue-50 text-blue-600",
    Pending: "bg-yellow-50 text-yellow-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [_loading, setLoading] = useState(true);
  const [salesPeriod, setSalesPeriod] = useState("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    void fetchDashboard();
  }, [salesPeriod, customFrom, customTo]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const params: Record<string, string> = { period: salesPeriod };

      if (salesPeriod === "custom") {
        if (customFrom) params.from = customFrom;
        if (customTo) params.to = customTo;
      }

      const res = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setStats({ ...EMPTY_STATS, ...res.data, salesOverview: res.data.salesOverview || EMPTY_STATS.salesOverview });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isGrowthPositive = stats.revenueGrowth >= 0;
  const overview = stats.salesOverview || EMPTY_STATS.salesOverview;

  return (
    <div className="w-full px-8 py-8 sm:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Here&apos;s what&apos;s happening with your business today</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/invoices" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <FaPlus className="text-xs" /> New Invoice
          </Link>
          <Link to="/customers" className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <FaUserPlus className="text-xs" /> Add Customer
          </Link>
          <Link to="/payments" className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <FaRupeeSign className="text-xs" /> Payments
          </Link>
          <Link to="/purchases" className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <FaShoppingCart className="text-xs" /> New Purchase
          </Link>
          <Link to="/vendors" className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <FaBuilding className="text-xs" /> Add Vendor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<FaUsers />} iconBg="bg-blue-50" iconColor="text-blue-500" label="Customers" value={stats.totalCustomers} link="/customers" />
        <StatCard icon={<FaBoxes />} iconBg="bg-green-50" iconColor="text-green-500" label="Products" value={stats.totalProducts} link="/products" />
        <StatCard icon={<FaFileInvoice />} iconBg="bg-purple-50" iconColor="text-purple-500" label="Invoices" value={stats.totalInvoices} link="/all-invoices" />
        <StatCard icon={<FaRupeeSign />} iconBg="bg-red-50" iconColor="text-red-500" label="Outstanding" value={<span className="text-red-600">{fmtMoney(stats.outstanding)}</span>} />
        <StatCard icon={<FaShoppingCart />} iconBg="bg-amber-50" iconColor="text-amber-500" label="Total Purchases" value={<span className="text-slate-800">{fmtMoney(stats.purchaseSummary.totalPurchases)}</span>} link="/purchases" />
        <StatCard icon={<FaHandshake />} iconBg="bg-indigo-50" iconColor="text-indigo-500" label="Vendor Outstanding" value={<span className="text-slate-800">{fmtMoney(stats.purchaseSummary.vendorOutstanding)}</span>} link="/vendors" />
        <StatCard icon={<FaBuilding />} iconBg="bg-teal-50" iconColor="text-teal-500" label="Total Vendors" value={stats.totalVendors} link="/vendors" />
        <StatCard icon={<FaClipboardList />} iconBg="bg-slate-100" iconColor="text-slate-600" label="Purchase Orders" value={stats.purchaseSummary.purchaseOrdersThisMonth} link="/purchases" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
          <p className="text-sm text-slate-500 mb-1">Revenue</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold text-slate-800">{fmtMoney(stats.thisMonthRevenue)}</h2>
          </div>

          <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full w-fit ${isGrowthPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {isGrowthPositive ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(stats.revenueGrowth)}% vs last month
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Purchases</span>
              <span className="font-semibold text-amber-600">{fmtMoney(stats.purchaseSummary.purchasesThisMonth)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Net</span>
              <span className="font-semibold text-slate-700">{fmtMoney(stats.purchaseSummary.netBusiness)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">Sales Trend</p>
                <p className="text-xs text-slate-400 mt-0.5">Last 14 days</p>
              </div>
            </div>
            <TrendChart data={stats.salesTrend} barClass="bg-blue-400" emptyText="No sales data yet" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">Purchase Trend</p>
                <p className="text-xs text-slate-400 mt-0.5">Last 14 days</p>
              </div>
            </div>
            <TrendChart data={stats.purchaseTrend} barClass="bg-amber-400" emptyText="No purchase data yet" />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Sales Overview</p>
            <p className="text-xs text-slate-400 mt-0.5">{overview.start ? new Date(overview.start).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"} to {overview.end ? new Date(overview.end).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={salesPeriod}
              onChange={(e) => setSalesPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>

            {salesPeriod === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Total Sales</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">{fmtMoney(overview.totalSales)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Invoices</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">{overview.invoiceCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Received</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{fmtMoney(overview.paidAmount)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Outstanding</p>
            <p className="mt-2 text-2xl font-bold text-red-600">{fmtMoney(overview.outstandingAmount)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Discount</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{fmtMoney(overview.discount)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Pending Vendor Payments</p>
            <Link to="/vendor-payments" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.pendingVendorPayments.length === 0 ? (
              <p className="text-sm text-slate-400">No pending vendor payments</p>
            ) : (
              stats.pendingVendorPayments.map((payment) => {
                const overdue = new Date(payment.dueDate) < new Date();
                return (
                  <div key={payment._id} className={`rounded-xl border px-3 py-3 ${overdue ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">{payment.vendorName}</p>
                      <span className={`text-xs font-semibold ${overdue ? "text-red-600" : "text-slate-500"}`}>{overdue ? "Overdue" : "Due"}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
                      <span>{fmtMoney(payment.outstandingAmount)}</span>
                      <span>{fmtDate(payment.dueDate)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-700">Purchase Status</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-green-200 bg-green-50 p-3">
              <p className="text-xs text-green-700">Paid Purchases</p>
              <p className="text-xl font-semibold text-slate-800">{stats.purchaseSummary.paidPurchases}</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-700">Partial Purchases</p>
              <p className="text-xl font-semibold text-slate-800">{stats.purchaseSummary.partialPurchases}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Pending Purchases</p>
              <p className="text-xl font-semibold text-slate-800">{stats.purchaseSummary.pendingPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Top Vendors</p>
            <Link to="/vendors" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          {stats.topVendors.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">No vendor purchase data yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.topVendors.map((vendor) => (
                <div key={vendor._id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700">{vendor.name}</p>
                    <p className="text-sm font-semibold text-slate-800">{fmtMoney(vendor.totalPurchase)}</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>Outstanding</span>
                    <span>{fmtMoney(vendor.outstanding)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Recent Invoices</p>
            <Link to="/all-invoices" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          {stats.recentInvoices.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">No invoices yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentInvoices.map((inv) => (
                <Link key={inv._id} to={`/invoice/${inv._id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-700">#{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{inv.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{fmtMoney(inv.grandTotal)}</p>
                    <div className="mt-1">{statusBadge(inv.paymentStatus)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Recent Purchases</p>
            <Link to="/purchases" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          {stats.recentPurchases.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">No purchases yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentPurchases.map((purchase) => (
                <div key={purchase._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{purchase.purchaseNumber}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{purchase.vendorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{fmtMoney(purchase.grandTotal)}</p>
                    <div className="mt-1">{statusBadge(purchase.paymentStatus)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Top Outstanding</p>
            <Link to="/customers" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          {stats.topOutstandingCustomers.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">All dues cleared 🎉</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.topOutstandingCustomers.map((c) => (
                <Link key={c._id} to={`/customers/${c._id}/ledger`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{c.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-red-600">{fmtMoney(c.outstandingAmount)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <FaExclamationTriangle className="text-amber-400 text-xs" />
              Low Stock Alerts
            </p>
            <Link to="/stock" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          {stats.lowStockList.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">Stock levels healthy ✓</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.lowStockList.map((p) => (
                <div key={p._id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Min: {p.lowStockThreshold} {p.unit}</p>
                    </div>
                    <span className={`text-sm font-bold ${p.stock <= 0 ? "text-red-600" : "text-amber-500"}`}>{p.stock} {p.unit}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Reorder</span>
                    <span>{p.suggestedReorderQty} {p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;