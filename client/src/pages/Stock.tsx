import { useEffect, useState } from "react";
import axios from "axios";
import EmptyState from "../components/ui/EmptyState";
import TableSkeleton from "../components/ui/TableSkeleton";
import API_URL from "../config/api";

function Stock() {
  const [products, setProducts] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const [stockRes, ledgerRes] = await Promise.all([
        axios.get(`${API_URL}/stock`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/stock/ledger`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(stockRes.data || []);
      setLedger(ledgerRes.data || []);
    } catch (err: any) {
      setProducts([]);
      setLedger([]);
      setError(err?.response?.data?.message || "Unable to load stock data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const updateStock = async (id: string, quantity: string, type = "add") => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `${API_URL}/stock/${id}`,
      { quantity: Number(quantity), type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await loadData();
  };

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Stock</h1>
      <p className="text-gray-500 mb-8">Manage your product inventory and view stock movement history.</p>

      {loading ? (
        <div className="space-y-6">
          <TableSkeleton rows={5} columns={5} />
          <TableSkeleton rows={4} columns={5} />
        </div>
      ) : error ? (
        <EmptyState
          title="We couldn't load stock data"
          description={error}
          actionLabel="Try again"
          onAction={() => void loadData()}
          variant="error"
        />
      ) : (
        <>
          <div className="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Unit</th>
                  <th className="px-6 py-4 text-left">Current Stock</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Add Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10">
                      <EmptyState
                        title="No stock records yet"
                        description="Stock entries will appear here as products are created and inventory changes."
                      />
                    </td>
                  </tr>
                ) : products.map((p: any) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.unit}</td>
                    <td className="px-6 py-4 font-bold">{p.stock}</td>
                    <td className="px-6 py-4">
                      {p.stock <= 0 ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Out of Stock</span>
                      ) : p.stock <= p.lowStockThreshold ? (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">Low Stock</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input type="number" placeholder="Qty" className="w-20 rounded border px-2 py-1 text-sm" id={`qty-${p._id}`} />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`qty-${p._id}`) as HTMLInputElement;
                            void updateStock(p._id, input.value, "add");
                            input.value = "";
                          }}
                          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                        >
                          + Add
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-gray-800">Stock Ledger</h2>
            {ledger.length === 0 ? (
              <EmptyState
                title="No ledger entries yet"
                description="Stock movement history will appear here after inventory changes are recorded."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((entry) => (
                      <tr key={entry._id} className="border-t">
                        <td className="px-3 py-2">{new Date(entry.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2">{entry.productId?.name || "—"}</td>
                        <td className="px-3 py-2">{entry.type}</td>
                        <td className="px-3 py-2">{entry.quantity}</td>
                        <td className="px-3 py-2">{entry.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Stock;