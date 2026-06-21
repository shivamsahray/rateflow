// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import api from "../services/api";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface LedgerEntry {
//   date: string;
//   type: "invoice" | "payment";
//   description: string;
//   invoiceNumber?: string;
//   invoiceId?: string;
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface Summary {
//   totalInvoiced: number;
//   totalPaid: number;
//   totalDiscount: number;
//   outstanding: number;
//   invoiceCount: number;
//   paymentCount: number;
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   email: string;
//   gstNumber: string;
//   address: string;
//   creditLimit: number;
//   outstandingAmount: number;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function CustomerLedger() {
//   const { customerId } = useParams<{ customerId: string }>();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [entries, setEntries]   = useState<LedgerEntry[]>([]);
//   const [summary, setSummary]   = useState<Summary | null>(null);
//   const [loading, setLoading]   = useState(true);

//   // Date filter
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate]     = useState("");

//   useEffect(() => {
//     if (!customerId) return;
//     fetchLedger();
//   }, [customerId]);

//   const fetchLedger = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/ledger/${customerId}`);
//       setCustomer(res.data.customer);
//       setEntries(res.data.entries);
//       setSummary(res.data.summary);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Filtered entries based on date range ─────────────────────────────────
//   const filteredEntries = entries.filter((e) => {
//     const d = new Date(e.date);
//     if (fromDate && d < new Date(fromDate)) return false;
//     if (toDate   && d > new Date(toDate + "T23:59:59")) return false;
//     return true;
//   });

//   // Recalculate running balance for filtered view
//   let runningBal = 0;
//   const displayEntries = filteredEntries.map((e) => {
//     runningBal += e.debit - e.credit;
//     return { ...e, balance: runningBal };
//   });

//   const fmt = (n: number) =>
//     "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const fmtDate = (d: string) =>
//     new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-slate-500 text-sm">Loading ledger...</div>
//       </div>
//     );
//   }

//   if (!customer || !summary) {
//     return (
//       <div className="p-8 text-center text-red-500">Customer not found.</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* ── Page Header ── */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/customers")}
//               className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Customers
//             </button>
//             <span className="text-slate-300">/</span>
//             <div>
//               <h1 className="text-xl font-semibold text-slate-800">{customer.name}</h1>
//               <p className="text-sm text-slate-500 mt-0.5">Customer Ledger</p>
//             </div>
//           </div>

//           {/* Print button */}
//           <button
//             onClick={() => window.print()}
//             className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             Print
//           </button>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

//         {/* ── Customer Info + Summary Cards ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Customer Info */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                 <span className="text-base font-bold text-blue-600">
//                   {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <p className="font-semibold text-slate-800">{customer.name}</p>
//                 <p className="text-xs text-slate-400">{customer.phone || "—"}</p>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm">
//               {customer.gstNumber && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">GSTIN</span>
//                   <span className="font-medium text-slate-700">{customer.gstNumber}</span>
//                 </div>
//               )}
//               {customer.email && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Email</span>
//                   <span className="font-medium text-slate-700">{customer.email}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Credit Limit</span>
//                 <span className="font-medium text-slate-700">{fmt(customer.creditLimit || 0)}</span>
//               </div>
//               {customer.address && (
//                 <div className="flex justify-between gap-4">
//                   <span className="text-slate-500 shrink-0">Address</span>
//                   <span className="font-medium text-slate-700 text-right">{customer.address}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Summary Cards */}
//           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">

//             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Invoiced</p>
//               <p className="text-lg font-bold text-slate-800">{fmt(summary.totalInvoiced)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.invoiceCount} invoices</p>
//             </div>

//             <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Received</p>
//               <p className="text-lg font-bold text-green-600">{fmt(summary.totalPaid)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.paymentCount} payments</p>
//             </div>

//             {summary.totalDiscount > 0 && (
//               <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5 text-center">
//                 <p className="text-xs text-slate-500 mb-1">Total Discount</p>
//                 <p className="text-lg font-bold text-orange-500">{fmt(summary.totalDiscount)}</p>
//                 <p className="text-xs text-slate-400 mt-1">Given</p>
//               </div>
//             )}

//             <div className={`rounded-xl border shadow-sm p-5 text-center ${
//               summary.outstanding > 0
//                 ? "bg-red-50 border-red-200"
//                 : "bg-green-50 border-green-200"
//             }`}>
//               <p className="text-xs text-slate-500 mb-1">Outstanding</p>
//               <p className={`text-lg font-bold ${
//                 summary.outstanding > 0 ? "text-red-600" : "text-green-600"
//               }`}>
//                 {fmt(Math.abs(summary.outstanding))}
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 {summary.outstanding > 0 ? "Pending" : summary.outstanding < 0 ? "Overpaid" : "Settled"}
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* ── Date Filter ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <span className="text-sm font-medium text-slate-600">Filter by date:</span>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">From</label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">To</label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             {(fromDate || toDate) && (
//               <button
//                 onClick={() => { setFromDate(""); setToDate(""); }}
//                 className="text-xs text-slate-400 hover:text-red-500 transition-colors"
//               >
//                 Clear
//               </button>
//             )}
//             <span className="ml-auto text-xs text-slate-400">
//               {displayEntries.length} entries
//             </span>
//           </div>
//         </div>

//         {/* ── Ledger Table ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//               Statement of Account
//             </h2>
//             {(fromDate || toDate) && (
//               <span className="text-xs text-slate-400">
//                 {fromDate && fmtDate(fromDate)} {fromDate && toDate && "—"} {toDate && fmtDate(toDate)}
//               </span>
//             )}
//           </div>

//           {displayEntries.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <p className="text-slate-400 text-sm">No transactions found for this period.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
//                     <th className="px-6 py-3 text-left font-medium">Date</th>
//                     <th className="px-6 py-3 text-left font-medium">Description</th>
//                     <th className="px-6 py-3 text-right font-medium">Debit (Dr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Credit (Cr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">

//                   {/* Opening Balance row */}
//                   <tr className="bg-slate-50">
//                     <td className="px-6 py-3 text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-xs font-medium text-slate-500">Opening Balance</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs font-semibold text-slate-600">₹0.00</td>
//                   </tr>

//                   {displayEntries.map((entry, idx) => (
//                     <tr
//                       key={idx}
//                       className={`hover:bg-slate-50 transition-colors ${
//                         entry.type === "payment" ? "bg-green-50/30" : ""
//                       }`}
//                     >
//                       <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
//                         {fmtDate(entry.date)}
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           {/* Type badge */}
//                           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                             entry.type === "invoice"
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-green-50 text-green-600"
//                           }`}>
//                             {entry.type === "invoice" ? "Invoice" : "Payment"}
//                           </span>

//                           {/* Description — clickable if has invoiceId */}
//                           {entry.invoiceId ? (
//                             <Link
//                               to={`/invoice/${entry.invoiceId}`}
//                               className="text-slate-700 hover:text-blue-600 hover:underline transition-colors"
//                             >
//                               {entry.description}
//                             </Link>
//                           ) : (
//                             <span className="text-slate-700">{entry.description}</span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Debit — red, invoice only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.debit > 0 ? (
//                           <span className="text-red-600">{fmt(entry.debit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Credit — green, payment only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.credit > 0 ? (
//                           <span className="text-green-600">{fmt(entry.credit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Running Balance */}
//                       <td className="px-6 py-4 text-right font-semibold">
//                         <span className={entry.balance > 0 ? "text-red-600" : entry.balance < 0 ? "text-green-600" : "text-slate-500"}>
//                           {fmt(Math.abs(entry.balance))}
//                           {entry.balance > 0 && <span className="text-xs font-normal ml-1 text-red-400">Dr</span>}
//                           {entry.balance < 0 && <span className="text-xs font-normal ml-1 text-green-400">Cr</span>}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}

//                 </tbody>

//                 {/* Closing Balance footer */}
//                 <tfoot>
//                   <tr className="bg-slate-900 text-white">
//                     <td className="px-6 py-4 text-xs font-medium" colSpan={2}>
//                       Closing Balance
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-red-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.debit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-green-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.credit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold">
//                       {(() => {
//                         const bal = displayEntries.length > 0
//                           ? displayEntries[displayEntries.length - 1].balance
//                           : 0;
//                         return (
//                           <span className={bal > 0 ? "text-red-300" : bal < 0 ? "text-green-300" : "text-white"}>
//                             {fmt(Math.abs(bal))}
//                             {bal > 0 && " Dr"}
//                             {bal < 0 && " Cr"}
//                             {bal === 0 && " Nil"}
//                           </span>
//                         );
//                       })()}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


//-------
// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import api from "../services/api";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface LedgerEntry {
//   date: string;
//   type: "invoice" | "payment";
//   description: string;
//   invoiceNumber?: string;
//   invoiceId?: string;
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface Summary {
//   totalInvoiced: number;
//   totalPaid: number;
//   totalDiscount: number;
//   outstanding: number;
//   invoiceCount: number;
//   paymentCount: number;
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   email: string;
//   gstNumber: string;
//   address: string;
//   creditLimit: number;
//   outstandingAmount: number;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function CustomerLedger() {
//   const { customerId } = useParams<{ customerId: string }>();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [entries, setEntries]   = useState<LedgerEntry[]>([]);
//   const [summary, setSummary]   = useState<Summary | null>(null);
//   const [loading, setLoading]   = useState(true);

//   // Date filter
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate]     = useState("");

//   // WhatsApp
//   const [waSending, setWaSending] = useState(false);
//   const [waResult, setWaResult]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

//   useEffect(() => {
//     if (!customerId) return;
//     fetchLedger();
//   }, [customerId]);

//   const fetchLedger = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/ledger/${customerId}`);
//       setCustomer(res.data.customer);
//       setEntries(res.data.entries);
//       setSummary(res.data.summary);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Filtered entries based on date range ─────────────────────────────────
//   const filteredEntries = entries.filter((e) => {
//     const d = new Date(e.date);
//     if (fromDate && d < new Date(fromDate)) return false;
//     if (toDate   && d > new Date(toDate + "T23:59:59")) return false;
//     return true;
//   });

//   // Recalculate running balance for filtered view
//   let runningBal = 0;
//   const displayEntries = filteredEntries.map((e) => {
//     runningBal += e.debit - e.credit;
//     return { ...e, balance: runningBal };
//   });

//   const fmt = (n: number) =>
//     "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const fmtDate = (d: string) =>
//     new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });

//   const sendLedgerWhatsApp = async () => {
//     if (!customerId) return;
//     setWaSending(true);
//     setWaResult(null);
    
//     try {
//       await api.post(`/settings/whatsapp/send-ledger/${customerId}`);
//       setWaResult({ type: "success", msg: "Message sent successfully on WhatsApp!" });
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || "Failed to send WhatsApp message";
//       setWaResult({ type: "error", msg });
//     } finally {
//       setWaSending(false);
//       setTimeout(() => setWaResult(null), 4000);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-slate-500 text-sm">Loading ledger...</div>
//       </div>
//     );
//   }

//   if (!customer || !summary) {
//     return (
//       <div className="p-8 text-center text-red-500">Customer not found.</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* ── Page Header ── */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/customers")}
//               className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Customers
//             </button>
//             <span className="text-slate-300">/</span>
//             <div>
//               <h1 className="text-xl font-semibold text-slate-800">{customer.name}</h1>
//               <p className="text-sm text-slate-500 mt-0.5">Customer Ledger</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">

//             {/* WhatsApp Send Button */}
//             {summary && summary.outstanding > 0 && (
//               <button
//                 onClick={sendLedgerWhatsApp}
//                 disabled={waSending}
//                 className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
//                   waSending
//                     ? "bg-green-100 text-green-400 cursor-not-allowed"
//                     : "bg-green-500 hover:bg-green-600 text-white shadow-sm"
//                 }`}
//                 title="Send outstanding reminder on WhatsApp"
//               >
//                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//                 </svg>
//                 {waSending ? "Sending..." : "Send WhatsApp"}
//               </button>
//             )}

//             {/* Print button */}
//             <button
//               onClick={() => window.print()}
//               className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//               </svg>
//               Print
//             </button>

//           </div>

//           {/* WA Result Toast */}
//           {waResult && (
//             <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
//               waResult.type === "success"
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}>
//               {waResult.type === "success" ? "✅" : "❌"} {waResult.msg}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

//         {/* ── Customer Info + Summary Cards ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Customer Info */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                 <span className="text-base font-bold text-blue-600">
//                   {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <p className="font-semibold text-slate-800">{customer.name}</p>
//                 <p className="text-xs text-slate-400">{customer.phone || "—"}</p>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm">
//               {customer.gstNumber && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">GSTIN</span>
//                   <span className="font-medium text-slate-700">{customer.gstNumber}</span>
//                 </div>
//               )}
//               {customer.email && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Email</span>
//                   <span className="font-medium text-slate-700">{customer.email}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Credit Limit</span>
//                 <span className="font-medium text-slate-700">{fmt(customer.creditLimit || 0)}</span>
//               </div>
//               {customer.address && (
//                 <div className="flex justify-between gap-4">
//                   <span className="text-slate-500 shrink-0">Address</span>
//                   <span className="font-medium text-slate-700 text-right">{customer.address}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Summary Cards */}
//           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">

//             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Invoiced</p>
//               <p className="text-lg font-bold text-slate-800">{fmt(summary.totalInvoiced)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.invoiceCount} invoices</p>
//             </div>

//             <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Received</p>
//               <p className="text-lg font-bold text-green-600">{fmt(summary.totalPaid)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.paymentCount} payments</p>
//             </div>

//             {summary.totalDiscount > 0 && (
//               <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5 text-center">
//                 <p className="text-xs text-slate-500 mb-1">Total Discount</p>
//                 <p className="text-lg font-bold text-orange-500">{fmt(summary.totalDiscount)}</p>
//                 <p className="text-xs text-slate-400 mt-1">Given</p>
//               </div>
//             )}

//             <div className={`rounded-xl border shadow-sm p-5 text-center ${
//               summary.outstanding > 0
//                 ? "bg-red-50 border-red-200"
//                 : "bg-green-50 border-green-200"
//             }`}>
//               <p className="text-xs text-slate-500 mb-1">Outstanding</p>
//               <p className={`text-lg font-bold ${
//                 summary.outstanding > 0 ? "text-red-600" : "text-green-600"
//               }`}>
//                 {fmt(Math.abs(summary.outstanding))}
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 {summary.outstanding > 0 ? "Pending" : summary.outstanding < 0 ? "Overpaid" : "Settled"}
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* ── Date Filter ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <span className="text-sm font-medium text-slate-600">Filter by date:</span>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">From</label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">To</label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             {(fromDate || toDate) && (
//               <button
//                 onClick={() => { setFromDate(""); setToDate(""); }}
//                 className="text-xs text-slate-400 hover:text-red-500 transition-colors"
//               >
//                 Clear
//               </button>
//             )}
//             <span className="ml-auto text-xs text-slate-400">
//               {displayEntries.length} entries
//             </span>
//           </div>
//         </div>

//         {/* ── Ledger Table ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//               Statement of Account
//             </h2>
//             {(fromDate || toDate) && (
//               <span className="text-xs text-slate-400">
//                 {fromDate && fmtDate(fromDate)} {fromDate && toDate && "—"} {toDate && fmtDate(toDate)}
//               </span>
//             )}
//           </div>

//           {displayEntries.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <p className="text-slate-400 text-sm">No transactions found for this period.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
//                     <th className="px-6 py-3 text-left font-medium">Date</th>
//                     <th className="px-6 py-3 text-left font-medium">Description</th>
//                     <th className="px-6 py-3 text-right font-medium">Debit (Dr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Credit (Cr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">

//                   {/* Opening Balance row */}
//                   <tr className="bg-slate-50">
//                     <td className="px-6 py-3 text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-xs font-medium text-slate-500">Opening Balance</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs font-semibold text-slate-600">₹0.00</td>
//                   </tr>

//                   {displayEntries.map((entry, idx) => (
//                     <tr
//                       key={idx}
//                       className={`hover:bg-slate-50 transition-colors ${
//                         entry.type === "payment" ? "bg-green-50/30" : ""
//                       }`}
//                     >
//                       <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
//                         {fmtDate(entry.date)}
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           {/* Type badge */}
//                           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                             entry.type === "invoice"
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-green-50 text-green-600"
//                           }`}>
//                             {entry.type === "invoice" ? "Invoice" : "Payment"}
//                           </span>

//                           {/* Description — clickable if has invoiceId */}
//                           {entry.invoiceId ? (
//                             <Link
//                               to={`/invoice/${entry.invoiceId}`}
//                               className="text-slate-700 hover:text-blue-600 hover:underline transition-colors"
//                             >
//                               {entry.description}
//                             </Link>
//                           ) : (
//                             <span className="text-slate-700">{entry.description}</span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Debit — red, invoice only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.debit > 0 ? (
//                           <span className="text-red-600">{fmt(entry.debit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Credit — green, payment only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.credit > 0 ? (
//                           <span className="text-green-600">{fmt(entry.credit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Running Balance */}
//                       <td className="px-6 py-4 text-right font-semibold">
//                         <span className={entry.balance > 0 ? "text-red-600" : entry.balance < 0 ? "text-green-600" : "text-slate-500"}>
//                           {fmt(Math.abs(entry.balance))}
//                           {entry.balance > 0 && <span className="text-xs font-normal ml-1 text-red-400">Dr</span>}
//                           {entry.balance < 0 && <span className="text-xs font-normal ml-1 text-green-400">Cr</span>}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}

//                 </tbody>

//                 {/* Closing Balance footer */}
//                 <tfoot>
//                   <tr className="bg-slate-900 text-white">
//                     <td className="px-6 py-4 text-xs font-medium" colSpan={2}>
//                       Closing Balance
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-red-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.debit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-green-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.credit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold">
//                       {(() => {
//                         const bal = displayEntries.length > 0
//                           ? displayEntries[displayEntries.length - 1].balance
//                           : 0;
//                         return (
//                           <span className={bal > 0 ? "text-red-300" : bal < 0 ? "text-green-300" : "text-white"}>
//                             {fmt(Math.abs(bal))}
//                             {bal > 0 && " Dr"}
//                             {bal < 0 && " Cr"}
//                             {bal === 0 && " Nil"}
//                           </span>
//                         );
//                       })()}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import api from "../services/api";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface LedgerEntry {
//   date: string;
//   type: "invoice" | "payment";
//   description: string;
//   invoiceNumber?: string;
//   invoiceId?: string;
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface Summary {
//   totalInvoiced: number;
//   totalPaid: number;
//   totalDiscount: number;
//   outstanding: number;
//   invoiceCount: number;
//   paymentCount: number;
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   email: string;
//   gstNumber: string;
//   address: string;
//   creditLimit: number;
//   outstandingAmount: number;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function CustomerLedger() {
//   const { customerId } = useParams<{ customerId: string }>();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [entries, setEntries]   = useState<LedgerEntry[]>([]);
//   const [summary, setSummary]   = useState<Summary | null>(null);
//   const [loading, setLoading]   = useState(true);

//   // Date filter
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate]     = useState("");

//   useEffect(() => {
//     if (!customerId) return;
//     fetchLedger();
//   }, [customerId]);

//   const fetchLedger = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/ledger/${customerId}`);
//       setCustomer(res.data.customer);
//       setEntries(res.data.entries);
//       setSummary(res.data.summary);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Filtered entries based on date range ─────────────────────────────────
//   const filteredEntries = entries.filter((e) => {
//     const d = new Date(e.date);
//     if (fromDate && d < new Date(fromDate)) return false;
//     if (toDate   && d > new Date(toDate + "T23:59:59")) return false;
//     return true;
//   });

//   // Recalculate running balance for filtered view
//   let runningBal = 0;
//   const displayEntries = filteredEntries.map((e) => {
//     runningBal += e.debit - e.credit;
//     return { ...e, balance: runningBal };
//   });

//   const fmt = (n: number) =>
//     "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const fmtDate = (d: string) =>
//     new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-slate-500 text-sm">Loading ledger...</div>
//       </div>
//     );
//   }

//   if (!customer || !summary) {
//     return (
//       <div className="p-8 text-center text-red-500">Customer not found.</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* ── Page Header ── */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/customers")}
//               className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Customers
//             </button>
//             <span className="text-slate-300">/</span>
//             <div>
//               <h1 className="text-xl font-semibold text-slate-800">{customer.name}</h1>
//               <p className="text-sm text-slate-500 mt-0.5">Customer Ledger</p>
//             </div>
//           </div>

//           {/* Print button */}
//           <button
//             onClick={() => window.print()}
//             className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             Print
//           </button>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

//         {/* ── Customer Info + Summary Cards ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Customer Info */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                 <span className="text-base font-bold text-blue-600">
//                   {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <p className="font-semibold text-slate-800">{customer.name}</p>
//                 <p className="text-xs text-slate-400">{customer.phone || "—"}</p>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm">
//               {customer.gstNumber && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">GSTIN</span>
//                   <span className="font-medium text-slate-700">{customer.gstNumber}</span>
//                 </div>
//               )}
//               {customer.email && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Email</span>
//                   <span className="font-medium text-slate-700">{customer.email}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Credit Limit</span>
//                 <span className="font-medium text-slate-700">{fmt(customer.creditLimit || 0)}</span>
//               </div>
//               {customer.address && (
//                 <div className="flex justify-between gap-4">
//                   <span className="text-slate-500 shrink-0">Address</span>
//                   <span className="font-medium text-slate-700 text-right">{customer.address}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Summary Cards */}
//           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">

//             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Invoiced</p>
//               <p className="text-lg font-bold text-slate-800">{fmt(summary.totalInvoiced)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.invoiceCount} invoices</p>
//             </div>

//             <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Received</p>
//               <p className="text-lg font-bold text-green-600">{fmt(summary.totalPaid)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.paymentCount} payments</p>
//             </div>

//             {summary.totalDiscount > 0 && (
//               <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5 text-center">
//                 <p className="text-xs text-slate-500 mb-1">Total Discount</p>
//                 <p className="text-lg font-bold text-orange-500">{fmt(summary.totalDiscount)}</p>
//                 <p className="text-xs text-slate-400 mt-1">Given</p>
//               </div>
//             )}

//             <div className={`rounded-xl border shadow-sm p-5 text-center ${
//               summary.outstanding > 0
//                 ? "bg-red-50 border-red-200"
//                 : "bg-green-50 border-green-200"
//             }`}>
//               <p className="text-xs text-slate-500 mb-1">Outstanding</p>
//               <p className={`text-lg font-bold ${
//                 summary.outstanding > 0 ? "text-red-600" : "text-green-600"
//               }`}>
//                 {fmt(Math.abs(summary.outstanding))}
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 {summary.outstanding > 0 ? "Pending" : summary.outstanding < 0 ? "Overpaid" : "Settled"}
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* ── Date Filter ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <span className="text-sm font-medium text-slate-600">Filter by date:</span>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">From</label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">To</label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             {(fromDate || toDate) && (
//               <button
//                 onClick={() => { setFromDate(""); setToDate(""); }}
//                 className="text-xs text-slate-400 hover:text-red-500 transition-colors"
//               >
//                 Clear
//               </button>
//             )}
//             <span className="ml-auto text-xs text-slate-400">
//               {displayEntries.length} entries
//             </span>
//           </div>
//         </div>

//         {/* ── Ledger Table ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//               Statement of Account
//             </h2>
//             {(fromDate || toDate) && (
//               <span className="text-xs text-slate-400">
//                 {fromDate && fmtDate(fromDate)} {fromDate && toDate && "—"} {toDate && fmtDate(toDate)}
//               </span>
//             )}
//           </div>

//           {displayEntries.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <p className="text-slate-400 text-sm">No transactions found for this period.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
//                     <th className="px-6 py-3 text-left font-medium">Date</th>
//                     <th className="px-6 py-3 text-left font-medium">Description</th>
//                     <th className="px-6 py-3 text-right font-medium">Debit (Dr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Credit (Cr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">

//                   {/* Opening Balance row */}
//                   <tr className="bg-slate-50">
//                     <td className="px-6 py-3 text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-xs font-medium text-slate-500">Opening Balance</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs font-semibold text-slate-600">₹0.00</td>
//                   </tr>

//                   {displayEntries.map((entry, idx) => (
//                     <tr
//                       key={idx}
//                       className={`hover:bg-slate-50 transition-colors ${
//                         entry.type === "payment" ? "bg-green-50/30" : ""
//                       }`}
//                     >
//                       <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
//                         {fmtDate(entry.date)}
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           {/* Type badge */}
//                           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                             entry.type === "invoice"
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-green-50 text-green-600"
//                           }`}>
//                             {entry.type === "invoice" ? "Invoice" : "Payment"}
//                           </span>

//                           {/* Description — clickable if has invoiceId */}
//                           {entry.invoiceId ? (
//                             <Link
//                               to={`/invoice/${entry.invoiceId}`}
//                               className="text-slate-700 hover:text-blue-600 hover:underline transition-colors"
//                             >
//                               {entry.description}
//                             </Link>
//                           ) : (
//                             <span className="text-slate-700">{entry.description}</span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Debit — red, invoice only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.debit > 0 ? (
//                           <span className="text-red-600">{fmt(entry.debit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Credit — green, payment only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.credit > 0 ? (
//                           <span className="text-green-600">{fmt(entry.credit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Running Balance */}
//                       <td className="px-6 py-4 text-right font-semibold">
//                         <span className={entry.balance > 0 ? "text-red-600" : entry.balance < 0 ? "text-green-600" : "text-slate-500"}>
//                           {fmt(Math.abs(entry.balance))}
//                           {entry.balance > 0 && <span className="text-xs font-normal ml-1 text-red-400">Dr</span>}
//                           {entry.balance < 0 && <span className="text-xs font-normal ml-1 text-green-400">Cr</span>}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}

//                 </tbody>

//                 {/* Closing Balance footer */}
//                 <tfoot>
//                   <tr className="bg-slate-900 text-white">
//                     <td className="px-6 py-4 text-xs font-medium" colSpan={2}>
//                       Closing Balance
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-red-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.debit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-green-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.credit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold">
//                       {(() => {
//                         const bal = displayEntries.length > 0
//                           ? displayEntries[displayEntries.length - 1].balance
//                           : 0;
//                         return (
//                           <span className={bal > 0 ? "text-red-300" : bal < 0 ? "text-green-300" : "text-white"}>
//                             {fmt(Math.abs(bal))}
//                             {bal > 0 && " Dr"}
//                             {bal < 0 && " Cr"}
//                             {bal === 0 && " Nil"}
//                           </span>
//                         );
//                       })()}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


//-------
// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import api from "../services/api";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface LedgerEntry {
//   date: string;
//   type: "invoice" | "payment";
//   description: string;
//   invoiceNumber?: string;
//   invoiceId?: string;
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface Summary {
//   totalInvoiced: number;
//   totalPaid: number;
//   totalDiscount: number;
//   outstanding: number;
//   invoiceCount: number;
//   paymentCount: number;
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   email: string;
//   gstNumber: string;
//   address: string;
//   creditLimit: number;
//   outstandingAmount: number;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function CustomerLedger() {
//   const { customerId } = useParams<{ customerId: string }>();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [entries, setEntries]   = useState<LedgerEntry[]>([]);
//   const [summary, setSummary]   = useState<Summary | null>(null);
//   const [loading, setLoading]   = useState(true);

//   // Date filter
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate]     = useState("");

//   // WhatsApp
//   const [waSending, setWaSending] = useState(false);
//   const [waResult, setWaResult]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

//   useEffect(() => {
//     if (!customerId) return;
//     fetchLedger();
//   }, [customerId]);

//   const fetchLedger = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/ledger/${customerId}`);
//       setCustomer(res.data.customer);
//       setEntries(res.data.entries);
//       setSummary(res.data.summary);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Filtered entries based on date range ─────────────────────────────────
//   const filteredEntries = entries.filter((e) => {
//     const d = new Date(e.date);
//     if (fromDate && d < new Date(fromDate)) return false;
//     if (toDate   && d > new Date(toDate + "T23:59:59")) return false;
//     return true;
//   });

//   // Recalculate running balance for filtered view
//   let runningBal = 0;
//   const displayEntries = filteredEntries.map((e) => {
//     runningBal += e.debit - e.credit;
//     return { ...e, balance: runningBal };
//   });

//   const fmt = (n: number) =>
//     "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   const fmtDate = (d: string) =>
//     new Date(d).toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });

//   const sendLedgerWhatsApp = async () => {
//     if (!customerId) return;
//     setWaSending(true);
//     setWaResult(null);
    
//     try {
//       await api.post(`/settings/whatsapp/send-ledger/${customerId}`);
//       setWaResult({ type: "success", msg: "Message sent successfully on WhatsApp!" });
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || "Failed to send WhatsApp message";
//       setWaResult({ type: "error", msg });
//     } finally {
//       setWaSending(false);
//       setTimeout(() => setWaResult(null), 4000);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-slate-500 text-sm">Loading ledger...</div>
//       </div>
//     );
//   }

//   if (!customer || !summary) {
//     return (
//       <div className="p-8 text-center text-red-500">Customer not found.</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* ── Page Header ── */}
//       <div className="bg-white border-b border-slate-200 px-8 py-5">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/customers")}
//               className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Customers
//             </button>
//             <span className="text-slate-300">/</span>
//             <div>
//               <h1 className="text-xl font-semibold text-slate-800">{customer.name}</h1>
//               <p className="text-sm text-slate-500 mt-0.5">Customer Ledger</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">

//             {/* WhatsApp Send Button */}
//             {summary && summary.outstanding > 0 && (
//               <button
//                 onClick={sendLedgerWhatsApp}
//                 disabled={waSending}
//                 className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
//                   waSending
//                     ? "bg-green-100 text-green-400 cursor-not-allowed"
//                     : "bg-green-500 hover:bg-green-600 text-white shadow-sm"
//                 }`}
//                 title="Send outstanding reminder on WhatsApp"
//               >
//                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//                 </svg>
//                 {waSending ? "Sending..." : "Send WhatsApp"}
//               </button>
//             )}

//             {/* Print button */}
//             <button
//               onClick={() => window.print()}
//               className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//               </svg>
//               Print
//             </button>

//           </div>

//           {/* WA Result Toast */}
//           {waResult && (
//             <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
//               waResult.type === "success"
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}>
//               {waResult.type === "success" ? "✅" : "❌"} {waResult.msg}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

//         {/* ── Customer Info + Summary Cards ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Customer Info */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//                 <span className="text-base font-bold text-blue-600">
//                   {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <p className="font-semibold text-slate-800">{customer.name}</p>
//                 <p className="text-xs text-slate-400">{customer.phone || "—"}</p>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm">
//               {customer.gstNumber && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">GSTIN</span>
//                   <span className="font-medium text-slate-700">{customer.gstNumber}</span>
//                 </div>
//               )}
//               {customer.email && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Email</span>
//                   <span className="font-medium text-slate-700">{customer.email}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Credit Limit</span>
//                 <span className="font-medium text-slate-700">{fmt(customer.creditLimit || 0)}</span>
//               </div>
//               {customer.address && (
//                 <div className="flex justify-between gap-4">
//                   <span className="text-slate-500 shrink-0">Address</span>
//                   <span className="font-medium text-slate-700 text-right">{customer.address}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Summary Cards */}
//           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">

//             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Invoiced</p>
//               <p className="text-lg font-bold text-slate-800">{fmt(summary.totalInvoiced)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.invoiceCount} invoices</p>
//             </div>

//             <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5 text-center">
//               <p className="text-xs text-slate-500 mb-1">Total Received</p>
//               <p className="text-lg font-bold text-green-600">{fmt(summary.totalPaid)}</p>
//               <p className="text-xs text-slate-400 mt-1">{summary.paymentCount} payments</p>
//             </div>

//             {summary.totalDiscount > 0 && (
//               <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5 text-center">
//                 <p className="text-xs text-slate-500 mb-1">Total Discount</p>
//                 <p className="text-lg font-bold text-orange-500">{fmt(summary.totalDiscount)}</p>
//                 <p className="text-xs text-slate-400 mt-1">Given</p>
//               </div>
//             )}

//             <div className={`rounded-xl border shadow-sm p-5 text-center ${
//               summary.outstanding > 0
//                 ? "bg-red-50 border-red-200"
//                 : "bg-green-50 border-green-200"
//             }`}>
//               <p className="text-xs text-slate-500 mb-1">Outstanding</p>
//               <p className={`text-lg font-bold ${
//                 summary.outstanding > 0 ? "text-red-600" : "text-green-600"
//               }`}>
//                 {fmt(Math.abs(summary.outstanding))}
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 {summary.outstanding > 0 ? "Pending" : summary.outstanding < 0 ? "Overpaid" : "Settled"}
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* ── Date Filter ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
//           <div className="flex flex-wrap items-center gap-4">
//             <span className="text-sm font-medium text-slate-600">Filter by date:</span>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">From</label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <label className="text-xs text-slate-500">To</label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//             </div>
//             {(fromDate || toDate) && (
//               <button
//                 onClick={() => { setFromDate(""); setToDate(""); }}
//                 className="text-xs text-slate-400 hover:text-red-500 transition-colors"
//               >
//                 Clear
//               </button>
//             )}
//             <span className="ml-auto text-xs text-slate-400">
//               {displayEntries.length} entries
//             </span>
//           </div>
//         </div>

//         {/* ── Ledger Table ── */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
//               Statement of Account
//             </h2>
//             {(fromDate || toDate) && (
//               <span className="text-xs text-slate-400">
//                 {fromDate && fmtDate(fromDate)} {fromDate && toDate && "—"} {toDate && fmtDate(toDate)}
//               </span>
//             )}
//           </div>

//           {displayEntries.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <p className="text-slate-400 text-sm">No transactions found for this period.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
//                     <th className="px-6 py-3 text-left font-medium">Date</th>
//                     <th className="px-6 py-3 text-left font-medium">Description</th>
//                     <th className="px-6 py-3 text-right font-medium">Debit (Dr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Credit (Cr)</th>
//                     <th className="px-6 py-3 text-right font-medium">Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">

//                   {/* Opening Balance row */}
//                   <tr className="bg-slate-50">
//                     <td className="px-6 py-3 text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-xs font-medium text-slate-500">Opening Balance</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
//                     <td className="px-6 py-3 text-right text-xs font-semibold text-slate-600">₹0.00</td>
//                   </tr>

//                   {displayEntries.map((entry, idx) => (
//                     <tr
//                       key={idx}
//                       className={`hover:bg-slate-50 transition-colors ${
//                         entry.type === "payment" ? "bg-green-50/30" : ""
//                       }`}
//                     >
//                       <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
//                         {fmtDate(entry.date)}
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           {/* Type badge */}
//                           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                             entry.type === "invoice"
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-green-50 text-green-600"
//                           }`}>
//                             {entry.type === "invoice" ? "Invoice" : "Payment"}
//                           </span>

//                           {/* Description — clickable if has invoiceId */}
//                           {entry.invoiceId ? (
//                             <Link
//                               to={`/invoice/${entry.invoiceId}`}
//                               className="text-slate-700 hover:text-blue-600 hover:underline transition-colors"
//                             >
//                               {entry.description}
//                             </Link>
//                           ) : (
//                             <span className="text-slate-700">{entry.description}</span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Debit — red, invoice only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.debit > 0 ? (
//                           <span className="text-red-600">{fmt(entry.debit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Credit — green, payment only */}
//                       <td className="px-6 py-4 text-right font-medium">
//                         {entry.credit > 0 ? (
//                           <span className="text-green-600">{fmt(entry.credit)}</span>
//                         ) : (
//                           <span className="text-slate-300">—</span>
//                         )}
//                       </td>

//                       {/* Running Balance */}
//                       <td className="px-6 py-4 text-right font-semibold">
//                         <span className={entry.balance > 0 ? "text-red-600" : entry.balance < 0 ? "text-green-600" : "text-slate-500"}>
//                           {fmt(Math.abs(entry.balance))}
//                           {entry.balance > 0 && <span className="text-xs font-normal ml-1 text-red-400">Dr</span>}
//                           {entry.balance < 0 && <span className="text-xs font-normal ml-1 text-green-400">Cr</span>}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}

//                 </tbody>

//                 {/* Closing Balance footer */}
//                 <tfoot>
//                   <tr className="bg-slate-900 text-white">
//                     <td className="px-6 py-4 text-xs font-medium" colSpan={2}>
//                       Closing Balance
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-red-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.debit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold text-green-300">
//                       {fmt(displayEntries.reduce((s, e) => s + e.credit, 0))}
//                     </td>
//                     <td className="px-6 py-4 text-right font-bold">
//                       {(() => {
//                         const bal = displayEntries.length > 0
//                           ? displayEntries[displayEntries.length - 1].balance
//                           : 0;
//                         return (
//                           <span className={bal > 0 ? "text-red-300" : bal < 0 ? "text-green-300" : "text-white"}>
//                             {fmt(Math.abs(bal))}
//                             {bal > 0 && " Dr"}
//                             {bal < 0 && " Cr"}
//                             {bal === 0 && " Nil"}
//                           </span>
//                         );
//                       })()}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
interface LedgerEntry {
  date: string;
  type: "invoice" | "payment";
  description: string;
  invoiceNumber?: string;
  invoiceId?: string;
  debit: number;
  credit: number;
  balance: number;
}
 
interface Summary {
  openingBalance: number;   // ✅ NEW
  totalInvoiced: number;
  totalPaid: number;
  totalDiscount: number;
  outstanding: number;
  invoiceCount: number;
  paymentCount: number;
}
 
interface Customer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  creditLimit: number;
  outstandingAmount: number;
}
 
// ─── Component ────────────────────────────────────────────────────────────────
 
export default function CustomerLedger() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
 
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [entries, setEntries]   = useState<LedgerEntry[]>([]);
  const [summary, setSummary]   = useState<Summary | null>(null);
  const [loading, setLoading]   = useState(true);
 
  // Date filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
 
  // WhatsApp
  const [waSending, setWaSending] = useState(false);
  const [waResult, setWaResult]   = useState<{ type: "success" | "error"; msg: string } | null>(null);
 
  // Ledger Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount]               = useState("");
  const [payDiscount, setPayDiscount]           = useState("0");
  const [payMode, setPayMode]                   = useState("Cash");
  const [payRef, setPayRef]                     = useState("");
  const [payNotes, setPayNotes]                 = useState("");
  const [payLoading, setPayLoading]             = useState(false);
  const [payResult, setPayResult]               = useState<any>(null);
 
  useEffect(() => {
    if (!customerId) return;
    fetchLedger();
  }, [customerId]);
 
  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ledger/${customerId}`);
      setCustomer(res.data.customer);
      setEntries(res.data.entries);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  // ── Filtered entries based on date range ─────────────────────────────────
  const filteredEntries = entries.filter((e) => {
    const d = new Date(e.date);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate   && d > new Date(toDate + "T23:59:59")) return false;
    return true;
  });
 
  // Recalculate running balance for filtered view
  let runningBal = 0;
  const displayEntries = filteredEntries.map((e) => {
    runningBal += e.debit - e.credit;
    return { ...e, balance: runningBal };
  });
 
  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
 
  // ── Record Payment from Ledger (FIFO) ────────────────────────────────────
  const recordLedgerPayment = async () => {
    if (!customerId || !payAmount) return;
    setPayLoading(true);
    setPayResult(null);
    try {
      const res = await api.post(`/ledger/${customerId}/payment`, {
        amount:          Number(payAmount),
        discount:        Number(payDiscount) || 0,
        paymentMode:     payMode,
        referenceNumber: payRef,
        notes:           payNotes,
      });
      setPayResult(res.data);
      // Refresh ledger after payment
      await fetchLedger();
      // Reset form
      setPayAmount("");
      setPayDiscount("0");
      setPayRef("");
      setPayNotes("");
    } catch (err: any) {
      setPayResult({ error: err?.response?.data?.message || "Payment failed" });
    } finally {
      setPayLoading(false);
    }
  };
 
  const sendLedgerWhatsApp = async () => {
    if (!customerId) return;
    setWaSending(true);
    setWaResult(null);
    
    try {
      await api.post(`/settings/whatsapp/send-ledger/${customerId}`);
      setWaResult({ type: "success", msg: "Message sent successfully on WhatsApp!" });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to send WhatsApp message";
      setWaResult({ type: "error", msg });
    } finally {
      setWaSending(false);
      setTimeout(() => setWaResult(null), 4000);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading ledger...</div>
      </div>
    );
  }
 
  if (!customer || !summary) {
    return (
      <div className="p-8 text-center text-red-500">Customer not found.</div>
    );
  }
 
  return (
    <>
    <div className="min-h-screen bg-slate-50">
 
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/customers")}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Customers
            </button>
            <span className="text-slate-300">/</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">{customer.name}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Customer Ledger</p>
            </div>
          </div>
 
          <div className="flex items-center gap-2">
 
            {/* WhatsApp Send Button */}
            {summary && summary.outstanding > 0 && (
              <button
                onClick={sendLedgerWhatsApp}
                disabled={waSending}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  waSending
                    ? "bg-green-100 text-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                }`}
                title="Send outstanding reminder on WhatsApp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {waSending ? "Sending..." : "Send WhatsApp"}
              </button>
            )}
 
            {/* Record Payment Button */}
            {summary && summary.outstanding > 0 && (
              <button
                onClick={() => { setShowPaymentModal(true); setPayResult(null); }}
                className="flex items-center gap-2 text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Record Payment
              </button>
            )}
 
            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
 
          </div>
 
          {/* WA Result Toast */}
          {waResult && (
            <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              waResult.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}>
              {waResult.type === "success" ? "✅" : "❌"} {waResult.msg}
            </div>
          )}
        </div>
      </div>
 
      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
 
        {/* ── Customer Info + Summary Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base font-bold text-blue-600">
                  {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{customer.name}</p>
                <p className="text-xs text-slate-400">{customer.phone || "—"}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {customer.gstNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN</span>
                  <span className="font-medium text-slate-700">{customer.gstNumber}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-700">{customer.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Credit Limit</span>
                <span className="font-medium text-slate-700">{fmt(customer.creditLimit || 0)}</span>
              </div>
              {customer.address && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Address</span>
                  <span className="font-medium text-slate-700 text-right">{customer.address}</span>
                </div>
              )}
            </div>
          </div>
 
          {/* Summary Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* ✅ NEW: Opening Balance card — only show if non-zero */}
            {summary.openingBalance !== 0 && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 shadow-sm p-5 text-center">
                <p className="text-xs text-slate-500 mb-1">Opening Balance</p>
                <p className="text-lg font-bold text-amber-600">{fmt(summary.openingBalance)}</p>
                <p className="text-xs text-slate-400 mt-1">Brought forward</p>
              </div>
            )}
 
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 mb-1">Total Invoiced</p>
              <p className="text-lg font-bold text-slate-800">{fmt(summary.totalInvoiced)}</p>
              <p className="text-xs text-slate-400 mt-1">{summary.invoiceCount} invoices</p>
            </div>
 
            <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 mb-1">Total Received</p>
              <p className="text-lg font-bold text-green-600">{fmt(summary.totalPaid)}</p>
              <p className="text-xs text-slate-400 mt-1">{summary.paymentCount} payments</p>
            </div>
 
            {summary.totalDiscount > 0 && (
              <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5 text-center">
                <p className="text-xs text-slate-500 mb-1">Total Discount</p>
                <p className="text-lg font-bold text-orange-500">{fmt(summary.totalDiscount)}</p>
                <p className="text-xs text-slate-400 mt-1">Given</p>
              </div>
            )}
 
            <div className={`rounded-xl border shadow-sm p-5 text-center ${
              summary.outstanding > 0
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}>
              <p className="text-xs text-slate-500 mb-1">Outstanding</p>
              <p className={`text-lg font-bold ${
                summary.outstanding > 0 ? "text-red-600" : "text-green-600"
              }`}>
                {fmt(Math.abs(summary.outstanding))}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {summary.outstanding > 0 ? "Pending" : summary.outstanding < 0 ? "Overpaid" : "Settled"}
              </p>
            </div>
 
          </div>
        </div>
 
        {/* ── Date Filter ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Filter by date:</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            {(fromDate || toDate) && (
              <button
                onClick={() => { setFromDate(""); setToDate(""); }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
            <span className="ml-auto text-xs text-slate-400">
              {displayEntries.length} entries
            </span>
          </div>
        </div>
 
        {/* ── Ledger Table ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Statement of Account
            </h2>
            {(fromDate || toDate) && (
              <span className="text-xs text-slate-400">
                {fromDate && fmtDate(fromDate)} {fromDate && toDate && "—"} {toDate && fmtDate(toDate)}
              </span>
            )}
          </div>
 
          {displayEntries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-400 text-sm">No transactions found for this period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-medium">Date</th>
                    <th className="px-6 py-3 text-left font-medium">Description</th>
                    <th className="px-6 py-3 text-right font-medium">Debit (Dr)</th>
                    <th className="px-6 py-3 text-right font-medium">Credit (Cr)</th>
                    <th className="px-6 py-3 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
 
                  {/* Opening Balance row */}
                  <tr className="bg-slate-50">
                    <td className="px-6 py-3 text-xs text-slate-400">—</td>
                    <td className="px-6 py-3 text-xs font-medium text-slate-500">Opening Balance</td>
                    <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
                    <td className="px-6 py-3 text-right text-xs text-slate-400">—</td>
                    <td className="px-6 py-3 text-right text-xs font-semibold text-slate-600">₹0.00</td>
                  </tr>
 
                  {displayEntries.map((entry, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 transition-colors ${
                        entry.type === "payment" ? "bg-green-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                        {fmtDate(entry.date)}
                      </td>
 
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Type badge */}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            entry.type === "invoice"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-green-50 text-green-600"
                          }`}>
                            {entry.type === "invoice" ? "Invoice" : "Payment"}
                          </span>
 
                          {/* Description — clickable if has invoiceId */}
                          {entry.invoiceId ? (
                            <Link
                              to={`/invoice/${entry.invoiceId}`}
                              className="text-slate-700 hover:text-blue-600 hover:underline transition-colors"
                            >
                              {entry.description}
                            </Link>
                          ) : (
                            <span className="text-slate-700">{entry.description}</span>
                          )}
                        </div>
                      </td>
 
                      {/* Debit — red, invoice only */}
                      <td className="px-6 py-4 text-right font-medium">
                        {entry.debit > 0 ? (
                          <span className="text-red-600">{fmt(entry.debit)}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
 
                      {/* Credit — green, payment only */}
                      <td className="px-6 py-4 text-right font-medium">
                        {entry.credit > 0 ? (
                          <span className="text-green-600">{fmt(entry.credit)}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
 
                      {/* Running Balance */}
                      <td className="px-6 py-4 text-right font-semibold">
                        <span className={entry.balance > 0 ? "text-red-600" : entry.balance < 0 ? "text-green-600" : "text-slate-500"}>
                          {fmt(Math.abs(entry.balance))}
                          {entry.balance > 0 && <span className="text-xs font-normal ml-1 text-red-400">Dr</span>}
                          {entry.balance < 0 && <span className="text-xs font-normal ml-1 text-green-400">Cr</span>}
                        </span>
                      </td>
                    </tr>
                  ))}
 
                </tbody>
 
                {/* Closing Balance footer */}
                <tfoot>
                  <tr className="bg-slate-900 text-white">
                    <td className="px-6 py-4 text-xs font-medium" colSpan={2}>
                      Closing Balance
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-300">
                      {fmt(displayEntries.reduce((s, e) => s + e.debit, 0))}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-300">
                      {fmt(displayEntries.reduce((s, e) => s + e.credit, 0))}
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      {(() => {
                        const bal = displayEntries.length > 0
                          ? displayEntries[displayEntries.length - 1].balance
                          : 0;
                        return (
                          <span className={bal > 0 ? "text-red-300" : bal < 0 ? "text-green-300" : "text-white"}>
                            {fmt(Math.abs(bal))}
                            {bal > 0 && " Dr"}
                            {bal < 0 && " Cr"}
                            {bal === 0 && " Nil"}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
 
      </div>
    </div>
 
    {/* ── Ledger Payment Modal ── */}
    {showPaymentModal && summary && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
 
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-slate-800">Record Payment</h2>
              <p className="text-xs text-slate-500 mt-0.5">{customer?.name} — Outstanding: <span className="text-red-600 font-semibold">₹{summary.outstanding.toFixed(2)}</span></p>
            </div>
            <button
              onClick={() => { setShowPaymentModal(false); setPayResult(null); }}
              className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none"
            >✕</button>
          </div>
 
          {/* Success Result */}
          {payResult && !payResult.error && (
            <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-semibold text-sm mb-2">✅ Payment recorded successfully!</p>
              <div className="space-y-1">
                {payResult.settledInvoices?.map((s: any, i: number) => (
                  <p key={i} className="text-xs text-green-600">
                    Invoice #{s.invoiceNumber} — ₹{s.amountApplied.toFixed(2)} applied → <span className="font-semibold">{s.newStatus}</span>
                  </p>
                ))}
                {payResult.newOutstanding > 0 && (
                  <p className="text-xs text-slate-600 mt-1">Remaining outstanding: <span className="font-semibold text-red-600">₹{payResult.newOutstanding.toFixed(2)}</span></p>
                )}
                {payResult.newOutstanding <= 0 && (
                  <p className="text-xs text-green-700 font-semibold mt-1">All dues cleared ✅</p>
                )}
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="mt-3 w-full text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
              >Close</button>
            </div>
          )}
 
          {/* Error Result */}
          {payResult?.error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">❌ {payResult.error}</p>
            </div>
          )}
 
          {/* Form — hide after success */}
          {!(payResult && !payResult.error) && (
            <div className="p-6 space-y-4">
 
              {/* Amount + Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Amount Received *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Discount Given</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={payDiscount}
                    onChange={(e) => setPayDiscount(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>
 
              {/* Payment Mode */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Payment Mode</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                </select>
              </div>
 
              {/* Reference */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Reference No.</label>
                <input
                  type="text"
                  placeholder="TXN123 / Cheque No."
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
 
              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                />
              </div>
 
              {/* FIFO info */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-xs text-blue-600">
                💡 Payment will be applied to the <strong>oldest unpaid invoices first</strong> (FIFO)
              </div>
 
              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowPaymentModal(false); setPayResult(null); }}
                  className="flex-1 text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-lg transition-colors"
                >Cancel</button>
                <button
                  onClick={recordLedgerPayment}
                  disabled={payLoading || !payAmount}
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${
                    payLoading || !payAmount
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {payLoading ? "Recording..." : "Record Payment"}
                </button>
              </div>
 
            </div>
          )}
 
        </div>
      </div>
    )}
    </>
  );
}