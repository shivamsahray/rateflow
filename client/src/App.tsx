import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { lazy, Suspense } from "react";

// import Login        from "./pages/Login";
// import Register     from "./pages/Register";
// import Dashboard    from "./pages/Dashboard";
// import Customers    from "./pages/Customers";
// import Products     from "./pages/Products";
// import PricingPlayground from "./pages/PricingPlayground";
// import CreateInvoice from "./pages/CreateInvoice";
// import Invoices     from "./pages/Invoices";
// import InvoiceDetails from "./pages/InvoiceDetails";
// import Settings     from "./pages/Settings";
// import Layout       from "./components/Layout";
// import Stock        from "./pages/Stock";
// import CustomerLedger from "./pages/CustomerLedger";
// import AdminPanel   from "./pages/AdminPanel";            // ✅ NEW
// import SubscriptionExpired from "./pages/SubscriptionExpired"; // ✅ NEW
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const Products = lazy(() => import("./pages/Products"));
const PricingPlayground = lazy(() => import("./pages/PricingPlayground"));
const CreateInvoice = lazy(() => import("./pages/CreateInvoice"));
const Invoices = lazy(() => import("./pages/Invoices"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails"));
const Settings = lazy(() => import("./pages/Settings"));
const Layout = lazy(() => import("./components/Layout"));
const Stock = lazy(() => import("./pages/Stock"));
const CustomerLedger = lazy(() => import("./pages/CustomerLedger"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const SubscriptionExpired = lazy(() => import("./pages/SubscriptionExpired"));
const Vendors = lazy(() => import("./pages/Vendors"));
const CreatePurchase = lazy(() => import("./pages/CreatePurchase"));
const Purchases = lazy(() => import("./pages/Purchases"));
const VendorPayments = lazy(() => import("./pages/VendorPayments"));
const PurchaseReports = lazy(() => import("./pages/PurchaseReports"));
const Payments = lazy(() => import("./pages/Payments"));

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* Public routes */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Admin panel — alag route, Layout nahi */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* ✅ Subscription expired screen */}
        <Route path="/subscription-expired" element={<SubscriptionExpired />} />

        {/* App routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard"                         element={<Dashboard />} />
          <Route path="/customers"                         element={<Customers />} />
          <Route path="/products"                          element={<Products />} />
          <Route path="/pricing"                           element={<PricingPlayground />} />
          <Route path="/invoices"                          element={<CreateInvoice />} />
          <Route path="/all-invoices"                      element={<Invoices />} />
          <Route path="/payments"                          element={<Payments />} />
          <Route path="/invoice/:id"                       element={<InvoiceDetails />} />
          <Route path="/stock"                             element={<Stock />} />
          <Route path="/vendors"                           element={<Vendors />} />
          <Route path="/purchases"                         element={<Purchases />} />
          <Route path="/create-purchase"                   element={<CreatePurchase />} />
          <Route path="/vendor-payments"                   element={<VendorPayments />} />
          <Route path="/purchase-reports"                  element={<PurchaseReports />} />
          <Route path="/settings"                          element={<Settings />} />
          <Route path="/customers/:customerId/ledger"      element={<CustomerLedger />} />
        </Route>

      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;


// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Customers from "./pages/Customers";
// import Products from "./pages/Products";
// import PricingPlayground from "./pages/PricingPlayground";
// import CreateInvoice from "./pages/CreateInvoice";
// import Invoices from "./pages/Invoices";
// import InvoiceDetails from "./pages/InvoiceDetails";
// import Settings from "./pages/Settings";
// import Layout from "./components/Layout";
// import Stock from "./pages/Stock";
// import CustomerLedger from "./pages/CustomerLedger";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={<Login />}
//         />

//         <Route
//           path="/register"
//           element={<Register />}
//         />

//         <Route element={<Layout />}>

//           <Route
//             path="/dashboard"
//             element={<Dashboard />}
//           />

//           <Route
//             path="/customers"
//             element={<Customers />}
//           />

//           <Route
//             path="/products"
//             element={<Products />}
//           />

//           <Route
//             path="/pricing"
//             element={<PricingPlayground />}
//           />

//           <Route
//             path="/invoices"
//             element={<CreateInvoice />}
//           />

//           <Route
//             path="/all-invoices"
//             element={<Invoices />}
//           />

//           <Route
//             path="/invoice/:id"
//             element={<InvoiceDetails />}
//           />
//           <Route path="/stock" element={<Stock />} />

//           <Route
//             path="/settings"
//             element={<Settings />}
//           />
//           <Route path="/customers/:customerId/ledger" element={<CustomerLedger />} />

//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
