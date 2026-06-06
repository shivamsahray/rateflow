import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
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
} from "../services/paymentService";

import {
 useReactToPrint
}
from "react-to-print";

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
  const printRef =
    useRef<HTMLDivElement>(null);
  
  const handlePrint =
    useReactToPrint({
      contentRef: printRef
    });

  useEffect(() => {

    const loadInvoice =
      async () => {

      if (!id) return;

      const data =
        await getInvoiceById(id);

      setInvoice(data);
    };

    loadInvoice();

  }, [id]);

  useEffect(() => {

    const loadTenant =
      async () => {
        const data =
          await getSettings();

        setTenant(data);
      };

    loadTenant();

  }, []);

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

          amount:
            Number(paymentAmount),

          paymentMode,

          referenceNumber,

          notes,
        };

        const result =
          await recordPayment(
            paymentData
          );

        console.log(
          "Payment Saved:",
          result
        );

        alert(
          "Payment recorded successfully"
        );

        setOpenPaymentModal(false);

        setPaymentAmount("");
        setReferenceNumber("");
        setNotes("");
      } catch (error) {
        console.error(error);

        alert(
          "Failed to record payment"
        );
      }
    };

  return (
    <div className="
      min-h-screen
      bg-slate-100
      p-8
    ">

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

              <p className="text-slate-500">
                  B2B Distributor Billing Platform
              </p>

              <p className="mt-2 text-sm">
                  GSTIN:
                  {" "}
                  {
                    tenantDetails?.gstNumber
                  }
              </p>

              <p className="text-sm">
                  Phone:
                  {" "}
                  {
                    tenantDetails?.phone
                  }
              </p>

              <p className="text-sm">
                  {
                    tenantDetails?.email
            } 
              </p>
            </div>
          </div>

          <div className="text-right">

            {/* <button
            onClick={() => window.print()}
            className="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                text-white
                hover:bg-blue-700
            "
            >
            Print Invoice
            </button> */}
            <div className="mb-4 flex justify-end gap-2">
              <PDFDownloadLink className="
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
                      tenantId:
                        tenantDetails,
                    }}
                  />
                }
                fileName={`${invoice.invoiceNumber}.pdf`}
              >

                {({
                  loading,
                }) =>

                  loading
                    ? "Preparing..."
                    : "Download PDF"

                }

              </PDFDownloadLink>

                <button
                  type="button"
                  onClick={() => handlePrint()}
                  className="
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-white
                    hover:bg-blue-700
                  "
                >
                  Print Invoice
                </button>

              <button
                type="button"
                onClick={() =>
                  setOpenPaymentModal(true)
                }
                className="
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-2
                  text-slate-700
                  hover:bg-slate-100
                "
              >
                Record Payment
              </button>
              
            </div>
            
            <p>
              <strong>
                Invoice No:
              </strong>
            </p>


            <p>
              {invoice.invoiceNumber}
            </p>
            <div
            className={`
                inline-block
                rounded-full
                px-4
                py-2
                font-medium

                ${
                invoice.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : invoice.paymentStatus === "Partial"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }
            `}
            >
            {invoice.paymentStatus}

            
            </div>

            <p className="mt-2">

              <strong>
                Date:
              </strong>

            </p>
            

            <p>
              {
                new Date(
                  invoice.createdAt
                )
                .toLocaleDateString()
              }
            </p>

          </div>

        </div>

        <hr />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Paid Amount
            </p>

            <p className="text-2xl font-bold text-green-600">
              ₹{invoice?.paidAmount || 0}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Outstanding Amount
            </p>

            <p className="text-2xl font-bold text-red-600">
              ₹{invoice?.outstandingAmount || 0}
            </p>
          </div>
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

            <p>
                {invoice.customerId?.name}
            </p>

            <p>
                {invoice.customerId?.phone}
            </p>

            <p>
                {invoice.customerId?.gstNumber}
            </p>

            <p>
                {invoice.customerId?.address}
            </p>

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

                {/* <th className="p-3">
                Taxable Value
                </th> */}

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
                      {
                        item.productId
                          ?.name
                      }
                    </td>

                    <td className="p-3">
                      {
                        item.quantity
                      }
                    </td>

                    <td className="p-3">
                      ₹
                      {item.price}
                    </td>

                    {/* <td className="p-3">
                        ₹
                        {(item.quantity * item.price).toFixed(2)}
                        </td> */}

                        <td className="p-3">

                        {item.gstPercent}%

                        </td>
                        {/* <td className="p-3">
                        ₹
                        {((
                          item.quantity *
                          item.price *
                          item.gstPercent
                          ) / 100).toFixed(2)}
                        </td> */}

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
                            (
                              item.quantity *
                              item.price
                              ) +
                              (
                              item.quantity *
                              item.price *
                              item.gstPercent
                              )/100
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
                <span>
                Subtotal
                </span>

                <span>
                ₹
                {subtotal.toFixed(2)}
                </span>
            </div>

            <div className="
                mt-2
                flex
                justify-between
            ">
                <span>
                GST
                </span>

                <span>
                ₹
                {gstTotal.toFixed(2)}
                </span>
            </div>

            <hr className="my-3" />

            <div className="
                flex
                justify-between
                text-xl
                font-bold
                text-green-700
            ">

                <span>
                Grand Total
                </span>

                <span>
                ₹
                {grandTotal.toFixed(2)}
                </span>

            </div>

            </div>

        </div>

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

      {openPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[450px] rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">
              Record Payment
            </h2>

            <div className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Amount
                </label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Payment Mode
                </label>

                <select
                  value={paymentMode}
                  onChange={(e) =>
                    setPaymentMode(
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border p-2"
                >
                  <option>
                    Cash
                  </option>

                  <option>
                    UPI
                  </option>

                  <option>
                    Bank Transfer
                  </option>

                  <option>
                    Cheque
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Reference Number
                </label>

                <input
                  type="text"
                  placeholder="TXN123"
                  value={referenceNumber}
                  onChange={(e) =>
                    setReferenceNumber(
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Notes
                </label>

                <textarea
                  rows={3}
                  placeholder="Optional notes"
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border p-2"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setOpenPaymentModal(false)
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRecordPayment}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default InvoiceDetails;
