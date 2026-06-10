import { useEffect, useState } from "react";
import axios from "axios";

function Stock() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/stock", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data));
  }, []);

  const updateStock = async (id: any, quantity: any, type = "add") => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `http://localhost:5000/api/stock/${id}`,
      { quantity: Number(quantity), type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // refresh
    const res = await axios.get("http://localhost:5000/api/stock", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Stock</h1>
      <p className="text-gray-500 mb-8">Manage your product inventory</p>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Unit</th>
              <th className="px-6 py-4 text-left">Current Stock</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Add Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-gray-500">{p.unit}</td>
                <td className="px-6 py-4 font-bold">{p.stock}</td>
                <td className="px-6 py-4">
                  {p.stock <= 0 ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                      Out of Stock
                    </span>
                  ) : p.stock <= p.lowStockThreshold ? (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                      Low Stock
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="border rounded px-2 py-1 w-20 text-sm"
                      id={`qty-${p._id}`}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`qty-${p._id}`) as HTMLInputElement;
                        updateStock(p._id, input.value, "add");
                        input.value = "";
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Add
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stock;