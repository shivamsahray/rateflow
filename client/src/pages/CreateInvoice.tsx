import { useEffect, useState } from "react";

import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getLastPrice } from "../services/pricingService";
import { createInvoice } from "../services/invoiceService";
import { getNextInvoiceNumber } from "../services/invoiceService";
import { useNavigate } from "react-router-dom";

interface Customer {
  _id: string;
  name: string;
  gstNumber?: string;
  phone?: string;
  address?: string;
  outstandingAmount?: number;
}

interface Product {
  _id: string;
  name: string;
  defaultPrice: number;
  gstPercent: number;
}

interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  gstPercent: number;
}

function CreateInvoice() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState("");
//   const [invoiceNumber] = useState(
//     `INV-${Date.now()}`
//     );


    const [invoiceDate, setInvoiceDate] =
    useState(
        new Date()
        .toISOString()
        .split("T")[0]
    );
    const navigate = useNavigate();
    const [
      nextInvoiceNumber,
      setNextInvoiceNumber
    ] = useState("");

    const [paymentStatus, setPaymentStatus] =
    useState("Pending");

    const [notes, setNotes] =
    useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
        productId: "",
        quantity: 1,
        price: 0,
        gstPercent: 0,
    },
    ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const customerData = await getCustomers();
        const productData = await getProducts();

        setCustomers(customerData);
        setProducts(productData);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);
  useEffect(() => {

  const loadNextInvoiceNumber =
    async () => {

      try {

        const data =
          await getNextInvoiceNumber();

        setNextInvoiceNumber(
          data.invoiceNumber
        );

      } catch (error) {

        console.error(error);

      }

    };

  loadNextInvoiceNumber();

}, []);

  const addRow = () => {
    setItems([
        ...items,
        {
        productId: "",
        quantity: 1,
        price: 0,
        gstPercent: 0,
        },
    ]);
    };

  const removeRow = (index: number) => {
    if (items.length === 1) return;

    const updatedItems = items.filter(
      (_, i) => i !== index
    );

    setItems(updatedItems);
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  };

  const fetchPrice = async (
      index: number,
      productId: string
    ) => {
      const product = products.find(
        (p) => p._id === productId
      );

      if (!product) return;

      let price = product.defaultPrice;

      try {
        if (customerId) {
          const data = await getLastPrice(
            customerId,
            productId
          );

          if (data?.lastSoldPrice) {
            price = data.lastSoldPrice;
          }
        }
      } catch {
        console.log("No previous pricing");
      }

      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index
            ? {
                ...item,
                productId,
                price,
                gstPercent: product.gstPercent,
              }
            : item
        )
      );
    };

//   const grandTotal = items.reduce(
//     (sum, item) =>
//       sum + item.quantity * item.price,
//     0
//   );
  const selectedCustomer =
    customers.find(
        (customer) =>
        customer._id === customerId
  );


  const handleSubmit = async () => {
    try {
     const invoice =
        await createInvoice({

        invoiceDate,
        paymentStatus,
        notes,
        customerId,

        items: items.map((item) => ({
          ...item,
          amount:
            item.quantity * item.price,
            
        })),
      });

      // alert(`Invoice ${invoice.invoiceNumber} Created Successfully`);
      navigate(
        `/invoice/${invoice._id}`
      );

      setCustomerId("");

      setItems([
        {
          productId: "",
          quantity: 1,
          price: 0,
          gstPercent: 18,
        },
      ]);
    } catch (error) {
      console.error(error);

      alert("Failed to create invoice");
    }
  };
  const subtotal = items.reduce(
  (sum, item) =>
    sum +
    item.quantity * item.price,
  0
);

const totalGST = items.reduce(
  (sum, item) => {
    const taxable =
      item.quantity * item.price;

    return (
      sum +
      taxable *
        (item.gstPercent / 100)
    );
  },
  0
);

const grandTotal =
  subtotal + totalGST;

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Create Invoice
          </h1>

          <p className="mt-2 text-slate-500">
            Create customer invoices with
            automatic price suggestions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 grid gap-4 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                    Invoice Number
                    </label>

                    <input
                    value={nextInvoiceNumber}
                    readOnly
                    className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-slate-100
                        p-3
                    "
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                    Invoice Date
                    </label>

                    <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) =>
                        setInvoiceDate(
                        e.target.value
                        )
                    }
                    className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        p-3
                    "
                    />

                </div>

            </div>

          <div className="mb-8">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Customer
            </label>

            <select
              value={customerId}
              onChange={(e) =>
                setCustomerId(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            >
              <option value="">
                Select Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer._id}
                  value={customer._id}
                >
                  {customer.name}
                </option>
              ))}
            </select>

          </div>
          {selectedCustomer && (

            <div className="
                mb-8
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                p-5
            ">

                <h2 className="
                mb-4
                text-lg
                font-semibold
                text-slate-800
                ">
                Customer Details
                </h2>

                <div className="
                grid
                gap-4
                md:grid-cols-2
                ">

                <div>

                    <p className="text-sm text-slate-500">
                    Customer Name
                    </p>

                    <p className="font-medium">
                    {selectedCustomer.name}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                    GST Number
                    </p>

                    <p className="font-medium">
                    {selectedCustomer.gstNumber ||
                        "Not Available"}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                    Phone
                    </p>

                    <p className="font-medium">
                    {selectedCustomer.phone ||
                        "Not Available"}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                    Outstanding
                    </p>

                    <p className="
                    font-medium
                    text-red-600
                    ">
                    ₹
                    {(
                        selectedCustomer.outstandingAmount ||
                        0
                    ).toLocaleString()}
                    </p>

                </div>

                <div className="md:col-span-2">

                    <p className="text-sm text-slate-500">
                    Address
                    </p>

                    <p className="font-medium">
                    {selectedCustomer.address ||
                        "Not Available"}
                    </p>

                </div>

                </div>

            </div>

            )}
            <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Status
                </label>

                <select
                    value={paymentStatus}
                    onChange={(e) =>
                    setPaymentStatus(
                        e.target.value
                    )
                    }
                    className="
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    p-3
                    "
                >

                    <option>
                    Pending
                    </option>

                    <option>
                    Partial
                    </option>

                    <option>
                    Paid
                    </option>

                </select>

                </div>

          <div className="overflow-x-auto">

            <table className="w-full border border-slate-200">

              <thead>

                <tr className="bg-slate-100">

                  <th className="p-3 text-left">
                    Product
                  </th>

                  <th className="p-3 text-left">
                    Quantity
                  </th>

                  <th className="p-3 text-left">
                    Rate
                  </th>
                  
                  <th className="p-3 text-left">
                    GST %
                  </th>
                  <th className="p-3 text-left">
                    GST Amount
                  </th>

                  <th className="p-3 text-left">
                    Total
                  </th>

                  <th className="p-3 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map(
                  (item, index) => (

                    <tr
                      key={index}
                      className="border-t"
                    >

                      <td className="p-3">

                        <select
                          value={
                            item.productId
                          }
                          onChange={(e) =>
                            fetchPrice(
                                index,
                                e.target.value
                            )
                            }
                          className="w-full rounded-lg border border-slate-300 p-2"
                        >

                          <option value="">
                            Select Product
                          </option>

                          {products.map(
                            (
                              product
                            ) => (

                              <option
                                key={
                                  product._id
                                }
                                value={
                                  product._id
                                }
                              >
                                {
                                  product.name
                                }
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      <td className="p-3">

                        <input
                          type="number"
                          min="1"
                          value={
                            item.quantity
                          }
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-24 rounded-lg border border-slate-300 p-2"
                        />

                      </td>

                      {/* Rate */}

                        <td className="p-3">

                        <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                            updateItem(
                                index,
                                "price",
                                Number(e.target.value)
                            )
                            }
                            className="
                            w-28
                            rounded-lg
                            border
                            border-slate-300
                            p-2
                            "
                        />

                        </td>

                        {/* Taxable */}

                        {/* <td className="p-3">

                        ₹
                        {(
                            item.quantity *
                            item.price
                        ).toFixed(2)}

                        </td> */}

                        {/* GST % */}

                        <td className="p-3">

                        {item.gstPercent}%

                        </td>

                        {/* GST Amount */}

                        <td className="p-3">

                        ₹
                        {(
                            item.quantity *
                            item.price *
                            (item.gstPercent / 100)
                        ).toFixed(2)}

                        </td>

                        {/* Total */}

                        <td className="p-3 font-medium">

                        ₹
                        {(
                            item.quantity *
                            item.price *
                            (1 + item.gstPercent / 100)
                        ).toFixed(2)}

                        </td>
                    

                      <td className="p-3">

                        <button
                          onClick={() =>
                            removeRow(
                              index
                            )
                          }
                          className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                        >
                          Remove
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          <button
            onClick={addRow}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            + Add Product
          </button>

          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">

            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-2 flex justify-between">
                <span>Total GST</span>
                <span>₹{totalGST.toFixed(2)}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold text-green-700">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
            </div>

        </div>

        <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
            </label>

            <textarea
                rows={4}
                value={notes}
                onChange={(e) =>
                setNotes(
                    e.target.value
                )
                }
                placeholder="
                Delivery instructions,
                payment terms,
                remarks...
                "
                className="
                w-full
                rounded-lg
                border
                border-slate-300
                p-3
                "
            />

        </div>

          <button
            onClick={handleSubmit}
            disabled={
              !customerId
            }
            className="mt-8 w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
          >
            Create Invoice
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateInvoice;