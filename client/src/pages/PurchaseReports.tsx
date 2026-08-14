import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/ui/EmptyState";
import PageSkeleton from "../components/ui/PageSkeleton";
import { getPurchases } from "../services/purchaseService";

function PurchaseReports() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPurchases();
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setPurchases([]);
        setError(err?.response?.data?.message || "Unable to load purchase reports right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const stats = useMemo(() => {
    const totalPurchases = purchases.reduce((sum, purchase) => sum + Number(purchase.grandTotal || 0), 0);
    const pendingPayments = purchases.filter((purchase) => purchase.paymentStatus !== "Paid").reduce((sum, purchase) => sum + Number(purchase.outstandingAmount || 0), 0);
    return { totalPurchases, pendingPayments, completed: purchases.filter((purchase) => purchase.paymentStatus === "Paid").length };
  }, [purchases]);

  if (loading) {
    return <PageSkeleton title="Purchase Reports" subtitle="Loading purchase activity and outstanding balances" rows={5} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Purchase Reports</h1>
          <p className="text-sm text-slate-500">A lightweight ERP-style overview of purchase activity and outstanding payments.</p>
        </div>
        <EmptyState
          title="We couldn't load purchase reports"
          description={error}
          actionLabel="Try again"
          onAction={() => window.location.reload()}
          variant="error"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Purchase Reports</h1>
        <p className="text-sm text-slate-500">A lightweight ERP-style overview of purchase activity and outstanding payments.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Purchases</p>
          <p className="text-2xl font-semibold text-slate-800">₹{stats.totalPurchases.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pending Vendor Payments</p>
          <p className="text-2xl font-semibold text-amber-600">₹{stats.pendingPayments.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Paid Purchases</p>
          <p className="text-2xl font-semibold text-green-600">{stats.completed}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Recent Purchases</h2>
        {purchases.length === 0 ? (
          <EmptyState
            title="No purchase records yet"
            description="Once purchases are created, this report will show the latest activity and outstanding balances."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 py-2">Purchase #</th>
                  <th className="px-3 py-2">Vendor</th>
                  <th className="px-3 py-2">Invoice No</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase._id} className="border-t">
                    <td className="px-3 py-2">{purchase.purchaseNumber}</td>
                    <td className="px-3 py-2">{purchase.vendorId?.name || "—"}</td>
                    <td className="px-3 py-2">{purchase.invoiceNumber || "—"}</td>
                    <td className="px-3 py-2">₹{Number(purchase.grandTotal || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${purchase.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : purchase.paymentStatus === "Partial" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseReports;
