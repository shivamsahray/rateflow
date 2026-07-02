import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { createPurchase } from "../services/purchaseService";
import { getVendors } from "../services/vendorService";

interface ProductOption {
  _id: string;
  name: string;
  defaultPrice: number;
  gstPercent: number;
  stock?: number;
  unit?: string;
}

interface PurchaseItem {
  productId: string;
  quantity: number;
  price: number;
  discountPercent: number;
  gstPercent: number;
}

function CreatePurchase() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: "",
    purchaseNumber: `PUR-${Date.now().toString().slice(-6)}`,
    purchaseDate: new Date().toISOString().split("T")[0],
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    warehouse: "Main Warehouse",
    notes: "",
  });
  const [items, setItems] = useState<PurchaseItem[]>([
    { productId: "", quantity: 1, price: 0, discountPercent: 0, gstPercent: 0 },
  ]);

  useEffect(() => {
    const loadData = async () => {
      const [vendorData, productData] = await Promise.all([getVendors(), getProducts()]);
      setVendors(vendorData);
      setProducts(productData);
    };

    void loadData();
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.price, 0), [items]);
  const discountAmount = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.price * item.discountPercent) / 100, 0), [items]);
  const gstAmount = useMemo(() => items.reduce((sum, item) => sum + (taxableAmountForItem(item) * item.gstPercent) / 100, 0), [items]);
  const grandTotal = useMemo(() => Number((subtotal - discountAmount + gstAmount).toFixed(2)), [subtotal, discountAmount, gstAmount]);

  function taxableAmountForItem(item: PurchaseItem) {
    const base = item.quantity * item.price;
    return base - (base * item.discountPercent) / 100;
  }

  const addRow = () => {
    setItems((prev) => [...prev, { productId: "", quantity: 1, price: 0, discountPercent: 0, gstPercent: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length === 1) {
      return;
    }
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const onProductSelect = (index: number, productId: string) => {
    const selected = products.find((product) => product._id === productId);
    if (!selected) {
      return;
    }

    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, productId, price: selected.defaultPrice, gstPercent: selected.gstPercent } : item)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    await createPurchase({
      ...formData,
      items,
    });

    navigate("/purchases");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">New Purchase Invoice</h1>
        <p className="text-sm text-slate-500">Create a purchase bill, update stock automatically, and log the movement in the stock ledger.</p>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Vendor</label>
              <select value={formData.vendorId} onChange={(event) => setFormData((prev) => ({ ...prev, vendorId: event.target.value }))} className="w-full rounded-lg border px-3 py-2" required>
                <option value="">Select vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Purchase Number</label>
              <input value={formData.purchaseNumber} onChange={(event) => setFormData((prev) => ({ ...prev, purchaseNumber: event.target.value }))} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Purchase Date</label>
              <input type="date" value={formData.purchaseDate} onChange={(event) => setFormData((prev) => ({ ...prev, purchaseDate: event.target.value }))} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Number</label>
              <input value={formData.invoiceNumber} onChange={(event) => setFormData((prev) => ({ ...prev, invoiceNumber: event.target.value }))} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Date</label>
              <input type="date" value={formData.invoiceDate} onChange={(event) => setFormData((prev) => ({ ...prev, invoiceDate: event.target.value }))} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
              <input type="date" value={formData.dueDate} onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Warehouse</label>
              <input value={formData.warehouse} onChange={(event) => setFormData((prev) => ({ ...prev, warehouse: event.target.value }))} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
              <textarea value={formData.notes} onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))} rows={2} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Items</h2>
            <button type="button" onClick={addRow} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">+ Add Row</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-2 py-2">Product</th>
                  <th className="px-2 py-2">Qty</th>
                  <th className="px-2 py-2">Purchase Price</th>
                  <th className="px-2 py-2">Discount %</th>
                  <th className="px-2 py-2">GST %</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={`${item.productId}-${index}`} className="border-t">
                    <td className="px-2 py-2">
                      <select value={item.productId} onChange={(event) => onProductSelect(index, event.target.value)} className="w-full rounded-lg border px-3 py-2" required>
                        <option value="">Select product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2"><input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, "quantity", Number(event.target.value))} className="w-24 rounded-lg border px-3 py-2" /></td>
                    <td className="px-2 py-2"><input type="number" min="0" value={item.price} onChange={(event) => updateItem(index, "price", Number(event.target.value))} className="w-32 rounded-lg border px-3 py-2" /></td>
                    <td className="px-2 py-2"><input type="number" min="0" value={item.discountPercent} onChange={(event) => updateItem(index, "discountPercent", Number(event.target.value))} className="w-24 rounded-lg border px-3 py-2" /></td>
                    <td className="px-2 py-2"><input type="number" min="0" value={item.gstPercent} onChange={(event) => updateItem(index, "gstPercent", Number(event.target.value))} className="w-24 rounded-lg border px-3 py-2" /></td>
                    <td className="px-2 py-2"><button type="button" onClick={() => removeRow(index)} className="rounded-lg bg-red-600 px-3 py-2 text-white">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex justify-end">
            <div className="w-72 space-y-2 rounded-xl border bg-slate-50 p-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>CGST</span><span>₹{(gstAmount / 2).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>SGST</span><span>₹{(gstAmount / 2).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>IGST</span><span>₹0.00</span></div>
              <hr />
              <div className="flex justify-between text-base font-semibold text-slate-800"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">
              {isSubmitting ? "Saving purchase..." : "Save Purchase"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePurchase;
