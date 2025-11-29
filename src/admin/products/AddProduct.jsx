import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const CATEGORY_OPTIONS = [
  { value: "shirt", label: "Shirt" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "outer", label: "Outer" },
  { value: "hoodie", label: "Hoodie" },
];

const PREDEFINED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "All Size"];

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    condition: "",
    category: "t-shirt",
    description: "",
  });

  const [variants, setVariants] = useState([]);
  const [tempSize, setTempSize] = useState("M");
  const [tempStock, setTempStock] = useState(1);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalStock = variants.reduce((acc, curr) => acc + Number(curr.stock), 0);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function addVariant() {
    if (!tempSize || tempStock < 0) return;
    setVariants(prev => {
      const existing = prev.findIndex(v => v.size === tempSize);
      if (existing >= 0) {
        const newVariants = [...prev];
        newVariants[existing].stock = Number(tempStock);
        return newVariants;
      }
      return [...prev, { size: tempSize, stock: Number(tempStock) }];
    });
  }

  function removeVariant(sizeToDelete) {
    setVariants(prev => prev.filter(v => v.size !== sizeToDelete));
  }

  async function uploadImage() {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `product_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error(uploadError);
      alert("Gagal upload gambar");
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Nama dan harga wajib diisi");
    if (variants.length === 0) return alert("Wajib memasukkan minimal satu ukuran dan stok.");

    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage();

      const { error } = await supabase.from("products").insert({
        name: form.name,
        price: Number(form.price),
        condition: form.condition || null,
        category: form.category,
        description: form.description || null,
        stock: totalStock,
        variants: variants,
        image_url: imageUrl,
      });

      if (error) alert("Gagal menyimpan produk: " + error.message);
      else navigate("/admin/products");
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Container utama tanpa fixed height agar bisa di-scroll
    <div className="w-full pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl tracking-[0.35em] uppercase">Add New Product</h1>
          <p className="text-xs text-black/50 mt-2">Atur stok berdasarkan ukuran.</p>
        </div>
        <button onClick={() => navigate("/admin/products")} className="px-6 h-10 rounded-full border border-black/10 text-xs tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors">Back</button>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} className="col-span-12 lg:col-span-7 bg-white border border-black/5 rounded-[32px] p-8 space-y-8 shadow-sm">
          <div className="space-y-5">
             <div className="space-y-2">
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Product Name</label>
               <input className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all" placeholder="e.g. Vintage Nike Tee" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
             </div>

             <div className="space-y-2">
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Price (IDR)</label>
               <input type="number" className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all" placeholder="150000" value={form.price} onChange={(e) => updateField("price", e.target.value)} min={0} />
             </div>
          </div>

          {/* VARIANT & STOCK MANAGEMENT */}
          <div className="bg-[#FAFAFA] p-6 rounded-[24px] border border-gray-200 space-y-6">
             <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex flex-col">
                   <label className="text-xs font-bold uppercase tracking-widest text-gray-800">Stock Variants</label>
                   <span className="text-[10px] text-gray-400 mt-0.5">Manage available sizes & quantity</span>
                </div>
                <span className="text-xs font-medium bg-black text-white px-3 py-1.5 rounded-full shadow-sm">Total: {totalStock} pcs</span>
             </div>
             
             <div className="flex gap-4 items-end">
                <div className="space-y-1.5 flex-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Size</label>
                   <select value={tempSize} onChange={(e) => setTempSize(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-black transition-colors">
                      {PREDEFINED_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
                <div className="space-y-1.5 w-32">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quantity</label>
                   <input type="number" min="1" value={tempStock} onChange={(e) => setTempStock(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <button type="button" onClick={addVariant} className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md active:scale-95 h-[42px]">Add</button>
             </div>

             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 border-b border-gray-200">
                   <div>Size</div>
                   <div className="text-center">Stock</div>
                   <div className="text-right">Action</div>
                </div>
                {variants.length === 0 ? (
                   <div className="p-8 text-center text-gray-400 text-xs italic flex flex-col items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">!</span>
                      No sizes added yet.
                   </div>
                ) : (
                   <div className="divide-y divide-gray-100">
                      {variants.map((v, idx) => (
                         <div key={idx} className="grid grid-cols-3 px-4 py-3 items-center hover:bg-gray-50/50 transition-colors">
                            <div><span className="inline-block min-w-[30px] text-center py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-700 border border-gray-200">{v.size}</span></div>
                            <div className="text-center text-sm font-medium text-gray-700">{v.stock} pcs</div>
                            <div className="text-right"><button type="button" onClick={() => removeVariant(v.size)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">×</button></div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Category</label>
               <select className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all" value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                 {CATEGORY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
               </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Condition</label>
                <input className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all" value={form.condition} onChange={(e) => updateField("condition", e.target.value)} placeholder="Very Good / Like New" />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Description</label>
            <textarea className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all min-h-[120px]" value={form.description} onChange={(e) => updateField("description", e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50">
            {loading ? "Saving..." : "Create Product"}
          </button>
        </form>

        {/* PREVIEW & IMAGE UPLOAD */}
        <div className="col-span-12 lg:col-span-5 space-y-6 sticky top-8">
           <div className="bg-white border border-black/5 rounded-[32px] p-6 space-y-4 shadow-sm">
             <div className="text-[10px] tracking-[0.25em] uppercase text-black/40 font-bold">Preview Card</div>
             <div className="border border-black/5 rounded-[24px] overflow-hidden bg-[#F9F9F9] aspect-[3/4] relative group cursor-default">
               {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                     <span className="text-[10px] uppercase tracking-widest">No Image</span>
                  </div>
               )}
               
               <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-4 border-t border-gray-100">
                  <div className="text-xs uppercase font-bold tracking-widest mb-1">{form.name || "Product Name"}</div>
                  <div className="flex justify-between items-end">
                     <div className="text-[10px] text-gray-500">{Number(form.price).toLocaleString()} IDR</div>
                     {variants.length > 0 && (
                        <div className="flex gap-1">
                           {variants.slice(0,3).map(v => <span key={v.size} className="text-[8px] bg-gray-100 px-1 py-0.5 rounded border border-gray-200">{v.size}</span>)}
                           {variants.length > 3 && <span className="text-[8px] text-gray-400">+{variants.length - 3}</span>}
                        </div>
                     )}
                  </div>
               </div>
             </div>
             
             <div className="space-y-2 pt-2">
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-400">Upload Image</label>
               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                     <p className="text-xs text-gray-400"><span className="font-semibold text-gray-600">Click to upload</span></p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
               </label>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}