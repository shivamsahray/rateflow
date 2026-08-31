import { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import EmptyState from "../components/ui/EmptyState";
import TableSkeleton from "../components/ui/TableSkeleton";
import API_URL from "../config/api";

const STOCK_STATUS_OPTIONS = {
  all: "All",
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
} as const;

type StockStatus = keyof typeof STOCK_STATUS_OPTIONS;

const getStockStatus = (product: any) => {
  if ((product.stock ?? 0) <= 0) return "Out of Stock";
  if ((product.stock ?? 0) <= (product.lowStockThreshold ?? 0)) return "Low Stock";
  return "In Stock";
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
  },
  cell: {
    fontSize: 9,
    width: "22%",
    color: "#0f172a",
  },
  header: {
    fontSize: 9,
    fontWeight: 700,
    color: "#475569",
    width: "22%",
  },
});

const StockReportPDF = ({ products }: { products: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>RateFlow Stock Report</Text>
      <Text style={styles.subtitle}>{new Date().toLocaleDateString("en-IN")}</Text>

      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <Text style={styles.header}>Product</Text>
        <Text style={styles.header}>SKU</Text>
        <Text style={styles.header}>Stock</Text>
        <Text style={styles.header}>Threshold</Text>
        <Text style={styles.header}>Status</Text>
      </View>

      {products.map((product: any, index: number) => (
        <View key={product._id || index} style={styles.row}>
          <Text style={styles.cell}>{product.name}</Text>
          <Text style={styles.cell}>{product.sku || "—"}</Text>
          <Text style={styles.cell}>{product.stock ?? 0}</Text>
          <Text style={styles.cell}>{product.lowStockThreshold ?? 0}</Text>
          <Text style={styles.cell}>{getStockStatus(product)}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

function Stock() {
  const [products, setProducts] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockStatus, setStockStatus] = useState<StockStatus>("all");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const loadData = async (nextSearch = searchTerm, nextStatus = stockStatus) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const [stockRes, ledgerRes] = await Promise.all([
        axios.get(`${API_URL}/stock`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: nextSearch,
            stockStatus: nextStatus,
          },
        }),
        axios.get(`${API_URL}/stock/ledger`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(stockRes.data || []);
      setLedger(ledgerRes.data || []);
    } catch (err: any) {
      setProducts([]);
      setLedger([]);
      setError(err?.response?.data?.message || "Unable to load stock data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData(searchTerm, stockStatus);
  }, [searchTerm, stockStatus]);

  const updateStock = async (id: string, quantity: string, type = "add") => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `${API_URL}/stock/${id}`,
      { quantity: Number(quantity), type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await loadData(searchTerm, stockStatus);
  };

  const downloadExcel = () => {
    const sheetRows = products.map((product: any) => ({
      "Product Name": product.name,
      SKU: product.sku || "",
      Unit: product.unit || "",
      "Current Stock": product.stock ?? 0,
      "Low Stock Threshold": product.lowStockThreshold ?? 0,
      Status: getStockStatus(product),
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");
    XLSX.writeFile(workbook, `rateflow-stock-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setExportMenuOpen(false);
  };

  return (
    <div className="mx-auto w-full p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Stock</h1>
          <p className="mt-1 text-gray-500">Manage your product inventory and view stock movement history.</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setExportMenuOpen((prev) => !prev)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Export Report
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={downloadExcel}
                className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Excel (.xlsx)
              </button>

              <PDFDownloadLink
                document={<StockReportPDF products={products} />}
                fileName={`rateflow-stock-report-${new Date().toISOString().slice(0, 10)}.pdf`}
              >
                {({ loading }) => (
                  <span
                    className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setExportMenuOpen(false)}
                  >
                    {loading ? "Preparing PDF..." : "PDF (.pdf)"}
                  </span>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <TableSkeleton rows={5} columns={5} />
          <TableSkeleton rows={4} columns={5} />
        </div>
      ) : error ? (
        <EmptyState
          title="We couldn't load stock data"
          description={error}
          actionLabel="Try again"
          onAction={() => void loadData(searchTerm, stockStatus)}
          variant="error"
        />
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 1110.89 3.45l4.4 4.4a1 1 0 01-1.42 1.42l-4.4-4.4A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search product by name or SKU"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="min-w-[180px]">
              <select
                value={stockStatus}
                onChange={(event) => setStockStatus(event.target.value as StockStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                {Object.entries(STOCK_STATUS_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {searchTerm || stockStatus !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStockStatus("all");
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">SKU</th>
                  <th className="px-6 py-4 text-left">Unit</th>
                  <th className="px-6 py-4 text-left">Current Stock</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Add Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10">
                      <EmptyState
                        title="No matching stock items found"
                        description="Try changing the search term or stock status to see more inventory."
                      />
                    </td>
                  </tr>
                ) : products.map((p: any) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.sku || "—"}</td>
                    <td className="px-6 py-4 text-gray-500">{p.unit}</td>
                    <td className="px-6 py-4 font-bold">{p.stock}</td>
                    <td className="px-6 py-4">
                      {getStockStatus(p) === "Out of Stock" ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Out of Stock</span>
                      ) : getStockStatus(p) === "Low Stock" ? (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">Low Stock</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input type="number" placeholder="Qty" className="w-20 rounded border px-2 py-1 text-sm" id={`qty-${p._id}`} />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`qty-${p._id}`) as HTMLInputElement;
                            void updateStock(p._id, input.value, "add");
                            input.value = "";
                          }}
                          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
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

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-gray-800">Stock Ledger</h2>
            {ledger.length === 0 ? (
              <EmptyState
                title="No ledger entries yet"
                description="Stock movement history will appear here after inventory changes are recorded."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((entry) => (
                      <tr key={entry._id} className="border-t">
                        <td className="px-3 py-2">{new Date(entry.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2">{entry.productId?.name || "—"}</td>
                        <td className="px-3 py-2">{entry.type}</td>
                        <td className="px-3 py-2">{entry.quantity}</td>
                        <td className="px-3 py-2">{entry.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Stock;