import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import PricingPlayground from "./pages/PricingPlayground";
import CreateInvoice from "./pages/CreateInvoice";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import Stock from "./pages/Stock";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/pricing"
            element={<PricingPlayground />}
          />

          <Route
            path="/invoices"
            element={<CreateInvoice />}
          />

          <Route
            path="/all-invoices"
            element={<Invoices />}
          />

          <Route
            path="/invoice/:id"
            element={<InvoiceDetails />}
          />
          <Route path="/stock" element={<Stock />} />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
