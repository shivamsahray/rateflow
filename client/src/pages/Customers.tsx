import { useEffect, useState } from "react";
import CustomerForm from "../components/CustomerForm";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
} from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);

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
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    fetchCustomers();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Customers
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your B2B customer accounts
            </p>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {customers.length} {customers.length === 1 ? "account" : "accounts"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
        {/* Add Customer Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Add New Customer
            </h2>
          </div>
          <div className="px-6 py-5">
            <CustomerForm onSubmit={handleCreate} />
          </div>
        </div>

        {/* Customer List */}
        {customers.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No customers yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Customer Accounts
              </h2>
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
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        GST: {customer.gstNumber}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="hidden md:flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                      <p className="text-slate-600 font-medium">{customer.phone}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Credit Limit</p>
                      <p className="text-slate-800 font-semibold">
                        ₹{Number(customer.creditLimit).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Mobile meta */}
                  <div className="flex md:hidden flex-col text-right text-xs text-slate-500 mr-3">
                    <span>{customer.phone}</span>
                    <span className="font-medium text-slate-700">
                      ₹{Number(customer.creditLimit).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="ml-6 flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete customer"
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;


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