import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  getInvoices
} from "../services/invoiceService";

function Invoices() {

  const [invoices,
    setInvoices] =
      useState<any[]>([]);

  useEffect(() => {

    const loadInvoices =
      async () => {

        const data =
          await getInvoices();

        setInvoices(data);
      };

    loadInvoices();

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="
          mb-8
          text-3xl
          font-bold
        ">
          Invoices
        </h1>

        <div className="
          rounded-2xl
          bg-white
          shadow-sm
          border
        ">

          <table className="w-full">

            <thead>

              <tr className="
                bg-slate-100
              ">

                <th className="p-4">
                  Invoice
                </th>

                <th className="p-4">
                  Customer
                </th>

                <th className="p-4">
                  Total
                </th>

                <th className="p-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {invoices.map(
                (
                  invoice
                ) => (

                  <tr
                    key={
                      invoice._id
                    }
                    className="
                      border-t
                    "
                  >

                    <td className="p-4">
                      {
                        invoice.invoiceNumber
                      }
                    </td>

                    <td className="p-4">
                      {
                        invoice.customerId
                          ?.name
                      }
                    </td>

                    <td className="p-4">

                      ₹
                      {
                        invoice.totalAmount
                      }

                    </td>

                    <td className="p-4">

                      <Link
                        to={
                          `/invoice/${invoice._id}`
                        }
                        className="
                          rounded-lg
                          bg-blue-600
                          px-4
                          py-2
                          text-white
                        "
                      >

                        View

                      </Link>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Invoices;