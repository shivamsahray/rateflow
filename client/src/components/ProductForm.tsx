import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
}

function ProductForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    unit: "",
    gstPercent: 18,
    defaultPrice: 0,
    stock: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", sku: "", unit: "", gstPercent: 18, defaultPrice: 0, stock: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Product Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            placeholder="e.g. HDPE Granules"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* SKU */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            SKU <span className="text-red-400">*</span>
          </label>
          <input
            name="sku"
            placeholder="e.g. HDPE001"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Unit */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Unit <span className="text-red-400">*</span>
          </label>
          <input
            name="unit"
            placeholder="e.g. KG, Litre, Piece"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* GST % */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            GST %
          </label>
          <input
            name="gstPercent"
            type="number"
            placeholder="e.g. 18"
            value={formData.gstPercent}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Default Price */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Default Price (₹) <span className="text-red-400">*</span>
          </label>
          <input
            name="defaultPrice"
            type="number"
            placeholder="e.g. 100"
            value={formData.defaultPrice}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Opening Stock */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Opening Stock
          </label>
          <input
            name="stock"
            type="number"
            placeholder="e.g. 500"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-300 transition-all"
          />
        </div>

      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

    </form>
  );
}

export default ProductForm;