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


import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";

function Products() {
  const [products, setProducts] = useState<any[]>([]);

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
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Products
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your product catalogue and pricing
            </p>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
        {/* Add Product Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Add New Product
            </h2>
          </div>
          <div className="px-6 py-5">
            <ProductForm onSubmit={handleCreate} />
          </div>
        </div>

        {/* Product List */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              No products yet. Add your first product above.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Product Catalogue
              </h2>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <div className="col-span-4">Product</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Stock</div>
              <div className="col-span-2 text-right">GST</div>
              <div className="col-span-2 text-right">Action</div>
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
                      <svg
                        className="w-4 h-4 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        SKU: {product.sku}
                      </p>
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
                      <span className="text-xs text-slate-400 font-normal">
                        {product.unit}
                      </span>
                    </p>
                  </div>

                  {/* GST */}
                  <div className="col-span-4 md:col-span-2 text-right">
                    <p className="text-xs text-slate-400 mb-0.5 md:hidden">GST</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
                      {product.gstPercent}%
                    </span>
                  </div>

                  {/* Delete */}
                  <div className="col-span-12 md:col-span-2 flex md:justify-end">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all md:opacity-0 md:group-hover:opacity-100"
                      title="Delete product"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
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
    </div>
  );
}

export default Products;