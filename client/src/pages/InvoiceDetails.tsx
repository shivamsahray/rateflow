// import { useEffect, useState } from "react";

// import { useParams } from "react-router-dom";

// import {
//   PDFDownloadLink,
// } from "@react-pdf/renderer";

// import InvoicePDF
// from "../components/pdf/InvoicePDF";

// import {
//   getInvoiceById,
// } from "../services/invoiceService";
// import {
//   getSettings,
// } from "../services/settingsService";
// import {
//   recordPayment,
// } from "../services/paymentService";

// import {
//  useReactToPrint
// }
// from "react-to-print";

// import {
//  useRef
// }
// from "react"; 

// function InvoiceDetails() {

//   const { id } = useParams();

//   const [invoice, setInvoice] =
//     useState<any>(null);

//   const [tenant, setTenant] =
//     useState<any>(null);

//   const [
//     openPaymentModal,
//     setOpenPaymentModal,
//   ] = useState(false);

//   const [
//     paymentAmount,
//     setPaymentAmount,
//   ] = useState("");

//   const [
//     paymentMode,
//     setPaymentMode,
//   ] = useState("UPI");

//   const [
//     referenceNumber,
//     setReferenceNumber,
//   ] = useState("");

//   const [
//     notes,
//     setNotes,
//   ] = useState("");
//   const printRef =
//     useRef<HTMLDivElement>(null);
  
//   const handlePrint =
//     useReactToPrint({
//       contentRef: printRef
//     });

//   useEffect(() => {

//     const loadInvoice =
//       async () => {

//       if (!id) return;

//       const data =
//         await getInvoiceById(id);

//       setInvoice(data);
//     };

//     loadInvoice();

//   }, [id]);

//   useEffect(() => {

//     const loadTenant =
//       async () => {
//         const data =
//           await getSettings();

//         setTenant(data);
//       };

//     loadTenant();

//   }, []);

//   if (!invoice) {
//     return (
//       <div className="p-8">
//         Loading...
//       </div>
//     );
//   }
//   const subtotal =
//   invoice.items.reduce(
//     (
//       sum: number,
//       item: any
//     ) =>
//       sum +
//       item.quantity *
//       item.price,
//     0
//   );

// const gstTotal =
//   invoice.items.reduce(
//   (
//   sum:number,
//   item:any
//   )=>
//   sum +
//   (
//     item.quantity *
//     item.price *
//     item.gstPercent
//   ) / 100,
//   0
// );

// const grandTotal =
//   subtotal +
//   gstTotal;

//   const tenantDetails =
//     tenant ||
//     invoice.tenantId;

//   const handleRecordPayment =
//     async () => {
//       try {
//         const paymentData = {
//           tenantId:
//             invoice?.tenantId,
//           customerId:
//             invoice?.customerId,
//           invoiceId:
//             invoice?._id,

//           amount:
//             Number(paymentAmount),

//           paymentMode,

//           referenceNumber,

//           notes,
//         };

//         const result =
//           await recordPayment(
//             paymentData
//           );

//         console.log(
//           "Payment Saved:",
//           result
//         );

//         alert(
//           "Payment recorded successfully"
//         );

//         setOpenPaymentModal(false);

//         setPaymentAmount("");
//         setReferenceNumber("");
//         setNotes("");
//       } catch (error) {
//         console.error(error);

//         alert(
//           "Failed to record payment"
//         );
//       }
//     };

//   return (
//     <div className="
//       min-h-screen
//       bg-slate-100
//       p-8
//     ">

//       <div ref={printRef} className="
//         mx-auto
//         max-w-4xl
//         rounded-2xl
//         bg-white
//         p-10
//         shadow
//       ">

//         <div className="
//           mb-8
//           flex
//           justify-between
//         ">

//           <div className="flex items-center gap-4">

//             {tenantDetails?.logo && (
//               <img
//                 src={tenantDetails.logo}
//                 alt="Logo"
//                 className="h-20 w-auto object-contain"
//               />
//             )}

//             <div>
//               <h1 className="text-3xl font-bold">
//                   {tenantDetails?.companyName}
//               </h1>

//               <p className="text-slate-500">
//                   B2B Distributor Billing Platform
//               </p>

//               <p className="mt-2 text-sm">
//                   GSTIN:
//                   {" "}
//                   {
//                     tenantDetails?.gstNumber
//                   }
//               </p>

//               <p className="text-sm">
//                   Phone:
//                   {" "}
//                   {
//                     tenantDetails?.phone
//                   }
//               </p>

//               <p className="text-sm">
//                   {
//                     tenantDetails?.email
//             } 
//               </p>
//             </div>
//           </div>

//           <div className="text-right">

//             {/* <button
//             onClick={() => window.print()}
//             className="
//                 rounded-lg
//                 bg-blue-600
//                 px-4
//                 py-2
//                 text-white
//                 hover:bg-blue-700
//             "
//             >
//             Print Invoice
//             </button> */}
//             <div className="mb-4 flex justify-end gap-2">
//               <PDFDownloadLink className="
//                   inline-block
//                   rounded-lg
//                   bg-green-600
//                   px-4
//                   py-2
//                   text-white
//                   hover:bg-green-700
//               "
//                 document={
//                   <InvoicePDF
//                     invoice={{
//                       ...invoice,
//                       tenantId:
//                         tenantDetails,
//                     }}
//                   />
//                 }
//                 fileName={`${invoice.invoiceNumber}.pdf`}
//               >

//                 {({
//                   loading,
//                 }) =>

//                   loading
//                     ? "Preparing..."
//                     : "Download PDF"

//                 }

//               </PDFDownloadLink>

//                 <button
//                   type="button"
//                   onClick={() => handlePrint()}
//                   className="
//                     rounded-lg
//                     bg-blue-600
//                     px-4
//                     py-2
//                     text-white
//                     hover:bg-blue-700
//                   "
//                 >
//                   Print Invoice
//                 </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setOpenPaymentModal(true)
//                 }
//                 className="
//                   rounded-lg
//                   border
//                   border-slate-300
//                   bg-white
//                   px-4
//                   py-2
//                   text-slate-700
//                   hover:bg-slate-100
//                 "
//               >
//                 Record Payment
//               </button>
              
//             </div>
            
//             <p>
//               <strong>
//                 Invoice No:
//               </strong>
//             </p>


//             <p>
//               {invoice.invoiceNumber}
//             </p>
//             <div
//             className={`
//                 inline-block
//                 rounded-full
//                 px-4
//                 py-2
//                 font-medium

//                 ${
//                 invoice.paymentStatus === "Paid"
//                     ? "bg-green-100 text-green-700"
//                     : invoice.paymentStatus === "Partial"
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-yellow-100 text-yellow-700"
//                 }
//             `}
//             >
//             {invoice.paymentStatus}

            
//             </div>

//             <p className="mt-2">

//               <strong>
//                 Date:
//               </strong>

//             </p>
            

//             <p>
//               {
//                 new Date(
//                   invoice.createdAt
//                 )
//                 .toLocaleDateString()
//               }
//             </p>

//           </div>

//         </div>

//         <hr />
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <p className="text-sm text-gray-500">
//               Paid Amount
//             </p>

//             <p className="text-2xl font-bold text-green-600">
//               ₹{invoice?.paidAmount || 0}
//             </p>
//           </div>

//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <p className="text-sm text-gray-500">
//               Outstanding Amount
//             </p>

//             <p className="text-2xl font-bold text-red-600">
//               ₹{invoice?.outstandingAmount || 0}
//             </p>
//           </div>
//         </div>

//         <div className="
//             mt-8
//             rounded-xl
//             border
//             p-5
//             ">

//             <h2 className="
//                 mb-4
//                 text-lg
//                 font-semibold
//             ">
//                 Bill To
//             </h2>

//             <p>
//                 {invoice.customerId?.name}
//             </p>

//             <p>
//                 {invoice.customerId?.phone}
//             </p>

//             <p>
//                 {invoice.customerId?.gstNumber}
//             </p>

//             <p>
//                 {invoice.customerId?.address}
//             </p>

//             </div>

//             <div>
              
//               <p className="mt-4">
//                 Vehicle Number:
//               </p>
//               {invoice.vehicleNumber && (
//                 <p className="mt-2">
//                   {/* <strong>
//                     Vehicle Number:
//                   </strong>{" "} */}
//                   {invoice.vehicleNumber}
//                 </p>
//               )}
//             </div>
        

//         <div className="mt-8">

//           <table className="
//             w-full
//             border
//           ">

//             <thead>

//               <tr className="
//                 bg-slate-100
//               ">

//                 <th className="p-3">
//                   Product
//                 </th>

//                 <th className="p-3">
//                   Qty
//                 </th>

//                 <th className="p-3">
//                   Rate
//                 </th>

//                 {/* <th className="p-3">
//                 Taxable Value
//                 </th> */}

//                 <th className="p-3">
//                 GST
//                 </th>

//                 <th className="p-3">
//                   GST Amount
//                 </th>

//                 <th className="p-3">
//                 Total
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {invoice.items.map(
//                 (
//                   item: any
//                 ) => (

//                   <tr
//                     key={
//                       item._id
//                     }
//                     className="
//                       border-t
//                     "
//                   >

//                     <td className="p-3">
//                       {
//                         item.productId
//                           ?.name
//                       }
//                     </td>

//                     <td className="p-3">
//                       {
//                         item.quantity
//                       }
//                     </td>

//                     <td className="p-3">
//                       ₹
//                       {item.price}
//                     </td>

//                     {/* <td className="p-3">
//                         ₹
//                         {(item.quantity * item.price).toFixed(2)}
//                         </td> */}

//                         <td className="p-3">

//                         {item.gstPercent}%

//                         </td>
//                         {/* <td className="p-3">
//                         ₹
//                         {((
//                           item.quantity *
//                           item.price *
//                           item.gstPercent
//                           ) / 100).toFixed(2)}
//                         </td> */}

//                         <td className="p-3">

//                         ₹
//                         {(
//                             item.quantity *
//                             item.price *
//                             (item.gstPercent / 100)
//                         ).toFixed(2)}

//                         </td>

//                         <td className="p-3 font-medium">
//                         ₹
//                         {(
//                             (
//                               item.quantity *
//                               item.price
//                               ) +
//                               (
//                               item.quantity *
//                               item.price *
//                               item.gstPercent
//                               )/100
//                         ).toFixed(2)}
//                         </td>

//                   </tr>

//                 )
//               )}

//             </tbody>

//           </table>

//         </div>

        

//         <div className="
//             mt-6
//             flex
//             justify-end
//             ">
//             <div className="
//                 w-64
//                 rounded-xl
//                 border
//                 bg-green-50
//                 p-5
//             ">

//             <div className="
//                 flex
//                 justify-between
//             ">
//                 <span>
//                 Subtotal
//                 </span>

//                 <span>
//                 ₹
//                 {subtotal.toFixed(2)}
//                 </span>
//             </div>

//             <div className="
//                 mt-2
//                 flex
//                 justify-between
//             ">
//                 <span>
//                 GST
//                 </span>

//                 <span>
//                 ₹
//                 {gstTotal.toFixed(2)}
//                 </span>
//             </div>

//             <hr className="my-3" />

//             <div className="
//                 flex
//                 justify-between
//                 text-xl
//                 font-bold
//                 text-green-700
//             ">

//                 <span>
//                 Grand Total
//                 </span>

//                 <span>
//                 ₹
//                 {grandTotal.toFixed(2)}
//                 </span>

//             </div>

//             </div>

//         </div>

//         <div className="mt-10 text-right">

//           <p className="font-semibold">
//             Authorized Signatory
//           </p>

//           {tenantDetails?.signature && (
//             <img
//               src={tenantDetails.signature}
//               alt="Signature"
//               className="ml-auto mt-2 h-16 object-contain"
//             />
//           )}

//         </div>

//       </div>

//       {openPaymentModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-[450px] rounded-lg bg-white p-6 shadow-lg">
//             <h2 className="mb-4 text-xl font-bold">
//               Record Payment
//             </h2>

//             <div className="space-y-4">

//               <div>
//                 <label className="mb-1 block text-sm font-medium">
//                   Amount
//                 </label>

//                 <input
//                   type="number"
//                   placeholder="Enter amount"
//                   value={paymentAmount}
//                   onChange={(e) =>
//                     setPaymentAmount(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border p-2"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium">
//                   Payment Mode
//                 </label>

//                 <select
//                   value={paymentMode}
//                   onChange={(e) =>
//                     setPaymentMode(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border p-2"
//                 >
//                   <option>
//                     Cash
//                   </option>

//                   <option>
//                     UPI
//                   </option>

//                   <option>
//                     Bank Transfer
//                   </option>

//                   <option>
//                     Cheque
//                   </option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium">
//                   Reference Number
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="TXN123"
//                   value={referenceNumber}
//                   onChange={(e) =>
//                     setReferenceNumber(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border p-2"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium">
//                   Notes
//                 </label>

//                 <textarea
//                   rows={3}
//                   placeholder="Optional notes"
//                   value={notes}
//                   onChange={(e) =>
//                     setNotes(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border p-2"
//                 />
//               </div>

//             </div>

//             <div className="mt-6 flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setOpenPaymentModal(false)
//                 }
//                 className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleRecordPayment}
//                 className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
//               >
//                 Record Payment
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default InvoiceDetails;

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  BlobProvider,
  PDFDownloadLink,
} from "@react-pdf/renderer";

import InvoicePDF
from "../components/pdf/InvoicePDF";

import {
  getInvoiceById,
} from "../services/invoiceService";
import {
  getSettings,
} from "../services/settingsService";
import {
  recordPayment,
  getPaymentsByInvoice,
} from "../services/paymentService";

import {
 useRef
}
from "react"; 

function InvoiceDetails() {

  const { id } = useParams();

  const [invoice, setInvoice] =
    useState<any>(null);

  const [tenant, setTenant] =
    useState<any>(null);

  const [
    openPaymentModal,
    setOpenPaymentModal,
  ] = useState(false);

  const [
    paymentAmount,
    setPaymentAmount,
  ] = useState("");

  // ✅ NEW: discount state
  const [
    discountAmount,
    setDiscountAmount,
  ] = useState("0");

  const [
    paymentMode,
    setPaymentMode,
  ] = useState("UPI");

  const [
    referenceNumber,
    setReferenceNumber,
  ] = useState("");

  const [
    notes,
    setNotes,
  ] = useState("");

  // ✅ NEW: payment history state
  const [
    paymentHistory,
    setPaymentHistory,
  ] = useState<any[]>([]);

  const printRef =
    useRef<HTMLDivElement>(null);
  
  const handlePrint = (url: string | null) => {
    if (!url) return;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  };

  // ✅ Load invoice
  useEffect(() => {
    const loadInvoice =
      async () => {
      if (!id) return;
      const data = await getInvoiceById(id);
      setInvoice(data);
    };
    loadInvoice();
  }, [id]);

  // ✅ Load tenant settings
  useEffect(() => {
    const loadTenant =
      async () => {
        const data = await getSettings();
        setTenant(data);
      };
    loadTenant();
  }, []);

  // ✅ Load payment history whenever invoice loads
  useEffect(() => {
    const loadPayments = async () => {
      if (!id) return;
      try {
        const data = await getPaymentsByInvoice(id);
        setPaymentHistory(data);
      } catch {
        setPaymentHistory([]);
      }
    };
    loadPayments();
  }, [id]);

  if (!invoice) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  const subtotal =
  invoice.items.reduce(
    (
      sum: number,
      item: any
    ) =>
      sum +
      item.quantity *
      item.price,
    0
  );

  const gstTotal =
    invoice.items.reduce(
    (
    sum:number,
    item:any
    )=>
    sum +
    (
      item.quantity *
      item.price *
      item.gstPercent
    ) / 100,
    0
  );

  const grandTotal =
    subtotal +
    gstTotal;

  const tenantDetails =
    tenant ||
    invoice.tenantId;

  // ✅ Live calculation in modal
  const pendingAmount = invoice.outstandingAmount || 0;
  const enteredAmount = Number(paymentAmount) || 0;
  const enteredDiscount = Number(discountAmount) || 0;
  const balanceAfter = Math.max(pendingAmount - enteredAmount - enteredDiscount, 0);

  const handleRecordPayment =
    async () => {
      try {
        const paymentData = {
          tenantId:
            invoice?.tenantId,
          customerId:
            invoice?.customerId,
          invoiceId:
            invoice?._id,
          amount: enteredAmount,
          discount: enteredDiscount,
          paymentMode,
          referenceNumber,
          notes,
        };

        await recordPayment(paymentData);

        // Refresh invoice and payment history
        const updatedInvoice = await getInvoiceById(id!);
        setInvoice(updatedInvoice);

        const updatedPayments = await getPaymentsByInvoice(id!);
        setPaymentHistory(updatedPayments);

        setOpenPaymentModal(false);
        setPaymentAmount("");
        setDiscountAmount("0");
        setReferenceNumber("");
        setNotes("");

        alert("Payment recorded successfully");
      } catch (error) {
        console.error(error);
        alert("Failed to record payment");
      }
    };

  return (
    <div className="
      min-h-screen
      bg-slate-100
      p-8
    ">

      {/* Buttons - outside printRef */}
      <div className="mx-auto max-w-4xl mb-4 flex justify-end gap-2">
        <PDFDownloadLink
          className="
            inline-block
            rounded-lg
            bg-green-600
            px-4
            py-2
            text-white
            hover:bg-green-700
          "
          document={
            <InvoicePDF
              invoice={{
                ...invoice,
                tenantId: tenantDetails,
              }}
            />
          }
          fileName={`${invoice.invoiceNumber}.pdf`}
        >
          {({ loading }) =>
            loading ? "Preparing..." : "Download PDF"
          }
        </PDFDownloadLink>

        <BlobProvider document={<InvoicePDF invoice={{ ...invoice, tenantId: tenantDetails }} />}>
          {({ url, loading }) => (
            <button
              onClick={() => handlePrint(url)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {loading ? "Loading Print..." : "Print"}
            </button>
          )}
        </BlobProvider>

        <button
          type="button"
          onClick={() => setOpenPaymentModal(true)}
          className="
            rounded-lg
            bg-slate-900
            px-4
            py-2
            text-white
            hover:bg-slate-800
          "
        >
          Record Payment
        </button>
      </div>

      <div ref={printRef} className="
        mx-auto
        max-w-4xl
        rounded-2xl
        bg-white
        p-10
        shadow
      ">

        <div className="
          mb-8
          flex
          justify-between
        ">

          <div className="flex items-center gap-4">

            {tenantDetails?.logo && (
              <img
                src={tenantDetails.logo}
                alt="Logo"
                className="h-20 w-auto object-contain"
              />
            )}

            <div>
              <h1 className="text-3xl font-bold">
                  {tenantDetails?.companyName}
              </h1>

              <p className="mt-2 text-sm">
                  GSTIN:
                  {" "}
                  {tenantDetails?.gstNumber}
              </p>

              <p className="text-sm">
                  Phone:
                  {" "}
                  {tenantDetails?.phone}
              </p>

              <p className="text-sm">
                  {tenantDetails?.email} 
              </p>
            </div>
          </div>

          <div className="text-right">

            <p className="mt-0 gap-0">
              <strong>Date:</strong>
              <span>
                {new Date(invoice.createdAt).toLocaleDateString()}
              </span>
            </p>
            
            <p className="gap-0">
              <strong>Invoice No:</strong>
              <span>{invoice.invoiceNumber}</span>
            </p>

            <p className="mt-0 gap-0">
             {invoice.vehicleNumber && (
              <p className="mt-2">
                <strong>Vehicle No:</strong>{" "}
                {invoice.vehicleNumber}
              </p>
            )}
            </p>
            
            <p className="mt-0 gap-0">
             {invoice.ewayBillNumber && (
              <p className="mt-2">
                <strong>E-Way Bill No:</strong>{" "}
                {invoice.ewayBillNumber}
              </p>
            )}
            </p>

          </div>

        </div>

        <hr />

        {/* ✅ Paid / Outstanding summary cards */}
        <div className="grid grid-cols-3 gap-4 mt-6 mb-4">

          <div className="rounded-lg border bg-slate-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Invoice Amount</p>
            <p className="text-xl font-bold">₹{invoice.grandTotal?.toFixed(2)}</p>
          </div>

          <div className="rounded-lg border bg-green-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Amount Received</p>
            <p className="text-xl font-bold text-green-600">
              ₹{invoice.paidAmount?.toFixed(2) || "0.00"}
            </p>
          </div>

          <div className="rounded-lg border bg-red-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Balance Amount</p>
            <p className="text-xl font-bold text-red-600">
              ₹{invoice.outstandingAmount?.toFixed(2) || "0.00"}
            </p>
          </div>

        </div>

        {/* Payment Status Badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className={`
            inline-block rounded-full px-3 py-1 text-sm font-semibold
            ${invoice.paymentStatus === "Paid"
              ? "bg-green-100 text-green-700"
              : invoice.paymentStatus === "Partial"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
            }
          `}>
            {invoice.paymentStatus}
          </span>
        </div>

        <div className="
            mt-8
            rounded-xl
            border
            p-5
            ">

            <h2 className="
                mb-4
                text-lg
                font-semibold
            ">
                Bill To
            </h2>

            <p>{invoice.customerId?.name}</p>
            <p>{invoice.customerId?.phone}</p>
            <p>{invoice.customerId?.gstNumber}</p>
            <p>{invoice.customerId?.address}</p>
        </div>

        <div className="mt-8">

          <table className="
            w-full
            border
          ">

            <thead>

              <tr className="
                bg-slate-100
              ">

                <th className="p-3">
                  Product
                </th>

                <th className="p-3">
                  Qty
                </th>

                <th className="p-3">
                  Rate
                </th>

                <th className="p-3">
                  GST
                </th>

                <th className="p-3">
                  GST Amount
                </th>

                <th className="p-3">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {invoice.items.map(
                (
                  item: any
                ) => (

                  <tr
                    key={
                      item._id
                    }
                    className="
                      border-t
                    "
                  >

                    <td className="p-3">
                      {item.productId?.name}
                    </td>

                    <td className="p-3">
                      {item.quantity}
                    </td>

                    <td className="p-3">
                      ₹{item.price}
                    </td>

                    <td className="p-3">
                      {item.gstPercent}%
                    </td>

                    <td className="p-3">
                      ₹
                      {(
                          item.quantity *
                          item.price *
                          (item.gstPercent / 100)
                      ).toFixed(2)}
                    </td>

                    <td className="p-3 font-medium">
                      ₹
                      {(
                          (item.quantity * item.price) +
                          (item.quantity * item.price * item.gstPercent) / 100
                      ).toFixed(2)}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        <div className="
            mt-6
            flex
            justify-end
            ">
            <div className="
                w-64
                rounded-xl
                border
                bg-green-50
                p-5
            ">

            <div className="
                flex
                justify-between
            ">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="
                mt-2
                flex
                justify-between
            ">
                <span>GST</span>
                <span>₹{gstTotal.toFixed(2)}</span>
            </div>

            <hr className="my-3" />

            <div className="
                flex
                justify-between
                text-xl
                font-bold
                text-green-700
            ">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            </div>

        </div>

        {/* ✅ Payment History Section */}
        {paymentHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Payment History</h3>
            <table className="w-full border rounded-xl overflow-hidden text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Mode</th>
                  <th className="p-3 text-left">Reference</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Discount</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p: any) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{p.paymentMode}</td>
                    <td className="p-3 text-gray-500">{p.referenceNumber || "—"}</td>
                    <td className="p-3 text-right text-green-600 font-medium">
                      ₹{p.amount?.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-orange-500">
                      {p.discount > 0 ? `₹${p.discount?.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 text-right">

          <p className="font-semibold">
            Authorized Signatory
          </p>

          {tenantDetails?.signature && (
            <img
              src={tenantDetails.signature}
              alt="Signature"
              className="ml-auto mt-2 h-16 object-contain"
            />
          )}

        </div>

      </div>

      {/* ✅ PAYMENT MODAL — myBillBook style */}
      {openPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[680px] rounded-xl bg-white shadow-xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">
                Record Payment For Invoice #{invoice.invoiceNumber}
              </h2>
              <button
                onClick={() => setOpenPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-0">

              {/* Left: Form */}
              <div className="flex-1 p-6 space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full rounded-md border p-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Discount Given
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="w-full rounded-md border p-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full rounded-md border p-2"
                    >
                      <option>Cash</option>
                      <option>UPI</option>
                      <option>Bank Transfer</option>
                      <option>Cheque</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="TXN123 / Cheque No."
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Optional notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                </div>

              </div>

              {/* Right: Calculation Summary */}
              <div className="w-56 bg-slate-50 border-l p-6 flex flex-col gap-3">
                <h3 className="font-semibold text-sm text-gray-600 mb-2">
                  Payment Calculation
                </h3>

                <div className="flex justify-between text-sm">
                  <span className="text-red-500 font-medium">Invoice Pending</span>
                  <span className="text-red-500 font-medium">₹{pendingAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Received</span>
                  <span>₹{enteredAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount Given</span>
                  <span>₹{enteredDiscount.toFixed(2)}</span>
                </div>

                <hr />

                <div className="flex justify-between text-sm font-bold">
                  <span>Balance Amount</span>
                  <span className={balanceAfter > 0 ? "text-red-500" : "text-green-600"}>
                    ₹{balanceAfter.toFixed(2)}
                  </span>
                </div>

                {/* Invoice info */}
                <div className="mt-4 text-xs text-gray-500 space-y-1 border-t pt-3">
                  <p className="font-semibold text-gray-700">
                    Invoice #{invoice.invoiceNumber}
                  </p>
                  <p>Total: ₹{invoice.grandTotal?.toFixed(2)}</p>
                  <p>
                    Customer:{" "}
                    {typeof invoice.customerId === "object"
                      ? invoice.customerId?.name
                      : "—"}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
              <button
                type="button"
                onClick={() => setOpenPaymentModal(false)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleRecordPayment}
                className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-800 font-medium"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default InvoiceDetails;