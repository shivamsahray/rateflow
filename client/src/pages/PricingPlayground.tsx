// import { useEffect, useState } from "react";

// import {
//   getCustomers
// } from "../services/customerService";

// import {
//   getProducts
// } from "../services/productService";

// import {
//   getLastPrice
// } from "../services/pricingService";

// function PricingPlayground() {

//   const [customers, setCustomers] =
//     useState<any[]>([]);

//   const [products, setProducts] =
//     useState<any[]>([]);

//   const [customerId,
//     setCustomerId] =
//       useState("");

//   const [productId,
//     setProductId] =
//       useState("");

//   const [priceData,
//     setPriceData] =
//       useState<any>(null);

//   useEffect(() => {

//     const loadData =
//       async () => {

//         const customerData =
//           await getCustomers();

//         const productData =
//           await getProducts();

//         setCustomers(
//           customerData
//         );

//         setProducts(
//           productData
//         );
//       };

//     loadData();

//   }, []);

//   const handleCheck =
//     async () => {

//       const data =
//         await getLastPrice(
//           customerId,
//           productId
//         );

//       setPriceData(data);
//     };

//   return (
//     <div>

//       <h1>
//         Pricing Playground
//       </h1>

//       <select
//         value={customerId}
//         onChange={(e) =>
//           setCustomerId(
//             e.target.value
//           )
//         }
//       >
//         <option value="">
//           Select Customer
//         </option>

//         {customers.map(
//           (customer) => (
//             <option
//               key={customer._id}
//               value={customer._id}
//             >
//               {customer.name}
//             </option>
//           )
//         )}
//       </select>

//       <br />
//       <br />

//       <select
//         value={productId}
//         onChange={(e) =>
//           setProductId(
//             e.target.value
//           )
//         }
//       >
//         <option value="">
//           Select Product
//         </option>

//         {products.map(
//           (product) => (
//             <option
//               key={product._id}
//               value={product._id}
//             >
//               {product.name}
//             </option>
//           )
//         )}
//       </select>

//       <br />
//       <br />

//       <button
//         onClick={handleCheck}
//       >
//         Check Last Price
//       </button>

//       <br />
//       <br />

//       {priceData && (

//         <div>

//           <h3>
//             Last Sold Price:
//             ₹
//             {priceData.lastSoldPrice}
//           </h3>

//           <p>
//             Date:
//             {" "}
//             {
//               new Date(
//                 priceData.soldAt
//               )
//               .toLocaleDateString()
//             }
//           </p>

//         </div>

//       )}

//     </div>
//   );
// }

// export default PricingPlayground;



import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getLastPrice } from "../services/pricingService";

function PricingPlayground() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [priceData, setPriceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const customerData = await getCustomers();
      const productData = await getProducts();
      setCustomers(customerData);
      setProducts(productData);
    };
    loadData();
  }, []);

  const handleCheck = async () => {
    setLoading(true);
    const data = await getLastPrice(customerId, productId);
    setPriceData(data);
    setLoading(false);
  };

  const selectedCustomer = customers.find((c) => c._id === customerId);
  const selectedProduct = products.find((p) => p._id === productId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="w-full mx-auto">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Pricing Playground
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Look up the last sold price for any customer–product combination
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-8 py-8 space-y-6">
        {/* Lookup Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Price Lookup
            </h2>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* Customer Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Customer
              </label>
              <div className="relative">
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Product
              </label>
              <div className="relative">
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={handleCheck}
              disabled={!customerId || !productId || loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  Check Last Price
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Card */}
        {priceData && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Last Sold Price
              </h2>
              <span className="text-xs text-slate-400">
                {new Date(priceData.soldAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="px-6 py-6">
              {/* Context */}
              {(selectedCustomer || selectedProduct) && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                  {selectedCustomer && (
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                      {selectedCustomer.name}
                    </span>
                  )}
                  {selectedCustomer && selectedProduct && (
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {selectedProduct && (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md font-medium">
                      {selectedProduct.name}
                    </span>
                  )}
                </div>
              )}

              {/* Price Display */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-400">₹</span>
                <span className="text-4xl font-bold text-slate-800 tracking-tight">
                  {Number(priceData.lastSoldPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Last invoiced on{" "}
                <span className="text-slate-600 font-medium">
                  {new Date(priceData.soldAt).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingPlayground;