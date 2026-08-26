import { useEffect, useMemo, useState } from "react";
import { deletePayment, getPayments, recordPayment, updatePayment } from "../services/paymentService";
import { searchCustomers } from "../services/customerService";
import { parseDateOnly, toLocalDateInput } from "../utils/date";

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

interface PaymentFormState {
  customerId: string;
  amount: string;
  discount: string;
  paymentDate: string;
  paymentMode: string;
  referenceNumber: string;
  notes: string;
}

const EMPTY_FORM = (): PaymentFormState => ({
  customerId: "",
  amount: "",
  discount: "0",
  paymentDate: toLocalDateInput(new Date()),
  paymentMode: "Cash",
  referenceNumber: "",
  notes: "",
});

const formatDisplayDate = (value?: string | Date | null) => {
  const parsed = parseDateOnly(value);
  if (!parsed) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
  });
};

function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerOptions, setCustomerOptions] = useState<Array<{ _id: string; name: string; phone?: string }>>([]);
  const [form, setForm] = useState<PaymentFormState>(EMPTY_FORM());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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

  useEffect(() => {
    if (!showForm) return;

    const timeout = setTimeout(() => {
      const query = customerQuery.trim();
      if (!query && !form.customerId) {
        void searchCustomers("", 12).then((data) => setCustomerOptions(Array.isArray(data) ? data : data?.data || [])).catch(() => setCustomerOptions([]));
        return;
      }

      if (!query && form.customerId) {
        return;
      }

      void searchCustomers(query, 12)
        .then((data) => setCustomerOptions(Array.isArray(data) ? data : data?.data || []))
        .catch(() => setCustomerOptions([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [customerQuery, form.customerId, showForm]);

  const selectedCustomer = useMemo(
    () => customerOptions.find((customer) => customer._id === form.customerId) || null,
    [customerOptions, form.customerId]
  );

  const resetForm = () => {
    setForm(EMPTY_FORM());
    setCustomerQuery("");
    setCustomerOptions([]);
    setEditingPayment(null);
    setFormError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (payment: PaymentRecord) => {
    setEditingPayment(payment);
    setForm({
      customerId: payment.customerId?._id || "",
      amount: String(payment.amount || ""),
      discount: String(payment.discount || "0"),
      paymentDate: payment.paymentDate ? toLocalDateInput(new Date(payment.paymentDate)) : toLocalDateInput(new Date()),
      paymentMode: payment.paymentMode || "Cash",
      referenceNumber: payment.referenceNumber || "",
      notes: payment.notes || "",
    });
    setCustomerQuery(payment.customerId?.name || "");
    setShowForm(true);
  };

  const handleSavePayment = async () => {
    if (!form.customerId) {
      setFormError("Please select a customer.");
      return;
    }

    const amount = Number(form.amount);
    const discount = Number(form.discount) || 0;
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Payment amount must be greater than 0.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        customerId: form.customerId,
        invoiceId: editingPayment?.invoiceId?._id || null,
        amount,
        discount,
        paymentDate: form.paymentDate,
        paymentMode: form.paymentMode,
        referenceNumber: form.referenceNumber,
        notes: form.notes,
      };

      if (editingPayment) {
        await updatePayment(editingPayment._id, payload);
      } else {
        await recordPayment(payload);
      }

      setShowForm(false);
      resetForm();
      await fetchPayments(page, search);
    } catch (error: any) {
      console.error(error);
      setFormError(error?.response?.data?.message || "Unable to save payment right now.");
    } finally {
      setSaving(false);
    }
  };

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

        <div className="flex w-full max-w-xl items-center gap-3">
          <div className="flex-1">
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

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add Payment
          </button>
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
                    <td className="px-4 py-3">{formatDisplayDate(payment.paymentDate)}</td>
                    <td className="px-4 py-3">{payment.paymentMode}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{Number(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{payment.referenceNumber || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{payment.notes || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(payment)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(payment._id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{editingPayment ? "Edit payment" : "Add payment"}</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">{editingPayment ? "Update payment record" : "Create payment record"}</h2>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Customer</label>
                <input
                  type="text"
                  value={customerQuery || selectedCustomer?.name || ""}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setForm((prev) => ({ ...prev, customerId: "" }));
                  }}
                  placeholder="Search customer"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                {customerOptions.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                    {customerOptions.map((customer) => (
                      <button
                        key={customer._id}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, customerId: customer._id }));
                          setCustomerQuery(customer.name);
                          setCustomerOptions([]);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white"
                      >
                        <span className="font-medium text-slate-700">{customer.name}</span>
                        <span className="text-xs text-slate-400">{customer.phone || "—"}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Discount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discount}
                  onChange={(e) => setForm((prev) => ({ ...prev, discount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Date</label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Mode</label>
                <select
                  value={form.paymentMode}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentMode: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Reference Number</label>
                <input
                  type="text"
                  value={form.referenceNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, referenceNumber: e.target.value }))}
                  placeholder="UTR / Cheque / Ref no."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional payment notes"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {formError && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSavePayment()}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingPayment ? "Update Payment" : "Save Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
