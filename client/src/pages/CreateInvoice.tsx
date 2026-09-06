import { useEffect, useState } from "react";

import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getLastPrice } from "../services/pricingService";
import { createInvoice } from "../services/invoiceService";
import { getNextInvoiceNumber } from "../services/invoiceService";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";

interface Customer {
  _id: string;
  name: string;
  gstNumber?: string;
  phone?: string;
  address?: string;
  outstandingAmount?: number;
}

// interface Product {
//   _id: string;
//   name: string;
//   defaultPrice: number;
//   gstPercent: number;
//   stock?: number;          // ✅ NEW
//   lowStockThreshold?: number; // ✅ NEW
// }
interface Product {
  _id: string;
  name: string;
  sku?: string;
  unit?: string;

  defaultPrice: number;

  gstPercent: number;

  stock?: number;

  lowStockThreshold?: number;
}
const ProductSingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center justify-between w-full">
        <span className="font-medium">
          {props.data.label}
        </span>

        <span className="ml-3 text-xs text-gray-500">
          ₹{props.data.price}
          {props.data.unit ? ` / ${props.data.unit}` : ""}
        </span>
      </div>
    </components.SingleValue>
  );
};
const ProductOption = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-gray-800">
            {props.data.label}
          </div>

          <div className="text-xs text-gray-500 mt-1">
            SKU : {props.data.sku || "-"}
          </div>
        </div>

        <div className="text-right">
          <div className="font-semibold text-blue-600">
            ₹{props.data.price}
            {props.data.unit ? ` / ${props.data.unit}` : ""}
          </div>

          <div className="mt-1">
            {(props.data.stock ?? 0) <= 0 ? (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                ❌ Out of Stock
              </span>
            ) : (props.data.stock ?? 0) <=
              (props.data.lowStockThreshold ?? 10) ? (
              <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                ⚠️ Low Stock : {props.data.stock}
              </span>
            ) : (
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                ✓ Stock : {props.data.stock}
              </span>
            )}
          </div>
        </div>
      </div>
    </components.Option>
  );
};
interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  gstPercent: number;
}

function CreateInvoice() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const customerOptions = customers.map((customer) => ({
    value: customer._id,
    label: customer.name,
  }));
  const [products, setProducts] = useState<Product[]>([]);
  const productOptions = products.map((product) => ({
    value: product._id,

    label: product.name,

    sku: product.sku,

    unit: product.unit,

    stock: product.stock,

    price: product.defaultPrice,
    
    gstPercent: product.gstPercent,

    lowStockThreshold:
        product.lowStockThreshold,

    product,
  }));
  const [formData, setFormData] = useState({
    customerId: '',
    dueDate: '',
    vehicleNumber: '', // New state
    ewayBillNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const [paymentStatus, _setPaymentStatus] =
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
        const productData = await getProducts({
          page: 1,
          limit: 1000,
        }
        );

        setCustomers(customerData);
        setProducts(productData.data);
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

  // ✅ NEW: Stock check helper — returns warning info for an item, or null if OK
  const getStockWarning = (item: InvoiceItem) => {
    if (!item.productId) return null;
    const product = products.find((p) => p._id === item.productId);
    if (!product || product.stock === undefined) return null;

    if (product.stock <= 0) {
      return { level: "out", available: product.stock };
    }
    if (item.quantity > product.stock) {
      return { level: "exceeds", available: product.stock };
    }
    if (product.stock <= (product.lowStockThreshold ?? 10)) {
      return { level: "low", available: product.stock };
    }
    return null;
  };

  // ✅ NEW: Check if ANY item in the invoice exceeds available stock
  const hasStockIssue = items.some((item) => {
    const w = getStockWarning(item);
    return w?.level === "out" || w?.level === "exceeds";
  });

  const selectedCustomer =
    customers.find(
        (customer) =>
        customer._id === customerId
  );


  const handleSubmit = async () => {
    if(isSubmitting) return;

    // ✅ NEW: Stock check before submit — ask for confirmation if exceeds
    if (hasStockIssue) {
      const proceed = window.confirm(
        "⚠️ Kuch products ka stock kam hai ya khatam ho gaya hai.\n\n" +
        "Kya aap phir bhi invoice generate karna chahte hain?\n" +
        "(Stock negative ho jayega, baad mein adjust karna padega)"
      );
      if (!proceed) return;
    }

    setIsSubmitting(true);
    try {
      // Prepare invoiceDate: include current time when date is today,
      // otherwise send midnight (00:00:00) for the selected date.
      const todayStr = new Date().toISOString().split("T")[0];
      let invoiceDateToSend: string;

      if (invoiceDate === todayStr) {
        // use current exact time
        invoiceDateToSend = new Date().toISOString();
      } else {
        // construct local date at 00:00:00 for the selected day
        const [y, m, d] = invoiceDate.split("-");
        const dt = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0);
        invoiceDateToSend = dt.toISOString();
      }

      const invoice = await createInvoice({
        invoiceDate: invoiceDateToSend,
        paymentStatus,
        notes,
        customerId,
        vehicleNumber: formData.vehicleNumber,
        ewayBillNumber: formData.ewayBillNumber,

        items: items.map((item) => ({
          ...item,
          amount: item.quantity * item.price,
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
    } finally{
      setIsSubmitting(false);
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

      <div className="mx-auto w-full">

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
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Vehicle Number
                  </label>

                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicleNumber: e.target.value,
                      })
                    }
                    placeholder="HR26AB1234"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      p-3
                    "
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    E-Way Bill
                  </label>

                  <input
                    type="text"
                    value={formData.ewayBillNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ewayBillNumber: e.target.value,
                      })
                    }
                    placeholder="E-Way Bill Number"
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
            
            <Select
              options={customerOptions}
              placeholder="Search Customer..."
              value={
                customerOptions.find(
                  (c) => c.value === customerId
                ) || null
              }
              onChange={(selected) =>
                setCustomerId(selected?.value || "")
              }
              isSearchable
            />
            {/* <select
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
            </select> */}

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
            {/* <div className="mb-6">

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

                </div> */}

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
                       <Select
                        options={productOptions}
                        placeholder="Search Product..."
                        value={
                          productOptions.find(
                            (p) => p.value === item.productId
                          ) || null
                        }
                        components={{
                          Option: ProductOption,
                          SingleValue: ProductSingleValue,
                        }}
                        onChange={(selected) => {
                          if (selected) {
                            fetchPrice(index, selected.value);
                          }
                        }}
                        isSearchable

                        menuPortalTarget={document.body}
                        menuPosition="fixed"

                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                        {/* <select
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

                        </select> */}

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
                          className={`w-24 rounded-lg border p-2 ${
                            getStockWarning(item)?.level === "out" ||
                            getStockWarning(item)?.level === "exceeds"
                              ? "border-red-400 bg-red-50"
                              : getStockWarning(item)?.level === "low"
                              ? "border-amber-400 bg-amber-50"
                              : "border-slate-300"
                          }`}
                        />

                        {/* ✅ NEW: Inline stock warning */}
                        {getStockWarning(item) && (
                          <p className={`text-xs mt-1 font-medium ${
                            getStockWarning(item)?.level === "low"
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}>
                            {getStockWarning(item)?.level === "out" &&
                              "⚠️ Out of stock"}
                            {getStockWarning(item)?.level === "exceeds" &&
                              `⚠️ Only ${getStockWarning(item)?.available} available`}
                            {getStockWarning(item)?.level === "low" &&
                              `⚠️ Low stock (${getStockWarning(item)?.available} left)`}
                          </p>
                        )}

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
              !customerId || isSubmitting
            }
            className="mt-8 w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
          >
            {isSubmitting ? "Creating Invoice..." : "Create Invoice"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateInvoice;