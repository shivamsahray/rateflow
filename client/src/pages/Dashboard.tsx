// import { Link } from "react-router-dom";
// import "./Dashboard.css";

// function Dashboard() {

//   return (
//     <div className="dashboard">
//       <div className="card">
//         <h1>RateFlow Dashboard</h1>
//         <p className="lead">Quick links for billing and inventory management</p>

//         <div className="links-row nav">
//           <Link to="/customers">Customers</Link>
//           <Link to="/products">Products</Link>
//           <Link to="/pricing">Pricing Playground</Link>
//           <Link to="/invoices">Create Invoice</Link>
//           <Link to="/all-invoices">Invoices</Link>
//           <Link to="/settings">Settings</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxes,
  FaFileInvoice,
  FaRupeeSign,
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalInvoices: 0,
    outstanding: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
        // ✅ Token localStorage se lo aur Authorization header mein bhejo
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to RateFlow Business Overview
        </p>
      </div>

      {/* First Row */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <FaUsers className="text-blue-500 text-2xl mb-3" />

          <p className="text-gray-500">
            Customers
          </p>

          <h2 className="text-3xl font-bold">
            {stats.totalCustomers}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <FaBoxes className="text-green-500 text-2xl mb-3" />

          <p className="text-gray-500">
            Products
          </p>

          <h2 className="text-3xl font-bold">
            {stats.totalProducts}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <FaFileInvoice className="text-purple-500 text-2xl mb-3" />

          <p className="text-gray-500">
            Invoices
          </p>

          <h2 className="text-3xl font-bold">
            {stats.totalInvoices}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <FaRupeeSign className="text-red-500 text-2xl mb-3" />

          <p className="text-gray-500">
            Outstanding
          </p>

          <h2 className="text-3xl font-bold text-red-600">
            ₹{Number(stats.outstanding).toFixed(2)}
          </h2>
        </div>

      </div>

      {/* Second Row */}

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">

          <h3 className="text-green-700 font-semibold">
            Paid Invoices
          </h3>

          <p className="text-5xl font-bold mt-4">
            {stats.paidInvoices}
          </p>

        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

          <h3 className="text-red-700 font-semibold">
            Pending / Partial Invoices
          </h3>

          <p className="text-5xl font-bold mt-4">
            {stats.pendingInvoices}
          </p>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;