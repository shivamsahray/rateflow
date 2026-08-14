import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import TableSkeleton from "../components/ui/TableSkeleton";
import { deletePurchase, getPurchases } from "../services/purchaseService";

function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPurchases = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setPurchases([]);
      setError(err?.response?.data?.message || "Unable to load purchases right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPurchases();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this purchase?")) {
      return;
    }

    await deletePurchase(id);
    await loadPurchases();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Purchase List</h1>
          <p className="text-sm text-slate-500">Track vendor purchases, payment status, and inventory impact.</p>
        </div>
        <Link to="/create-purchase" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">+ New Purchase</Link>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        {loading ? (
          <TableSkeleton rows={5} columns={8} />
        ) : error ? (
          <EmptyState
            title="We couldn't load purchases"
            description={error}
            actionLabel="Try again"
            onAction={() => void loadPurchases()}
            variant="error"
          />
        ) : purchases.length === 0 ? (
          <EmptyState
            title="No purchases yet"
            description="Create your first purchase to start tracking inventory and vendor payments."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 py-2">Purchase #</th>
                  <th className="px-3 py-2">Vendor</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Grand Total</th>
                  <th className="px-3 py-2">Paid</th>
                  <th className="px-3 py-2">Outstanding</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase._id} className="border-t">
                    <td className="px-3 py-2 font-semibold text-slate-800">{purchase.purchaseNumber}</td>
                    <td className="px-3 py-2">{purchase.vendorId?.name || "—"}</td>
                    <td className="px-3 py-2">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2">₹{Number(purchase.grandTotal || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">₹{Number(purchase.paidAmount || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">₹{Number(purchase.outstandingAmount || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${purchase.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : purchase.paymentStatus === "Partial" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => void handleDelete(purchase._id)} className="rounded bg-red-600 px-2 py-1 text-white">Delete</button>
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

export default Purchases;
