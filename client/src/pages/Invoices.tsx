// import {
//   useEffect,
//   useState
// } from "react";

// import {
//   Link
// } from "react-router-dom";

// import {
//   getInvoices
// } from "../services/invoiceService";

// function Invoices() {

//   const [invoices,
//     setInvoices] =
//       useState<any[]>([]);

//   useEffect(() => {

//     const loadInvoices =
//       async () => {

//         const data =
//           await getInvoices();

//         setInvoices(data);
//       };

//     loadInvoices();

//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">

//       <div className="mx-auto max-w-6xl">

//         <h1 className="
//           mb-8
//           text-3xl
//           font-bold
//         ">
//           Invoices
//         </h1>

//         <div className="
//           rounded-2xl
//           bg-white
//           shadow-sm
//           border
//         ">

//           <table className="w-full">

//             <thead>

//               <tr className="
//                 bg-slate-100
//               ">

//                 <th className="p-4">
//                   Invoice
//                 </th>

//                 <th className="p-4">
//                   Customer
//                 </th>

//                 <th className="p-4">
//                   Total
//                 </th>

//                 <th className="p-4">
//                   Action
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {invoices.map(
//                 (
//                   invoice
//                 ) => (

//                   <tr
//                     key={
//                       invoice._id
//                     }
//                     className="
//                       border-t
//                     "
//                   >

//                     <td className="p-4">
//                       {
//                         invoice.invoiceNumber
//                       }
//                     </td>

//                     <td className="p-4">
//                       {
//                         invoice.customerId
//                           ?.name
//                       }
//                     </td>

//                     <td className="p-4">

//                       ₹
//                       {
//                         invoice.totalAmount
//                       }

//                     </td>

//                     <td className="p-4">

//                       <Link
//                         to={
//                           `/invoice/${invoice._id}`
//                         }
//                         className="
//                           rounded-lg
//                           bg-blue-600
//                           px-4
//                           py-2
//                           text-white
//                         "
//                       >

//                         View

//                       </Link>

//                     </td>

//                   </tr>

//                 )
//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Invoices;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInvoices, updateInvoice, deleteInvoice } from "../services/invoiceService";
import { getProducts } from "../services/productService";
import { getLastPrice } from "../services/pricingService";
 
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
interface Product {
  _id: string;
  name: string;
  defaultPrice: number;
  gstPercent: number;
}
 
interface InvoiceItem {
  productId: string | { _id: string; name: string };
  quantity: number;
  price: number;
  gstPercent: number;
  amount: number;
}
 
interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerId: { _id: string; name: string } | null;
  totalAmount: number;
  grandTotal: number;
  paymentStatus: "Pending" | "Partial" | "Paid";
  vehicleNumber?: string;
  ewayBillNumber?: string;
  notes?: string;
  // paymentTerms?: string;
  items: InvoiceItem[];
}
 
// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
 
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Partial: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};
 
// ─── TRASH ICON ───────────────────────────────────────────────────────────────
 
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
 
// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
 
interface EditModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSave: (updated: Invoice) => void;
}
 
function EditModal({ invoice, onClose, onSave }: EditModalProps) {
  // General fields
  const [notes, setNotes] = useState(invoice.notes || "");
  const [vehicleNumber, setVehicleNumber] = useState(invoice.vehicleNumber || "");
  const [ewayBillNumber, setEwayBillNumber] = useState(invoice.ewayBillNumber || "");
  // const [paymentTerms, setPaymentTerms] = useState(invoice.paymentTerms || "");
  const [invoiceDate, setInvoiceDate] = useState(
    invoice.invoiceDate ? invoice.invoiceDate.split("T")[0] : ""
  );
 
  // Items — normalize productId to string
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice.items.map((item) => ({
      ...item,
      productId:
        typeof item.productId === "object" ? item.productId._id : item.productId,
    }))
  );
 
  // Products list for dropdown
  const [products, setProducts] = useState<Product[]>([]);
 
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
 
  // customerId needed for getLastPrice (same as CreateInvoice)
  const customerId =
    typeof invoice.customerId === "object"
      ? invoice.customerId?._id
      : invoice.customerId || "";
 
  // Load products on mount
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => console.error("Could not load products"));
  }, []);
 
  // ── Item helpers ──────────────────────────────────────────────────────────
 
  /** When user selects a product from dropdown — fetch last price (same logic as CreateInvoice) */
  const handleProductSelect = async (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
 
    let price = product.defaultPrice;
 
    try {
      if (customerId) {
        const data = await getLastPrice(customerId, productId);
        if (data?.lastSoldPrice) {
          price = data.lastSoldPrice;
        }
      }
    } catch {
      // No previous pricing — use default
    }
 
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId,
              price,
              gstPercent: product.gstPercent,
              amount: parseFloat(
                (price * item.quantity * (1 + product.gstPercent / 100)).toFixed(2)
              ),
            }
          : item
      )
    );
  };
 
  /** Update qty / price / gstPercent and recalc amount */
  const updateItemField = (
    index: number,
    field: "quantity" | "price" | "gstPercent",
    value: number
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const it = updated[index];
      const base = Number(it.quantity) * Number(it.price);
      updated[index].amount = parseFloat(
        (base + (base * Number(it.gstPercent)) / 100).toFixed(2)
      );
      return updated;
    });
  };
 
  /** Add a blank row */
  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { productId: "", quantity: 1, price: 0, gstPercent: 0, amount: 0 },
    ]);
  };
 
  /** Remove a row — keep minimum 1 */
  const removeRow = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };
 
  // ── Live totals ───────────────────────────────────────────────────────────
 
  const subtotal = items.reduce((s, i) => s + Number(i.quantity) * Number(i.price), 0);
  const gstTotal = items.reduce(
    (s, i) =>
      s + (Number(i.quantity) * Number(i.price) * Number(i.gstPercent)) / 100,
    0
  );
  const grandTotal = subtotal + gstTotal;
 
  // ── Save ──────────────────────────────────────────────────────────────────
 
  const handleSave = async () => {
    // Validate: every item must have a product selected
    const invalid = items.some((it) => !it.productId);
    if (invalid) {
      setError("Har item mein product select karo.");
      return;
    }
 
    setSaving(true);
    setError("");
    try {
      const updated = await updateInvoice(invoice._id, {
        notes,
        vehicleNumber,
        ewayBillNumber,
        // paymentTerms,
        invoiceDate,
        items: items.map((it) => ({
          ...it,
          productId:
            typeof it.productId === "object"
              ? (it.productId as { _id: string })._id
              : it.productId,
          amount: it.amount,
        })),
      });
      onSave(updated);
      onClose();
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };
 
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
 
      {/* Side panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl">
 
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b bg-slate-900 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Editing Invoice
            </p>
            <h2 className="text-xl font-bold text-white">#{invoice.invoiceNumber}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 
        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
 
          {/* General Fields */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              General
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Vehicle Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. MH12AB1234"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">E-Way Bill Number</label>
                <input
                  type="text"
                  value={ewayBillNumber}
                  onChange={(e) => setEwayBillNumber(e.target.value)}
                  placeholder="E-Way Bill No."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
              {/* <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Terms</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. Net 30"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div> */}
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes for this invoice..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </section>
 
          {/* ── Line Items ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Line Items
              </h3>
              <button
                onClick={addRow}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            </div>
 
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-3 py-2.5 font-medium text-slate-500">Product</th>
                    <th className="px-3 py-2.5 font-medium text-slate-500 text-center">Qty</th>
                    <th className="px-3 py-2.5 font-medium text-slate-500">Rate (₹)</th>
                    <th className="px-3 py-2.5 font-medium text-slate-500 text-center">GST %</th>
                    <th className="px-3 py-2.5 font-medium text-slate-500 text-right">Amount</th>
                    <th className="px-3 py-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => {
                    const lineBase = Number(item.quantity) * Number(item.price);
                    const lineGST = (lineBase * Number(item.gstPercent)) / 100;
                    const lineTotal = lineBase + lineGST;
 
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
 
                        {/* Product Dropdown */}
                        <td className="px-3 py-2">
                          <select
                            value={
                              typeof item.productId === "object"
                                ? (item.productId as { _id: string })._id
                                : item.productId
                            }
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200"
                          >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </td>
 
                        {/* Qty */}
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemField(idx, "quantity", Number(e.target.value))
                            }
                            className="w-16 rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200"
                          />
                        </td>
 
                        {/* Rate */}
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) =>
                              updateItemField(idx, "price", Number(e.target.value))
                            }
                            className="w-24 rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200"
                          />
                        </td>
 
                        {/* GST % */}
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.gstPercent}
                            onChange={(e) =>
                              updateItemField(idx, "gstPercent", Number(e.target.value))
                            }
                            className="w-16 rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200"
                          />
                        </td>
 
                        {/* Line Total */}
                        <td className="px-3 py-2 text-right font-medium text-slate-700">
                          ₹{lineTotal.toFixed(2)}
                        </td>
 
                        {/* Remove row */}
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeRow(idx)}
                            disabled={items.length === 1}
                            title="Remove this item"
                            className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <TrashIcon />
                          </button>
                        </td>
 
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
 
            {/* Live totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-56 space-y-1.5 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST</span>
                  <span>₹{gstTotal.toFixed(2)}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>
 
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
 
        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
 
      </div>
    </>
  );
}
 
// ─── DELETE CONFIRM DIALOG ────────────────────────────────────────────────────
 
interface DeleteDialogProps {
  invoice: Invoice;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}
 
function DeleteDialog({ invoice, onClose, onConfirm, deleting }: DeleteDialogProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <TrashIcon />
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">Delete Invoice?</h3>
          <p className="text-sm text-slate-500">
            Invoice{" "}
            <span className="font-semibold text-slate-700">#{invoice.invoiceNumber}</span>{" "}
            for{" "}
            <span className="font-semibold text-slate-700">
              {invoice.customerId?.name || "—"}
            </span>{" "}
            permanently delete ho jaayega. Ye action undo nahi ho sakta.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
 
// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
 
function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);
 
  useEffect(() => {
    const loadInvoices = async () => {
      const data = await getInvoices();
      setInvoices(data);
      setLoading(false);
    };
    loadInvoices();
  }, []);
 
  const handleSaved = (updated: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv._id === updated._id ? updated : inv))
    );
  };
 
  const handleDeleteConfirm = async () => {
    if (!deletingInvoice) return;
    setDeleting(true);
    try {
      await deleteInvoice(deletingInvoice._id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== deletingInvoice._id));
      setDeletingInvoice(null);
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
 
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
 
        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading invoices…</div>
          ) : invoices.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">No invoices found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Amount</th>
                  {/* <th className="px-5 py-3.5">Status</th> */}
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="group transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-mono font-medium text-slate-700">
                      #{invoice.invoiceNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {invoice.invoiceDate
                        ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {invoice.customerId?.name || "—"}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      ₹{(invoice.grandTotal || invoice.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    {/* <td className="px-5 py-3.5">
                      <StatusBadge status={invoice.paymentStatus} />
                    </td> */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/invoice/${invoice._id}`}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setEditingInvoice(invoice)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingInvoice(invoice)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
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
      {editingInvoice && (
        <EditModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSave={handleSaved}
        />
      )}
 
      {/* Delete Confirm */}
      {deletingInvoice && (
        <DeleteDialog
          invoice={deletingInvoice}
          onClose={() => setDeletingInvoice(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}
    </div>
  );
}
 
export default Invoices;
 