import { useEffect, useState } from "react";
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
}

interface SalesTrendPoint {
  date: string;
  amount: number;
}

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalInvoices: number;
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
  recentInvoices: RecentInvoice[];
  topOutstandingCustomers: TopCustomer[];
  lowStockList: LowStockItem[];
}

const EMPTY_STATS: DashboardStats = {
  totalCustomers: 0,
  totalProducts: 0,
  totalInvoices: 0,
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
  recentInvoices: [],
  topOutstandingCustomers: [],
  lowStockList: [],
};

function fmtMoney(n: number) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

// ─── Mini sparkline-style bar chart (no external lib) ────────────────────────

function SalesChart({ data }: { data: SalesTrendPoint[] }) {
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.amount), 1);
  // Show last 14 days for readability on small screens, full 30 on wider
  const points = data.slice(-14);

  return (
    <div className="flex items-end gap-1.5 h-32 border-b border-slate-100 pb-0">
      {points.map((p, i) => {
        const hasSale = p.amount > 0;
        const heightPct = hasSale ? Math.max((p.amount / max) * 100, 4) : 0;
        const isToday = i === points.length - 1;

        return (
          <div key={p.date} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full group relative">
            {/* Tooltip on hover */}
            <div className="absolute -top-7 hidden group-hover:flex bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
              {fmtMoney(p.amount)}
            </div>

            {/* Bar (or baseline dash if no sale that day) */}
            {hasSale ? (
              <div
                className={`w-full rounded-t transition-all ${
                  isToday ? "bg-blue-600" : "bg-blue-400 group-hover:bg-blue-600"
                }`}
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

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({ ...EMPTY_STATS, ...res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isGrowthPositive = stats.revenueGrowth >= 0;

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">

      {/* ── Header + Quick Actions ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Here's what's happening with your business today
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/invoices"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <FaPlus className="text-xs" /> New Invoice
          </Link>
          <Link
            to="/customers"
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <FaUserPlus className="text-xs" /> Add Customer
          </Link>
        </div>
      </div>

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FaUsers />}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          label="Customers"
          value={stats.totalCustomers}
          link="/customers"
        />
        <StatCard
          icon={<FaBoxes />}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          label="Products"
          value={stats.totalProducts}
          link="/products"
        />
        <StatCard
          icon={<FaFileInvoice />}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          label="Invoices"
          value={stats.totalInvoices}
          link="/all-invoices"
        />
        <StatCard
          icon={<FaRupeeSign />}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          label="Outstanding"
          value={<span className="text-red-600">{fmtMoney(stats.outstanding)}</span>}
        />
      </div>

      {/* ── Revenue + Sales Trend ── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Revenue this month */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
          <p className="text-sm text-slate-500 mb-1">This Month's Revenue</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold text-slate-800">{fmtMoney(stats.thisMonthRevenue)}</h2>
          </div>

          <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full w-fit ${
            isGrowthPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {isGrowthPositive ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(stats.revenueGrowth)}% vs last month
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Collected</span>
              <span className="font-semibold text-green-600">{fmtMoney(stats.thisMonthCollected)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Last Month</span>
              <span className="font-semibold text-slate-600">{fmtMoney(stats.lastMonthRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Sales trend chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-700">Sales Trend</p>
              <p className="text-xs text-slate-400 mt-0.5">Last 14 days</p>
            </div>
          </div>
          {stats.salesTrend.length > 0 ? (
            <SalesChart data={stats.salesTrend} />
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-300 text-sm">
              No sales data yet
            </div>
          )}
        </div>
      </div>

      {/* ── Paid / Pending Summary ── */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-green-700 font-semibold text-sm">Paid Invoices</h3>
            <p className="text-4xl font-bold mt-2 text-slate-800">{stats.paidInvoices}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
            ✓
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-red-700 font-semibold text-sm">Pending / Partial</h3>
            <p className="text-4xl font-bold mt-2 text-slate-800">{stats.pendingInvoices}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
            !
          </div>
        </div>
      </div>

      {/* ── Recent Invoices + Top Outstanding + Low Stock ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Invoices */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Recent Invoices</p>
            <Link to="/all-invoices" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          {stats.recentInvoices.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">No invoices yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentInvoices.map((inv) => (
                <Link
                  key={inv._id}
                  to={`/invoice/${inv._id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
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

        {/* Top Outstanding Customers */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Top Outstanding</p>
            <Link to="/customers" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          {stats.topOutstandingCustomers.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">All dues cleared 🎉</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.topOutstandingCustomers.map((c) => (
                <Link
                  key={c._id}
                  to={`/customers/${c._id}/ledger`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
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

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <FaExclamationTriangle className="text-amber-400 text-xs" />
              Low Stock Alerts
            </p>
            <Link to="/stock" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          {stats.lowStockList.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-300 text-sm">Stock levels healthy ✓</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.lowStockList.map((p) => (
                <div key={p._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{p.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Threshold: {p.lowStockThreshold} {p.unit}</p>
                  </div>
                  <span className={`text-sm font-bold ${p.stock <= 0 ? "text-red-600" : "text-amber-500"}`}>
                    {p.stock} {p.unit}
                  </span>
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