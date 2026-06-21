import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
}

function CustomerForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    phone: "",
    address: "",
    creditLimit: 0,
    openingBalance: 0,        // ✅ NEW
    openingBalanceDate: new Date().toISOString().slice(0, 10), // ✅ NEW
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      gstNumber: "",
      phone: "",
      address: "",
      creditLimit: 0,
      openingBalance: 0,
      openingBalanceDate: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Customer Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Customer Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            placeholder="e.g. ABC Industries"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* GST Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            GST Number
          </label>
          <input
            name="gstNumber"
            placeholder="e.g. 06ABCDE1234F1Z5"
            value={formData.gstNumber}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Phone <span className="text-red-400">*</span>
          </label>
          <input
            name="phone"
            placeholder="e.g. 9876543210"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Credit Limit */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Credit Limit (₹)
          </label>
          <input
            name="creditLimit"
            type="number"
            placeholder="e.g. 50000"
            value={formData.creditLimit}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Address — full width */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Address
          </label>
          <input
            name="address"
            placeholder="e.g. 12, Sector 18, Gurugram, Haryana"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* ✅ NEW: Opening Balance Section — full width, visually separated */}
        <div className="sm:col-span-2 mt-1 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Migrating an existing customer? Add their previous balance here
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Opening Balance (₹)
              </label>
              <input
                name="openingBalance"
                type="number"
                placeholder="0"
                value={formData.openingBalance}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 placeholder:text-slate-300 transition-all"
              />
              <p className="text-xs text-slate-400">Amount this customer already owed before joining RateFlow</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                As Of Date
              </label>
              <input
                name="openingBalanceDate"
                type="date"
                value={formData.openingBalanceDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

    </form>
  );
}

export default CustomerForm;