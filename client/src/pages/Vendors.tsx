import { useEffect, useMemo, useState } from "react";
import { createVendor, deleteVendor, getVendors, updateVendor } from "../services/vendorService";

type VendorForm = {
  name: string;
  companyName: string;
  gstNumber: string;
  pan: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentTerms: string;
  creditLimit: string;
  openingBalance: string;
  status: string;
  notes: string;
};

const emptyForm: VendorForm = {
  name: "",
  companyName: "",
  gstNumber: "",
  pan: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  paymentTerms: "",
  creditLimit: "0",
  openingBalance: "0",
  status: "Active",
  notes: "",
};

function Vendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [form, setForm] = useState<VendorForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVendors = async () => {
    const data = await getVendors();
    setVendors(data);
  };

  useEffect(() => {
    void loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    const query = search.toLowerCase();
    return vendors.filter((vendor) => {
      const haystack = `${vendor.name} ${vendor.companyName} ${vendor.mobile} ${vendor.gstNumber}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [vendors, search]);

  const handleChange = (field: keyof VendorForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      creditLimit: Number(form.creditLimit || 0),
      openingBalance: Number(form.openingBalance || 0),
    };

    if (editingId) {
      await updateVendor(editingId, payload);
    } else {
      await createVendor(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    await loadVendors();
    setIsSubmitting(false);
  };

  const handleEdit = (vendor: any) => {
    setEditingId(vendor._id);
    setForm({
      name: vendor.name || "",
      companyName: vendor.companyName || "",
      gstNumber: vendor.gstNumber || "",
      pan: vendor.pan || "",
      mobile: vendor.mobile || "",
      email: vendor.email || "",
      address: vendor.address || "",
      city: vendor.city || "",
      state: vendor.state || "",
      pincode: vendor.pincode || "",
      paymentTerms: vendor.paymentTerms || "",
      creditLimit: String(vendor.creditLimit || 0),
      openingBalance: String(vendor.openingBalance || 0),
      status: vendor.status || "Active",
      notes: vendor.notes || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this vendor?")) {
      return;
    }

    await deleteVendor(id);
    await loadVendors();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vendor Management</h1>
          <p className="text-sm text-slate-500">Create vendors, track credit, and monitor outstanding balances.</p>
        </div>
        <div className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          Total Vendors: {vendors.length}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Vendor List</h2>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vendors"
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 py-2">Vendor</th>
                  <th className="px-3 py-2">Mobile</th>
                  <th className="px-3 py-2">Outstanding</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-semibold text-slate-800">{vendor.name}</div>
                      <div className="text-xs text-slate-500">{vendor.companyName || "—"}</div>
                    </td>
                    <td className="px-3 py-2">{vendor.mobile || "—"}</td>
                    <td className="px-3 py-2">₹{Number(vendor.outstandingAmount || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${vendor.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {vendor.status || "Active"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(vendor)} className="rounded bg-blue-600 px-2 py-1 text-white">Edit</button>
                        <button type="button" onClick={() => void handleDelete(vendor._id)} className="rounded bg-red-600 px-2 py-1 text-white">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">{editingId ? "Edit Vendor" : "Add Vendor"}</h2>
          <form className="mt-4 space-y-3" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.name} onChange={(event) => handleChange("name", event.target.value)} required placeholder="Vendor Name" className="rounded-lg border px-3 py-2" />
              <input value={form.companyName} onChange={(event) => handleChange("companyName", event.target.value)} placeholder="Company Name" className="rounded-lg border px-3 py-2" />
              <input value={form.gstNumber} onChange={(event) => handleChange("gstNumber", event.target.value)} placeholder="GST Number" className="rounded-lg border px-3 py-2" />
              <input value={form.pan} onChange={(event) => handleChange("pan", event.target.value)} placeholder="PAN" className="rounded-lg border px-3 py-2" />
              <input value={form.mobile} onChange={(event) => handleChange("mobile", event.target.value)} placeholder="Mobile" className="rounded-lg border px-3 py-2" />
              <input value={form.email} onChange={(event) => handleChange("email", event.target.value)} placeholder="Email" className="rounded-lg border px-3 py-2" />
              <input value={form.city} onChange={(event) => handleChange("city", event.target.value)} placeholder="City" className="rounded-lg border px-3 py-2" />
              <input value={form.state} onChange={(event) => handleChange("state", event.target.value)} placeholder="State" className="rounded-lg border px-3 py-2" />
              <input value={form.pincode} onChange={(event) => handleChange("pincode", event.target.value)} placeholder="Pincode" className="rounded-lg border px-3 py-2" />
              <input value={form.paymentTerms} onChange={(event) => handleChange("paymentTerms", event.target.value)} placeholder="Payment Terms" className="rounded-lg border px-3 py-2" />
              <input type="number" value={form.creditLimit} onChange={(event) => handleChange("creditLimit", event.target.value)} placeholder="Credit Limit" className="rounded-lg border px-3 py-2" />
              <input type="number" value={form.openingBalance} onChange={(event) => handleChange("openingBalance", event.target.value)} placeholder="Opening Balance" className="rounded-lg border px-3 py-2" />
            </div>
            <textarea value={form.address} onChange={(event) => handleChange("address", event.target.value)} placeholder="Address" className="w-full rounded-lg border px-3 py-2" rows={2} />
            <select value={form.status} onChange={(event) => handleChange("status", event.target.value)} className="w-full rounded-lg border px-3 py-2">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <textarea value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} placeholder="Notes" className="w-full rounded-lg border px-3 py-2" rows={2} />
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-white">
                {isSubmitting ? "Saving..." : editingId ? "Update Vendor" : "Save Vendor"}
              </button>
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-lg border px-4 py-2">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Vendors;
