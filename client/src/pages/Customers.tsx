import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";
 
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
interface Customer {
  _id: string;
  name: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  outstandingAmount: number;
  isDefault?: boolean;
}
 
// ─── EDIT CUSTOMER MODAL ─────────────────────────────────────────────────────
 
interface EditCustomerModalProps {
  customer: Customer;
  onClose: () => void;
  onSave: (updated: Customer) => void;
}
 
function EditCustomerModal({ customer, onClose, onSave }: EditCustomerModalProps) {
  const [form, setForm] = useState({
    name: customer.name,
    gstNumber: customer.gstNumber || "",
    phone: customer.phone || "",
    email: customer.email || "",
    address: customer.address || "",
    creditLimit: customer.creditLimit || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
 
  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
 
  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Customer name required hai.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateCustomer(customer._id, form);
      onSave(updated);
      onClose();
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
 
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
 
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Editing Customer
              </p>
              <h2 className="text-lg font-bold text-white">{customer.name}</h2>
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
 
          {/* Body */}
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
 
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Customer Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                placeholder="e.g. Sharma Traders"
              />
            </div>
 
            {/* GST + Phone — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">GST Number</label>
                <input
                  type="text"
                  value={form.gstNumber}
                  onChange={(e) => handleChange("gstNumber", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  placeholder="9876543210"
                />
              </div>
            </div>
 
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                placeholder="customer@example.com"
              />
            </div>
 
            {/* Address */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                placeholder="Full address..."
              />
            </div>
 
            {/* Credit Limit */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Credit Limit (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.creditLimit}
                onChange={(e) => handleChange("creditLimit", Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>
 
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}
          </div>
 
          {/* Footer */}
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
      </div>
    </>
  );
}
 
// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
 
function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();
 
  const fetchCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };
 
  useEffect(() => {
    fetchCustomers();
  }, []);
 
  const handleCreate = async (customerData: any) => {
    await createCustomer(customerData);
    fetchCustomers();
    setShowAddModal(false);
  };
 
  const handleSaved = (updated: Customer) => {
    setCustomers((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };
 
  const handleDelete = async (id: string) => {
    if (!window.confirm("Is customer ko delete karna chahte ho?")) return;
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      // Backend default customer delete nahi karne deta
      const msg = err?.response?.data?.message || "Delete failed.";
      alert(msg);
    }
  };
 
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
 
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Customers</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your B2B customer accounts</p>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {customers.length} {customers.length === 1 ? "account" : "accounts"}
          </span>
        </div>
      </div>
 
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
 
        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Customer
          </button>
        </div>
 
        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">Add New Customer</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Fill in the customer details below</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-5">
                <CustomerForm onSubmit={handleCreate} />
              </div>
            </div>
          </div>
        )}
 
        {/* Customer List */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No customers yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Customer Accounts</h2>
            </div>
 
            <div className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">
                        {customer.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">{customer.name}</p>
                        {customer.isDefault && (
                          <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">GST: {customer.gstNumber || "—"}</p>
                    </div>
                  </div>
 
                  {/* Meta Info */}
                  <div className="hidden md:flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                      <p className="text-slate-600 font-medium">{customer.phone || "—"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Credit Limit</p>
                      <p className="text-slate-800 font-semibold">
                        ₹{Number(customer.creditLimit).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
 
                  {/* Actions — Ledger + Edit + Delete */}
                  <div className="ml-6 flex items-center gap-2 flex-shrink-0">
 
                    {/* ✅ View Ledger button */}
                    <button
                      onClick={() => navigate(`/customers/${customer._id}/ledger`)}
                      className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-purple-100 transition-all"
                      title="View Ledger"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Ledger
                    </button>
 
                    {/* Edit — always visible on mobile, hover on desktop */}
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all md:opacity-0 md:group-hover:opacity-100"
                      title="Edit customer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
 
                    {/* Delete — hidden for default customer */}
                    {!customer.isDefault && (
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all md:opacity-0 md:group-hover:opacity-100"
                        title="Delete customer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
 
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
 
      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSaved}
        />
      )}
 
    </div>
  );
}
 
export default Customers;

// import { useEffect, useState } from "react";
// import CustomerForm from "../components/CustomerForm";
// import {
//   getCustomers,
//   createCustomer,
//   updateCustomer,
//   deleteCustomer,
// } from "../services/customerService";

// // ─── TYPES ────────────────────────────────────────────────────────────────────

// interface Customer {
//   _id: string;
//   name: string;
//   gstNumber: string;
//   phone: string;
//   email: string;
//   address: string;
//   creditLimit: number;
//   outstandingAmount: number;
//   isDefault?: boolean;
// }

// // ─── EDIT CUSTOMER MODAL ─────────────────────────────────────────────────────

// interface EditCustomerModalProps {
//   customer: Customer;
//   onClose: () => void;
//   onSave: (updated: Customer) => void;
// }

// function EditCustomerModal({ customer, onClose, onSave }: EditCustomerModalProps) {
//   const [form, setForm] = useState({
//     name: customer.name,
//     gstNumber: customer.gstNumber || "",
//     phone: customer.phone || "",
//     email: customer.email || "",
//     address: customer.address || "",
//     creditLimit: customer.creditLimit || 0,
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (field: string, value: string | number) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     if (!form.name.trim()) {
//       setError("Customer name required hai.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     try {
//       const updated = await updateCustomer(customer._id, form);
//       onSave(updated);
//       onClose();
//     } catch {
//       setError("Save failed. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">

//           {/* Header */}
//           <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
//                 Editing Customer
//               </p>
//               <h2 className="text-lg font-bold text-white">{customer.name}</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-700 hover:text-white"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Body */}
//           <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

//             {/* Name */}
//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-700">
//                 Customer Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
//                 placeholder="e.g. Sharma Traders"
//               />
//             </div>

//             {/* GST + Phone — side by side */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">GST Number</label>
//                 <input
//                   type="text"
//                   value={form.gstNumber}
//                   onChange={(e) => handleChange("gstNumber", e.target.value)}
//                   className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
//                   placeholder="22AAAAA0000A1Z5"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
//                 <input
//                   type="text"
//                   value={form.phone}
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                   className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
//                   placeholder="9876543210"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
//               <input
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
//                 placeholder="customer@example.com"
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
//               <textarea
//                 rows={2}
//                 value={form.address}
//                 onChange={(e) => handleChange("address", e.target.value)}
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
//                 placeholder="Full address..."
//               />
//             </div>

//             {/* Credit Limit */}
//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-700">
//                 Credit Limit (₹)
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 value={form.creditLimit}
//                 onChange={(e) => handleChange("creditLimit", Number(e.target.value))}
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
//               />
//             </div>

//             {error && (
//               <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-end gap-3 border-t bg-white px-6 py-4">
//             <button
//               onClick={onClose}
//               className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
//             >
//               {saving ? (
//                 <>
//                   <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                   </svg>
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// function Customers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

//   const fetchCustomers = async () => {
//     const data = await getCustomers();
//     setCustomers(data);
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleCreate = async (customerData: any) => {
//     await createCustomer(customerData);
//     fetchCustomers();
//     setShowAddModal(false);
//   };

//   const handleSaved = (updated: Customer) => {
//     setCustomers((prev) =>
//       prev.map((c) => (c._id === updated._id ? updated : c))
//     );
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Is customer ko delete karna chahte ho?")) return;
//     try {
//       await deleteCustomer(id);
//       setCustomers((prev) => prev.filter((c) => c._id !== id));
//     } catch (err: any) {
//       // Backend default customer delete nahi karne deta
//       const msg = err?.response?.data?.message || "Delete failed.";
//       alert(msg);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">

//       {/* Page Header */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-5xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Customers</h1>
//             <p className="text-sm text-slate-500 mt-0.5">Manage your B2B customer accounts</p>
//           </div>
//           <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//             {customers.length} {customers.length === 1 ? "account" : "accounts"}
//           </span>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

//         {/* Add button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Customer
//           </button>
//         </div>

//         {/* Add Customer Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//                 <div>
//                   <h2 className="text-base font-semibold text-slate-800">Add New Customer</h2>
//                   <p className="text-xs text-slate-400 mt-0.5">Fill in the customer details below</p>
//                 </div>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="px-6 py-5">
//                 <CustomerForm onSubmit={handleCreate} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Customer List */}
//         {customers.length === 0 ? (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-16 text-center">
//             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//             </div>
//             <p className="text-slate-500 text-sm">No customers yet. Add your first one above.</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100">
//               <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Customer Accounts</h2>
//             </div>

//             <div className="divide-y divide-slate-100">
//               {customers.map((customer) => (
//                 <div
//                   key={customer._id}
//                   className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
//                 >
//                   {/* Avatar + Name */}
//                   <div className="flex items-center gap-4 min-w-0">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                       <span className="text-sm font-semibold text-blue-600">
//                         {customer.name
//                           ?.split(" ")
//                           .map((n: string) => n[0])
//                           .join("")
//                           .slice(0, 2)
//                           .toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="min-w-0">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-semibold text-slate-800 truncate">{customer.name}</p>
//                         {customer.isDefault && (
//                           <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
//                             Default
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs text-slate-400 mt-0.5">GST: {customer.gstNumber || "—"}</p>
//                     </div>
//                   </div>

//                   {/* Meta Info */}
//                   <div className="hidden md:flex items-center gap-8 text-sm">
//                     <div className="text-center">
//                       <p className="text-xs text-slate-400 mb-0.5">Phone</p>
//                       <p className="text-slate-600 font-medium">{customer.phone || "—"}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-slate-400 mb-0.5">Credit Limit</p>
//                       <p className="text-slate-800 font-semibold">
//                         ₹{Number(customer.creditLimit).toLocaleString("en-IN")}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Actions — Edit + Delete */}
//                   <div className="ml-6 flex items-center gap-2 flex-shrink-0">
//                     {/* Edit — always visible on mobile, hover on desktop */}
//                     <button
//                       onClick={() => setEditingCustomer(customer)}
//                       className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all md:opacity-0 md:group-hover:opacity-100"
//                       title="Edit customer"
//                     >
//                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                       Edit
//                     </button>

//                     {/* Delete — hidden for default customer */}
//                     {!customer.isDefault && (
//                       <button
//                         onClick={() => handleDelete(customer._id)}
//                         className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all md:opacity-0 md:group-hover:opacity-100"
//                         title="Delete customer"
//                       >
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         Delete
//                       </button>
//                     )}
//                   </div>

//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Edit Customer Modal */}
//       {editingCustomer && (
//         <EditCustomerModal
//           customer={editingCustomer}
//           onClose={() => setEditingCustomer(null)}
//           onSave={handleSaved}
//         />
//       )}

//     </div>
//   );
// }

// export default Customers;


// import { useEffect, useState } from "react";
// import CustomerForm from "../components/CustomerForm";
// import {
//   getCustomers,
//   createCustomer,
//   deleteCustomer,
// } from "../services/customerService";

// function Customers() {
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);

//   const fetchCustomers = async () => {
//     const data = await getCustomers();
//     setCustomers(data);
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleCreate = async (customerData: any) => {
//     await createCustomer(customerData);
//     fetchCustomers();
//     setShowModal(false); // ← ye line add karo
//   };

//   const handleDelete = async (id: string) => {
//     await deleteCustomer(id);
//     fetchCustomers();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">
//       {/* Page Header */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-5xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
//               Customers
//             </h1>
//             <p className="text-sm text-slate-500 mt-0.5">
//               Manage your B2B customer accounts
//             </p>
//           </div>
//           <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//             {customers.length} {customers.length === 1 ? "account" : "accounts"}
//           </span>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
//         {/* Add Customer Form Card */}
//         {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
//           <div className="px-6 py-4 border-b border-slate-100">
//             <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//               Add New Customer
//             </h2>
//           </div>
//           <div className="px-6 py-5">
//             <CustomerForm onSubmit={handleCreate} />
//           </div>
//         </div> */}
//         {/* Add Customer Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Customer
//           </button>
//         </div>

//         {/* Add Customer Modal */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//                 <div>
//                   <h2 className="text-base font-semibold text-slate-800">Add New Customer</h2>
//                   <p className="text-xs text-slate-400 mt-0.5">Fill in the customer details below</p>
//                 </div>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="px-6 py-5">
//                 <CustomerForm onSubmit={handleCreate} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Customer List */}
//         {customers.length === 0 ? (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-16 text-center">
//             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-6 h-6 text-slate-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//             </div>
//             <p className="text-slate-500 text-sm">No customers yet. Add your first one above.</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100">
//               <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//                 Customer Accounts
//               </h2>
//             </div>

//             <div className="divide-y divide-slate-100">
//               {customers.map((customer) => (
//                 <div
//                   key={customer._id}
//                   className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
//                 >
//                   {/* Avatar + Name */}
//                   <div className="flex items-center gap-4 min-w-0">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                       <span className="text-sm font-semibold text-blue-600">
//                         {customer.name
//                           ?.split(" ")
//                           .map((n: string) => n[0])
//                           .join("")
//                           .slice(0, 2)
//                           .toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-sm font-semibold text-slate-800 truncate">
//                         {customer.name}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         GST: {customer.gstNumber}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Meta Info */}
//                   <div className="hidden md:flex items-center gap-8 text-sm">
//                     <div className="text-center">
//                       <p className="text-xs text-slate-400 mb-0.5">Phone</p>
//                       <p className="text-slate-600 font-medium">{customer.phone}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-slate-400 mb-0.5">Credit Limit</p>
//                       <p className="text-slate-800 font-semibold">
//                         ₹{Number(customer.creditLimit).toLocaleString("en-IN")}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Mobile meta */}
//                   <div className="flex md:hidden flex-col text-right text-xs text-slate-500 mr-3">
//                     <span>{customer.phone}</span>
//                     <span className="font-medium text-slate-700">
//                       ₹{Number(customer.creditLimit).toLocaleString("en-IN")}
//                     </span>
//                   </div>

//                   {/* Delete */}
//                   <button
//                     onClick={() => handleDelete(customer._id)}
//                     className="ml-6 flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
//                     title="Delete customer"
//                   >
//                     <svg
//                       className="w-3.5 h-3.5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                       />
//                     </svg>
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Customers;


// import { useEffect, useState } from "react";

// import CustomerForm from "../components/CustomerForm";

// import {
//   getCustomers,
//   createCustomer,
//   deleteCustomer,
// } from "../services/customerService";

// function Customers() {

//   const [customers, setCustomers] =
//     useState<any[]>([]);

//   const fetchCustomers =
//     async () => {
//       const data =
//         await getCustomers();

//       setCustomers(data);
//     };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleCreate =
//     async (customerData: any) => {
//       await createCustomer(
//         customerData
//       );

//       fetchCustomers();
//     };

//   const handleDelete =
//     async (id: string) => {
//       await deleteCustomer(id);

//       fetchCustomers();
//     };

//   return (
//     <div>

//       <h1>
//         Customers
//       </h1>

//       <CustomerForm
//         onSubmit={handleCreate}
//       />

//       <hr />

//       {customers.map((customer) => (
//         <div
//           key={customer._id}
//         >
//           <h3>
//             {customer.name}
//           </h3>

//           <p>
//             GST:
//             {customer.gstNumber}
//           </p>

//           <p>
//             Phone:
//             {customer.phone}
//           </p>

//           <p>
//             Credit Limit:
//             ₹
//             {customer.creditLimit}
//           </p>

//           <button
//             onClick={() =>
//               handleDelete(
//                 customer._id
//               )
//             }
//           >
//             Delete
//           </button>

//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Customers;