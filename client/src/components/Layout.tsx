// import { NavLink, Outlet } from "react-router-dom";

// function Layout() {
//   return (
//     <div className="flex min-h-screen bg-gray-100">

//       {/* Sidebar */}

//       <aside className="w-64 bg-white border-r shadow-lg">

//         <div className="p-6 border-b">
//           <div>
//             <h1 className="text-2xl font-bold text-blue-600">
//               RateFlow
//             </h1>

//             <p className="text-xs text-gray-500 mt-1">
//               Business ERP
//             </p>
//           </div>
//         </div>

//         <nav className="p-4 space-y-2">

//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             📊 Dashboard
//           </NavLink>

//           <NavLink
//             to="/customers"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             👥 Customers
//           </NavLink>

//           <NavLink
//             to="/products"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             📦 Products
//           </NavLink>

//           <NavLink
//             to="/pricing"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             💰 Pricing
//           </NavLink>

//           <NavLink
//             to="/invoices"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             📄 Create Invoice
//           </NavLink>

//           <NavLink
//             to="/all-invoices"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             📄 All Invoices
//           </NavLink>

//           <NavLink
//             to="/settings"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? "bg-blue-600 text-white font-semibold"
//                   : "hover:bg-blue-50"
//               }`
//             }
//           >
//             ⚙️ Settings
//           </NavLink>

//         </nav>
//       </aside>

//       {/* Main Area */}

//       <div className="flex-1">

//         {/* Navbar */}

//         <header className="bg-white border-b px-8 py-4 flex justify-between items-center">

//           <h2 className="font-semibold text-xl">
//             RateFlow ERP
//           </h2>

//           <div className="flex items-center gap-4">

//           <button className="text-xl">
//             🔔
//           </button>

//           <div className="font-medium">
//             👤 Shivam
//           </div>

//         </div>

//         </header>

//         {/* Page Content */}

//         <main>
//           <Outlet />
//         </main>

//       </div>

//     </div>
//   );
// }

// export default Layout;

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Menu,
  LayoutDashboard,
  Users,
  Package,
  IndianRupee,
  FileText,
  Boxes,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import axios from "axios";
import API_URL from "../config/api";

function Layout() {
  const [companyName, setCompanyName] = useState("...");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // getMe ab companyName bhi return karta hai
        setCompanyName(res.data.companyName || res.data.name || "User");
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r shadow-lg transition-all duration-300`}
      >

        <div className="h-16 px-5 border-b flex items-center">

          <div className="flex items-center justify-between w-full">

            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold text-blue-600">
                  RateFlow
                </h1>

                <p className="text-xs text-gray-500">
                  Business ERP
                </p>
              </div>
            )}
            

            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            

          </div>

        </div>

        <nav className="p-4 space-y-2">
          <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center ${
              sidebarOpen ? "justify-start" : "justify-center"
            } gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-blue-600 text-white font-semibold"
                : "hover:bg-blue-50"
            }`
          }
        >
          <LayoutDashboard size={20} />

          {sidebarOpen && (
            <span>
              Dashboard
            </span>
          )}
        </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            <Users size={20} />

            {sidebarOpen && (
              <span>
                Customers
              </span>
            )}
          </NavLink>

          <NavLink 
            to="/products"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <Package size={20} />

            {sidebarOpen && (
              <span>Products</span>
            )
            }

          </NavLink>

          <NavLink 
            to="/pricing"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <IndianRupee size={20} />

            {sidebarOpen && (
              <span>Pricing</span>
            )
            }

          </NavLink>

          <NavLink 
            to="/invoices"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <FileText size={20} />

            {sidebarOpen && (
              <span>Create Invoice</span>
            )
            }

          </NavLink>
          

          <NavLink 
            to="/all-invoices"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <FileText size={20} />

            {sidebarOpen && (
              <span>Invoices</span>
            )
            }

          </NavLink>

          <NavLink 
            to="/payments"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <IndianRupee size={20} />

            {sidebarOpen && (
              <span>Payments</span>
            )}
          </NavLink>

          <NavLink 
            to="/stock"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <Boxes size={20} />

            {sidebarOpen && (
              <span>Stock</span>
            )
            }

          </NavLink>

          <NavLink 
            to="/vendors"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <Users size={20} />

            {sidebarOpen && (
              <span>Vendors</span>
            )}
          </NavLink>

          <NavLink 
            to="/purchases"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <FileText size={20} />

            {sidebarOpen && (
              <span>Purchases</span>
            )}
          </NavLink>

          <NavLink 
            to="/vendor-payments"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <IndianRupee size={20} />

            {sidebarOpen && (
              <span>Vendor Payments</span>
            )}
          </NavLink>

          <NavLink 
            to="/purchase-reports"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <FileText size={20} />

            {sidebarOpen && (
              <span>Purchase Reports</span>
            )}
          </NavLink>

          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `flex items-center ${
                sidebarOpen ? "justify-start" : "justify-center"
              } gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-50"
              }`
          }>
            <Settings size={20} />

            {sidebarOpen && (
              <span>Settings</span>
            )
            }

          </NavLink>

          
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1">

        {/* Navbar */}
        <header className="h-16 bg-white border-b px-8 flex justify-between items-center">
          <h2 className="font-semibold text-xl">RateFlow ERP</h2>

          <div className="flex items-center gap-4">
            <button className="text-xl"><Bell size={20} /></button>
            {/* 🔔 */}
            {/* ✅ Dynamic companyName from Tenant */}
            <div className="font-medium">👤 {companyName}</div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              <LogOut size={20} /> Logout
              {/* 🚪 */}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default Layout;