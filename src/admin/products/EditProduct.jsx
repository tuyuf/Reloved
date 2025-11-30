import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { uploadProductImage } from "../../lib/uploadImage";
import { useUser } from "../../context/UserContext";

const CATEGORY_OPTIONS = [
  { value: "shirt", label: "Shirt" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "outer", label: "Outer" },
  { value: "hoodie", label: "Hoodie" },
];

const PREDEFINED_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "All Size"];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useUser();
  const [form, setForm] = useState(null);
  
  const [variants, setVariants] = useState([]);
  const [tempSize, setTempSize] = useState("M");
  const [tempStock, setTempStock] = useState(1);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const totalStock = variants.reduce((acc, curr) => acc + Number(curr.stock), 0);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    async function loadProduct() {
      if (!token) return;
      try {
        const data = await api.db.get("products", { id: `eq.${id}`, select: "*" }, token);
        if (data && data.length > 0) {
            const product = data[0];
            setForm({
                ...product,
                price: product.price ?? "",
            });
            setVariants(product.variants || []);
            setPreview(product.image_url || null);
        } else {
            navigate("/admin/products");
        }
      } catch (e) {
        console.error(e);
        navigate("/admin/products");
      }
      setLoading(false);
    }
    loadProduct();
  }, [id, navigate, token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Nama dan harga wajib diisi");
    
    if (variants.length === 0) {
       alert("Minimal harus ada satu ukuran dengan stok.");
       return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image_url || null;
      if (imageFile) imageUrl = await uploadProductImage(imageFile);

      const payload = {
        name: form.name,
        price: Number(form.price),
        condition: form.condition || null,
        category: form.category || null,
        description: form.description || null,
        stock: totalStock, 
        variants: variants, 
        image_url: imageUrl,
      };

      await api.db.update("products", id, payload, token);
      navigate("/admin/products");
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <div className="reloved-page py-10 text-center">Loading...</div>;

  return (
    <div className="reloved-page space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl tracking-[0.35em] uppercase">Edit Product</h1>
        <button onClick={() => navigate("/admin/products")} className="px-6 h-10 rounded-full border border-black/10 text-xs tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors">Back</button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <form onSubmit={handleSubmit} className="col-span-12 md:col-span-7 bg-white border border-black/5 rounded-[32px] p-8 space-y-8 shadow-sm">
          <div className="space-y-5">
             <div className="space-y-2">
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Name</label>
               <input className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Price</label>
               <input type="number" className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
             </div>
          </div>

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
                      No sizes added yet. Use the form above.
                   </div>
                ) : (
                   <div className="divide-y divide-gray-100">
                      {variants.map((v, idx) => (
                         <div key={idx} className="grid grid-cols-3 px-4 py-3 items-center hover:bg-gray-50/50 transition-colors">
                            <div>
                               <span className="inline-block min-w-[30px] text-center py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-700 border border-gray-200">{v.size}</span>
                            </div>
                            <div className="text-center text-sm font-medium text-gray-700">{v.stock} pcs</div>
                            <div className="text-right">
                               <button type="button" onClick={() => removeVariant(v.size)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors group" title="Remove">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                               </button>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500">Description</label>
            <textarea className="w-full border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all min-h-[120px]" value={form.description || ""} onChange={(e) => updateField("description", e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="w-full h-12 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50">Save Changes</button>
        </form>

        <div className="col-span-12 md:col-span-5 space-y-6">
           <div className="bg-white border border-black/5 rounded-[32px] p-6 space-y-4 shadow-sm sticky top-8">
             <div className="text-[10px] tracking-[0.25em] uppercase text-black/40 font-bold">Preview Card</div>
             <div className="border border-black/5 rounded-[24px] overflow-hidden bg-[#F9F9F9] aspect-[3/4] relative group cursor-default">
               {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
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
               <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-400">Change Image</label>
               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                     <svg className="w-8 h-8 mb-2 text-gray-300 group-hover:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
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