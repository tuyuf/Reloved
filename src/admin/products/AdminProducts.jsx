// src/admin/products/AdminProducts.jsx
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
    <div className="reloved-page space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl tracking-[0.35em] uppercase">Products</h1>
          <p className="text-xs text-black/50 mt-2">
            Kelola daftar barang preloved yang tampil di ReLoved.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="px-6 h-10 rounded-full border border-black bg-black text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Table / cards */}
      <div className="bg-white border border-black/5 rounded-[32px] p-6 shadow-sm">
        {loading ? (
          <div className="py-10 text-center text-xs tracking-[0.2em] uppercase text-black/40">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="py-10 text-center text-xs tracking-[0.2em] uppercase text-black/40">
            Belum ada produk. Tambahkan produk pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] tracking-[0.2em] uppercase text-black/50 border-b border-black/5">
                  <th className="py-3 text-left">Product</th>
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-left">Condition</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Stock</th>
                  <th className="py-3 text-left">Created</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-black/5 last:border-none"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-14 h-16 object-cover rounded-md border border-black/5"
                          />
                        )}
                        <div>
                          <div className="uppercase tracking-[0.2em] text-[11px]">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-black/50 mt-1 line-clamp-1">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-[11px]">
                      {CATEGORY_LABEL[p.category] || p.category || "-"}
                    </td>
                    <td className="py-4 text-[11px]">{p.condition || "-"}</td>
                    <td className="py-4 text-[11px]">{formatPrice(p.price)}</td>
                    <td className="py-4 text-[11px]">{p.stock ?? 0}</td>
                    <td className="py-4 text-[11px]">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/products/edit/${p.id}`)
                          }
                          className="px-4 h-8 rounded-full border border-black/20 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="px-4 h-8 rounded-full border border-black/10 text-[10px] tracking-[0.2em] uppercase text-black/60 hover:bg-black/5 disabled:opacity-40"
                        >
                          {deletingId === p.id ? "Deleting…" : "Delete"}
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
