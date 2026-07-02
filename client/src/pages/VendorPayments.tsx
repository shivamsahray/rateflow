import { useEffect, useMemo, useState } from "react";
import { createPurchasePayment, deletePurchasePayment, getPurchasePayments } from "../services/purchasePaymentService";
import { getPurchases } from "../services/purchaseService";
import { getVendors } from "../services/vendorService";

function VendorPayments() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [form, setForm] = useState({ vendorId: "", purchaseId: "", amount: "", paymentMode: "Cash", referenceNumber: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [vendorData, purchaseData, paymentData] = await Promise.all([getVendors(), getPurchases(), getPurchasePayments()]);
    setVendors(vendorData);
    setPurchases(purchaseData);
    setPayments(paymentData);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedVendor = useMemo(() => vendors.find((vendor) => vendor._id === form.vendorId), [form.vendorId, vendors]);
  const outstandingPurchases = useMemo(() => {
    if (!form.vendorId) {
      return [];
    }

    return purchases.filter((purchase) => {
      const vendorId = purchase.vendorId?._id || purchase.vendorId;
      return vendorId === form.vendorId && Number(purchase.outstandingAmount || 0) > 0;
    });
  }, [form.vendorId, purchases]);

  const selectedPurchase = useMemo(() => outstandingPurchases.find((purchase) => purchase._id === form.purchaseId), [form.purchaseId, outstandingPurchases]);

  const handleVendorChange = (vendorId: string) => {
    setForm((prev) => ({ ...prev, vendorId, purchaseId: "", amount: "" }));
    setError("");
  };

  const handlePurchaseSelect = (purchaseId: string) => {
    const purchase = outstandingPurchases.find((item) => item._id === purchaseId);
    setForm((prev) => ({
      ...prev,
      purchaseId,
      amount: purchase ? String(Number(purchase.outstandingAmount || 0).toFixed(2)) : "",
    }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!form.purchaseId) {
      setError("Please select an outstanding purchase bill before recording a payment.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedPurchase) {
      setError("The selected purchase is no longer available.");
      setIsSubmitting(false);
      return;
    }

    const amount = Number(form.amount || 0);
    const maxAmount = Number(selectedPurchase.outstandingAmount || 0);

    if (amount <= 0) {
      setError("Enter a valid payment amount.");
      setIsSubmitting(false);
      return;
    }

    if (amount > maxAmount) {
      setError(`Payment amount cannot exceed the outstanding balance of ₹${maxAmount.toFixed(2)}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      await createPurchasePayment({
        ...form,
        amount,
      });

      setForm({ vendorId: form.vendorId, purchaseId: "", amount: "", paymentMode: "Cash", referenceNumber: "", notes: "" });
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to save payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!window.confirm("Delete this payment and reverse its effect on the purchase?")) {
      return;
    }

    try {
      await deletePurchasePayment(paymentId);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to delete payment.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Vendor Payments</h1>
        <p className="text-sm text-slate-500">Record payments against specific purchase bills and keep the purchase status accurate.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Record Payment</h2>
          <form onSubmit={(event) => void handleSubmit(event)} className="mt-4 space-y-3">
            <select value={form.vendorId} onChange={(event) => handleVendorChange(event.target.value)} required className="w-full rounded-lg border px-3 py-2">
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name} — ₹{Number(vendor.outstandingAmount || 0).toFixed(2)}
                </option>
              ))}
            </select>

            {selectedVendor ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-700">{selectedVendor.name}</p>
                <p>Outstanding balance: ₹{Number(selectedVendor.outstandingAmount || 0).toFixed(2)}</p>
              </div>
            ) : null}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700">Outstanding purchase bills</p>
              {!form.vendorId ? (
                <p className="mt-2 text-sm text-slate-500">Select a vendor to see pending purchase bills.</p>
              ) : outstandingPurchases.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No outstanding purchases available for this vendor.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {outstandingPurchases.map((purchase) => (
                    <button
                      key={purchase._id}
                      type="button"
                      onClick={() => handlePurchaseSelect(purchase._id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left ${form.purchaseId === purchase._id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{purchase.purchaseNumber}</span>
                        <span>₹{Number(purchase.outstandingAmount || 0).toFixed(2)}</span>
                      </div>
                      <div className={`mt-1 text-xs ${form.purchaseId === purchase._id ? "text-slate-200" : "text-slate-500"}`}>
                        {purchase.invoiceNumber || "No invoice"} • Due {new Date(purchase.dueDate).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedPurchase ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <p className="font-semibold">Selected purchase: {selectedPurchase.purchaseNumber}</p>
                <p>Outstanding balance: ₹{Number(selectedPurchase.outstandingAmount || 0).toFixed(2)}</p>
              </div>
            ) : null}

            <input
              type="number"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="Pay Amount"
              required
              className="w-full rounded-lg border px-3 py-2"
            />
            <select value={form.paymentMode} onChange={(event) => setForm((prev) => ({ ...prev, paymentMode: event.target.value }))} className="w-full rounded-lg border px-3 py-2">
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
              <option value="Credit">Credit</option>
            </select>
            <input value={form.referenceNumber} onChange={(event) => setForm((prev) => ({ ...prev, referenceNumber: event.target.value }))} placeholder="Reference Number" className="w-full rounded-lg border px-3 py-2" />
            <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Remarks" rows={3} className="w-full rounded-lg border px-3 py-2" />
            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-white">
              {isSubmitting ? "Saving..." : "Save Payment"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800">Payment History</h2>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{payments.length} entries</div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 py-2">Vendor</th>
                  <th className="px-3 py-2">Purchase</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Reference</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-t">
                    <td className="px-3 py-2">{payment.vendorId?.name || "—"}</td>
                    <td className="px-3 py-2">{payment.purchaseId?.purchaseNumber || "—"}</td>
                    <td className="px-3 py-2">{new Date(payment.paymentDate || Date.now()).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{payment.paymentMode}</td>
                    <td className="px-3 py-2">₹{Number(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{payment.referenceNumber || "—"}</td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => void handleDelete(payment._id)} className="text-sm font-medium text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorPayments;
