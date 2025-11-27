import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { formatPrice, formatDate } from "../../lib/format";

const CATEGORY_LABEL = {
  shirt: "Shirt",
  "t-shirt": "T-Shirt",
  outer: "Outer",
  hoodie: "Hoodie",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data produk");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Yakin hapus produk ini?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Gagal menghapus produk");
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-black/5 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#111]">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola inventaris toko Anda.</p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400 italic font-serif">Loading inventory...</div>
        ) : products.length === 0 ? (
          <div className="p-20 text-center text-gray-400">Belum ada produk.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${p.stock === 0 ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded border border-gray-200 text-[10px] uppercase font-bold text-gray-500 bg-white">
                        {CATEGORY_LABEL[p.category] || p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-serif text-gray-900">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4">
                      {p.stock === 0 ? (
                        <span className="text-red-600 text-[10px] font-bold uppercase tracking-wider bg-red-100 px-2 py-1 rounded border border-red-200">
                          Out of Stock
                        </span>
                      ) : (
                        <span className={`text-xs font-bold ${p.stock < 5 ? 'text-orange-500' : 'text-gray-600'}`}>
                          {p.stock} in stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                          className="text-xs font-medium text-gray-600 hover:text-black px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
                        >
                          {deletingId === p.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}