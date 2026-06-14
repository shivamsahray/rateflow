import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/admin";

interface Tenant {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  plan: string;
  accountStatus: string;
  subscriptionEndDate: string;
  createdAt: string;
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      onLogin(res.data.token);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">RateFlow Admin</h1>
        <p className="text-slate-500 text-sm mb-8">Tenant Subscription Management</p>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="admin@rateflow.in" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="••••••••" />
          </div>
          <button onClick={handleLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE:  "bg-green-100 text-green-700",
    EXPIRED: "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  tenant,
  token,
  onClose,
  onSaved,
}: {
  tenant: Tenant;
  token: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [plan,          setPlan]          = useState(tenant.plan);
  const [status,        setStatus]        = useState(tenant.accountStatus);
  const [endDate,       setEndDate]       = useState(
    tenant.subscriptionEndDate
      ? new Date(tenant.subscriptionEndDate).toISOString().slice(0, 10)
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await axios.patch(
        `${API}/tenants/${tenant._id}`,
        { plan, accountStatus: status, subscriptionEndDate: endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800">Edit Subscription</h2>
            <p className="text-xs text-slate-500 mt-0.5">{tenant.companyName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">{error}</div>
          )}

          {/* Plan */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Plan</label>
            <div className="grid grid-cols-4 gap-2">
              {["FREE", "TRIAL", "MONTHLY", "YEARLY"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                    plan === p
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Account Status</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "ACTIVE",  label: "Active",   color: "bg-green-500 text-white border-green-500" },
                { val: "EXPIRED", label: "Expired",  color: "bg-red-500 text-white border-red-500" },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setStatus(s.val)}
                  className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    status === s.val
                      ? s.color
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription End Date */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Subscription End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            {endDate && (
              <p className="text-xs text-slate-400 mt-1">
                → {new Date(endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            )}
          </div>

          {/* Quick date buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Quick Set</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "+7 Days",  days: 7  },
                { label: "+30 Days", days: 30 },
                { label: "+90 Days", days: 90 },
                { label: "+1 Year",  days: 365 },
              ].map(({ label, days }) => (
                <button
                  key={days}
                  onClick={() => {
                    const base = endDate && new Date(endDate) > new Date()
                      ? new Date(endDate)
                      : new Date();
                    base.setDate(base.getDate() + days);
                    setEndDate(base.toISOString().slice(0, 10));
                    setStatus("ACTIVE");
                  }}
                  className="text-xs border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${
              saving
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard({ token }: { token: string }) {
  const [tenants,       setTenants]       = useState<Tenant[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("ALL");
  const [activating,    setActivating]    = useState<string | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [toast,         setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tenants`, { headers });
      setTenants(res.data);
    } catch {
      showToast("Failed to load tenants", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, []);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const activate = async (id: string, plan: "MONTHLY" | "YEARLY") => {
    setActivating(id + plan);
    try {
      const res = await axios.post(`${API}/tenants/${id}/activate`, { plan }, { headers });
      showToast(res.data.message, true);
      fetchTenants();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed", false);
    } finally {
      setActivating(null);
    }
  };

  const deactivate = async (id: string) => {
    if (!confirm("Suspend this tenant?")) return;
    try {
      await axios.post(`${API}/tenants/${id}/deactivate`, {}, { headers });
      showToast("Tenant suspended", true);
      fetchTenants();
    } catch {
      showToast("Failed to suspend", false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const filtered = tenants.filter((t) => {
    const matchSearch =
      t.companyName.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || t.accountStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total:   tenants.length,
    active:  tenants.filter((t) => t.accountStatus === "ACTIVE").length,
    expired: tenants.filter((t) => t.accountStatus === "EXPIRED").length,
  };

  const isExpiringSoon = (d: string) => {
    if (!d) return false;
    const diff = new Date(d).getTime() - Date.now();
    return diff > 0 && diff < 5 * 24 * 60 * 60 * 1000; // within 5 days
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">RateFlow Admin</h1>
          <p className="text-slate-400 text-xs mt-0.5">Subscription Management</p>
        </div>
        <button onClick={logout}
          className="text-sm text-slate-300 hover:text-white border border-slate-600 px-3 py-1.5 rounded-lg transition-colors">
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-slate-800">{counts.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total Tenants</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">{counts.active}</p>
            <p className="text-xs text-slate-500 mt-1">Active</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-red-500">{counts.expired}</p>
            <p className="text-xs text-slate-500 mt-1">Expired</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Search by company or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button onClick={fetchTenants}
            className="text-sm text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg">
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm">Loading tenants...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm">No tenants found</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100">
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Contact</th>
                  <th className="px-5 py-3 text-left">Plan</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Expires On</th>
                  <th className="px-5 py-3 text-left">Joined</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">{t.companyName}</td>
                    <td className="px-5 py-4 text-slate-500">
                      <div>{t.email || "—"}</div>
                      <div className="text-xs">{t.phone || ""}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded">
                        {t.plan || "TRIAL"}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={t.accountStatus} /></td>
                    <td className="px-5 py-4 text-xs">
                      <span className={isExpiringSoon(t.subscriptionEndDate) ? "text-orange-500 font-semibold" : "text-slate-500"}>
                        {fmt(t.subscriptionEndDate)}
                        {isExpiringSoon(t.subscriptionEndDate) && " ⚠️"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{fmt(t.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2 flex-wrap">

                        {/* +30 Days */}
                        <button onClick={() => activate(t._id, "MONTHLY")}
                          disabled={activating === t._id + "MONTHLY"}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50">
                          {activating === t._id + "MONTHLY" ? "..." : "+30 Days"}
                        </button>

                        {/* +1 Year */}
                        <button onClick={() => activate(t._id, "YEARLY")}
                          disabled={activating === t._id + "YEARLY"}
                          className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50">
                          {activating === t._id + "YEARLY" ? "..." : "+1 Year"}
                        </button>

                        {/* ✅ Edit button */}
                        <button onClick={() => setEditingTenant(t)}
                          className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                          ✏️ Edit
                        </button>

                        {/* Suspend */}
                        {t.accountStatus === "ACTIVE" && (
                          <button onClick={() => deactivate(t._id)}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                            Suspend
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTenant && (
        <EditModal
          tenant={editingTenant}
          token={token}
          onClose={() => setEditingTenant(null)}
          onSaved={() => {
            showToast("Tenant updated successfully", true);
            fetchTenants();
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.ok ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.ok ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  if (!token) return <AdminLogin onLogin={setToken} />;
  return <AdminDashboard token={token} />;
}