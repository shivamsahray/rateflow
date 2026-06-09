// import { useEffect, useState } from "react";

// import ProductForm from "../components/ProductForm";

// import {
//   getProducts,
//   createProduct,
//   deleteProduct,
// } from "../services/productService";

// function Products() {

//   const [products, setProducts] =
//     useState<any[]>([]);

//   const fetchProducts =
//     async () => {
//       const data =
//         await getProducts();

//       setProducts(data);
//     };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleCreate =
//     async (productData: any) => {
//       await createProduct(
//         productData
//       );

//       fetchProducts();
//     };

//   const handleDelete =
//     async (id: string) => {
//       await deleteProduct(id);

//       fetchProducts();
//     };

//   return (
//     <div>

//       <h1>
//         Products
//       </h1>

//       <ProductForm
//         onSubmit={handleCreate}
//       />

//       <hr />

//       {products.map((product) => (

//         <div
//           key={product._id}
//         >

//           <h3>
//             {product.name}
//           </h3>

//           <p>
//             SKU:
//             {product.sku}
//           </p>

//           <p>
//             Price:
//             ₹
//             {product.defaultPrice}
//           </p>

//           <p>
//             Stock:
//             {product.stock}
//             {" "}
//             {product.unit}
//           </p>

//           <p>
//             GST:
//             {product.gstPercent}%
//           </p>

//           <button
//             onClick={() =>
//               handleDelete(
//                 product._id
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

// export default Products;


// import { useEffect, useState } from "react";
// import ProductForm from "../components/ProductForm";
// import {
//   getProducts,
//   createProduct,
//   deleteProduct,
// } from "../services/productService";

// function Products() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);

//   const fetchProducts = async () => {
//     const data = await getProducts();
//     setProducts(data);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleCreate = async (productData: any) => {
//     await createProduct(productData);
//     fetchProducts();
//     setShowModal(false); // ← ye add karo
//   };

//   const handleDelete = async (id: string) => {
//     await deleteProduct(id);
//     fetchProducts();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">
//       {/* Page Header */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-5xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
//               Products
//             </h1>
//             <p className="text-sm text-slate-500 mt-0.5">
//               Manage your product catalogue and pricing
//             </p>
//           </div>
//           <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//             {products.length} {products.length === 1 ? "product" : "products"}
//           </span>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
//         {/* Add Product Form Card */}
//         {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
//           <div className="px-6 py-4 border-b border-slate-100">
//             <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//               Add New Product
//             </h2>
//           </div>
//           <div className="px-6 py-5">
//             <ProductForm onSubmit={handleCreate} />
//           </div>
//         </div> */}
//         {/* Add Product Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Product
//           </button>
//         </div>

//         {/* Add Product Modal */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//                 <div>
//                   <h2 className="text-base font-semibold text-slate-800">Add New Product</h2>
//                   <p className="text-xs text-slate-400 mt-0.5">Fill in the product details below</p>
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
//                 <ProductForm onSubmit={handleCreate} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Product List */}
//         {products.length === 0 ? (
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
//                   d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
//                 />
//               </svg>
//             </div>
//             <p className="text-slate-500 text-sm">
//               No products yet. Add your first product above.
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100">
//               <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//                 Product Catalogue
//               </h2>
//             </div>

//             {/* Table Header */}
//             <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
//               <div className="col-span-4">Product</div>
//               <div className="col-span-2 text-right">Price</div>
//               <div className="col-span-2 text-right">Stock</div>
//               <div className="col-span-2 text-right">GST</div>
//               <div className="col-span-2 text-right">Action</div>
//             </div>

//             <div className="divide-y divide-slate-100">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors group"
//                 >
//                   {/* Name + SKU */}
//                   <div className="col-span-12 md:col-span-4 flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
//                       <svg
//                         className="w-4 h-4 text-emerald-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1.75}
//                           d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
//                         />
//                       </svg>
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-sm font-semibold text-slate-800 truncate">
//                         {product.name}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         SKU: {product.sku}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div className="col-span-4 md:col-span-2 text-right">
//                     <p className="text-xs text-slate-400 mb-0.5 md:hidden">Price</p>
//                     <p className="text-sm font-semibold text-slate-800">
//                       ₹{Number(product.defaultPrice).toLocaleString("en-IN")}
//                     </p>
//                   </div>

//                   {/* Stock */}
//                   <div className="col-span-4 md:col-span-2 text-right">
//                     <p className="text-xs text-slate-400 mb-0.5 md:hidden">Stock</p>
//                     <p className="text-sm text-slate-600 font-medium">
//                       {product.stock}{" "}
//                       <span className="text-xs text-slate-400 font-normal">
//                         {product.unit}
//                       </span>
//                     </p>
//                   </div>

//                   {/* GST */}
//                   <div className="col-span-4 md:col-span-2 text-right">
//                     <p className="text-xs text-slate-400 mb-0.5 md:hidden">GST</p>
//                     <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
//                       {product.gstPercent}%
//                     </span>
//                   </div>

//                   {/* Delete */}
//                   <div className="col-span-12 md:col-span-2 flex md:justify-end">
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all md:opacity-0 md:group-hover:opacity-100"
//                       title="Delete product"
//                     >
//                       <svg
//                         className="w-3.5 h-3.5"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Products;

import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  name: string;
  sku: string;
  unit: string;
  defaultPrice: number;
  stock: number;
  gstPercent: number;
}

// ─── EDIT PRODUCT MODAL ───────────────────────────────────────────────────────

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updated: Product) => void;
}

function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [form, setForm] = useState({
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    defaultPrice: product.defaultPrice,
    stock: product.stock,
    gstPercent: product.gstPercent,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.sku.trim() || !form.unit.trim()) {
      setError("Name, SKU aur Unit required hain.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateProduct(product._id, form);
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
                Editing Product
              </p>
              <h2 className="text-lg font-bold text-white">{product.name}</h2>
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
          <div className="px-6 py-5 space-y-4">

            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                placeholder="e.g. Mustard Oil 1L"
              />
            </div>

            {/* SKU + Unit — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  SKU <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  placeholder="e.g. MO-1L"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Unit <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  placeholder="e.g. Litre, Box, Kg"
                />
              </div>
            </div>

            {/* Price + Stock — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Default Price (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.defaultPrice}
                  onChange={(e) => handleChange("defaultPrice", Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            {/* GST % */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                GST %
              </label>
              <select
                value={form.gstPercent}
                onChange={(e) => handleChange("gstPercent", Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
              >
                {[0, 5, 12, 18, 28].map((g) => (
                  <option key={g} value={g}>
                    {g}%
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
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

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (productData: any) => {
    await createProduct(productData);
    fetchProducts();
    setShowAddModal(false);
  };

  const handleSaved = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Is product ko delete karna chahte ho?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your product catalogue and pricing</p>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">

        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">Add New Product</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Fill in the product details below</p>
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
                <ProductForm onSubmit={handleCreate} />
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No products yet. Add your first product above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Product Catalogue</h2>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <div className="col-span-4">Product</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Stock</div>
              <div className="col-span-2 text-right">GST</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-slate-100">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Name + SKU */}
                  <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">SKU: {product.sku}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 text-right">
                    <p className="text-xs text-slate-400 mb-0.5 md:hidden">Price</p>
                    <p className="text-sm font-semibold text-slate-800">
                      ₹{Number(product.defaultPrice).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="col-span-4 md:col-span-2 text-right">
                    <p className="text-xs text-slate-400 mb-0.5 md:hidden">Stock</p>
                    <p className="text-sm text-slate-600 font-medium">
                      {product.stock}{" "}
                      <span className="text-xs text-slate-400 font-normal">{product.unit}</span>
                    </p>
                  </div>

                  {/* GST */}
                  <div className="col-span-4 md:col-span-2 text-right">
                    <p className="text-xs text-slate-400 mb-0.5 md:hidden">GST</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
                      {product.gstPercent}%
                    </span>
                  </div>

                  {/* Actions — Edit + Delete */}
                  <div className="col-span-12 md:col-span-2 flex md:justify-end items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all md:opacity-0 md:group-hover:opacity-100"
                      title="Edit product"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all md:opacity-0 md:group-hover:opacity-100"
                      title="Delete product"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaved}
        />
      )}

    </div>
  );
}

export default Products;