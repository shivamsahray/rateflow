import { useEffect, useState } from "react";
import { deletePayment, getPayments } from "../services/paymentService";

interface PaymentRecord {
  _id: string;
  customerId?: { _id: string; name: string; phone?: string };
  invoiceId?: { _id: string; invoiceNumber: string };
  amount: number;
  discount: number;
  paymentDate?: string;
  paymentMode: string;
  referenceNumber?: string;
  notes?: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchPayments = async (nextPage = 1, query = "") => {
    setLoading(true);
    try {
      const data = await getPayments(nextPage, 10, query);
      setPayments(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPayments(page, search);
  }, [page, search]);

  const handleDelete = async (paymentId: string) => {
    if (!window.confirm("Delete this payment record?")) return;

    try {
      await deletePayment(paymentId);
      await fetchPayments(page, search);
    } catch (error) {
      console.error(error);
      window.alert("Unable to delete payment.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payments</h1>
          <p className="text-sm text-slate-500">Track all customer receipts across invoices and ledger entries.</p>
        </div>

        <div className="w-full max-w-md">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by mode or reference"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none ring-0 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Invoice</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Mode</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">Loading payments…</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{payment.customerId?.name || "—"}</div>
                      <div className="text-xs text-slate-400">{payment.customerId?.phone || ""}</div>
                    </td>
                    <td className="px-4 py-3">{payment.invoiceId?.invoiceNumber || "Ledger"}</td>
                    <td className="px-4 py-3">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-4 py-3">{payment.paymentMode}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{Number(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{payment.referenceNumber || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{payment.notes || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDelete(payment._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
