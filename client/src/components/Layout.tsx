import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <aside className="w-64 bg-white border-r shadow-lg">

        <div className="p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              RateFlow
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Business ERP
            </p>
          </div>
        </div>

        <nav className="p-4 space-y-2">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            👥 Customers
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            📦 Products
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            💰 Pricing
          </NavLink>

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            📄 Create Invoice
          </NavLink>

          <NavLink
            to="/all-invoices"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            📄 All Invoices
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50"
              }`
            }
          >
            ⚙️ Settings
          </NavLink>

        </nav>
      </aside>

      {/* Main Area */}

      <div className="flex-1">

        {/* Navbar */}

        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">

          <h2 className="font-semibold text-xl">
            RateFlow ERP
          </h2>

          <div className="flex items-center gap-4">

          <button className="text-xl">
            🔔
          </button>

          <div className="font-medium">
            👤 Shivam
          </div>

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