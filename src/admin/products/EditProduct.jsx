// src/admin/products/EditProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase, uploadProductImage } from "../../lib/supabase";

const CATEGORY_OPTIONS = [
  { value: "shirt", label: "Shirt" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "outer", label: "Outer" },
  { value: "hoodie", label: "Hoodie" },
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert("Produk tidak ditemukan");
        navigate("/admin/products");
        return;
      }

      setForm({
        ...data,
        price: data.price ?? "",
        stock: data.stock ?? 0,
      });
      setPreview(data.image_url || null);
      setLoading(false);
    }

    loadProduct();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Nama dan harga wajib diisi");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image_url || null;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        condition: form.condition || null,
        category: form.category || null,
        description: form.description || null,
        stock: Number(form.stock) || 0,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Gagal menyimpan perubahan");
      } else {
        navigate("/admin/products");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <div className="reloved-page py-10 text-center text-xs tracking-[0.2em] uppercase text-black/40">
        Loading product…
      </div>
    );
  }

  return (
    <div className="reloved-page space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl tracking-[0.35em] uppercase">
            Edit Product
          </h1>
          <p className="text-xs text-black/50 mt-2">
            Perbarui detail produk preloved.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products")}
          className="px-6 h-10 rounded-full border border-black/10 text-xs tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <form
          onSubmit={handleSubmit}
          className="col-span-12 md:col-span-7 bg-white border border-black/5 rounded-[32px] p-6 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] uppercase">
              Product Name
            </label>
            <input
              className="w-full border border-black/10 rounded-[18px] px-4 py-3 text-xs outline-none focus:border-black"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.25em] uppercase">
                Price (IDR)
              </label>
              <input
                type="number"
                className="w-full border border-black/10 rounded-[18px] px-4 py-3 text-xs outline-none focus:border-black"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.25em] uppercase">
                Stock
              </label>
              <input
                type="number"
                className="w-full border border-black/10 rounded-[18px] px-4 py-3 text-xs outline-none focus:border-black"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.25em] uppercase">
                Condition
              </label>
              <input
                className="w-full border border-black/10 rounded-[18px] px-4 py-3 text-xs outline-none focus:border-black"
                value={form.condition || ""}
                onChange={(e) => updateField("condition", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] uppercase">
              Category
            </label>
            <select
              className="w-full border border-black/10 rounded-[18px] px-4 py-3 text-xs outline-none focus:border-black bg-white"
              value={form.category || ""}
              onChange={(e) => updateField("category", e.target.value)}
            >
              <option value="">Pilih kategori</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] uppercase">
              Description
            </label>
            <textarea
              className="w-full border border-black/10 rounded-[18px] px-4 py-3 text-xs outline-none focus:border-black min-h-[120px]"
              value={form.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-10 h-10 rounded-full border border-black bg-black text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="col-span-12 md:col-span-5 bg-white border border-black/5 rounded-[32px] p-6 space-y-4">
          <div className="text-[10px] tracking-[0.25em] uppercase text-black/60">
            Preview
          </div>

          <div className="border border-black/5 rounded-[24px] overflow-hidden bg-[#f5f5f5]">
            <div className="aspect-[3/4] bg-white flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-black/40 tracking-[0.25em] uppercase">
                  No Image
                </span>
              )}
            </div>
            <div className="p-4 space-y-1">
              <div className="text-[10px] text-black/40 uppercase tracking-[0.25em]">
                {form.condition || "Condition"}
              </div>
              <div className="text-xs uppercase tracking-[0.25em]">
                {form.name || "Product Name"}
              </div>
              <div className="text-[11px] text-black/70">
                {form.price
                  ? `IDR ${Number(form.price).toLocaleString()}`
                  : "-"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] uppercase">
              Change Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-[11px]"
            />
            <p className="text-[10px] text-black/40">
              Jika tidak memilih gambar baru, gambar lama akan dipakai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
