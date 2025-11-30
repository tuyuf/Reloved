import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext"; 
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../lib/format";
import { api } from "../../services/api";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  
  const subtotal = cart.reduce((s, item) => s + (Number(item.price) * (item.quantity || 1)), 0);
  const shippingCost = 20000;
  const total = subtotal + shippingCost;

  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "", city: "", phone: "", email: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        address: user.user_metadata?.address || "",
        city: user.user_metadata?.city || "",
        phone: user.user_metadata?.phone || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!form.firstName || !form.address || !form.phone) return alert("Mohon lengkapi data pengiriman.");
    
    setLoading(true);

    try {
      const updatesMap = new Map();

      for (const item of cart) {
         let productData = updatesMap.get(item.id)?.productData;
         
         if (!productData) {
            const products = await api.db.get('products', { id: `eq.${item.id}`, select: '*' });
            if (!products || products.length === 0) throw new Error(`Produk "${item.name}" tidak ditemukan.`);
            productData = products[0];
         }

         if (productData.variants && productData.variants.length > 0) {
            const currentVariants = updatesMap.get(item.id)?.newVariants || productData.variants;
            const variantIndex = currentVariants.findIndex(v => v.size === item.selectedSize);
            
            if (variantIndex === -1) throw new Error(`Size ${item.selectedSize} untuk "${item.name}" tidak lagi tersedia.`);
            
            const variant = currentVariants[variantIndex];
            
            if (variant.stock < item.quantity) {
               throw new Error(`Stok "${item.name}" (Size ${item.selectedSize}) tidak cukup. Sisa: ${variant.stock}`);
            }

            const newVariants = [...currentVariants];
            newVariants[variantIndex] = { 
               ...newVariants[variantIndex], 
               stock: newVariants[variantIndex].stock - item.quantity 
            };
            
            const newTotalStock = newVariants.reduce((acc, v) => acc + Number(v.stock), 0);
            updatesMap.set(item.id, { productData, newVariants, newTotalStock });

         } else {
            let currentStock = updatesMap.get(item.id)?.newTotalStock ?? productData.stock;
            if (currentStock < item.quantity) {
               throw new Error(`Stok "${item.name}" habis.`);
            }
            updatesMap.set(item.id, { 
               productData, 
               newVariants: null, 
               newTotalStock: currentStock - item.quantity 
            });
         }
      }

      const insertedOrder = await api.db.insert('orders', {
          user_id: user?.id || null,
          customer_name: `${form.firstName} ${form.lastName}`,
          customer_email: form.email, 
          customer_phone: form.phone,
          shipping_address: `${form.address}, ${form.city}`,
          total_price: total,
          status: 'pending' 
      }, token);

      const orderId = insertedOrder[0].id;

      const itemsToInsert = cart.map(item => ({
        order_id: orderId,
        product_id: item.id,
        price: Number(item.price),
        quantity: item.quantity,
        size: item.selectedSize
      }));

      await api.db.insert('order_items', itemsToInsert, token);

      for (const [productId, updateData] of updatesMap.entries()) {
         const { newVariants, newTotalStock } = updateData;
         const payload = { stock: newTotalStock };
         if (newVariants) payload.variants = newVariants;
         
         await api.db.update('products', productId, payload, token);
      }

      setSavedOrderId(orderId);
      setFinalTotal(total);
      setIsOrderPlaced(true);
      
      await clearCart(); 
      
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error(err);
      alert("Gagal checkout: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6 pt-32 text-center">
        <div className="py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-xl font-serif italic text-gray-400 mb-4">Keranjang Anda kosong.</p>
          <button onClick={() => navigate("/collections")} className="inline-block border-b border-black pb-0.5 text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="w-full max-w-[600px] mx-auto pb-20 px-4 sm:px-6 pt-20 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">✓</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-serif italic text-[#111]">Order Berhasil!</h1>
            <p className="text-sm text-gray-500">Terima kasih, {form.firstName}. Pesanan #{savedOrderId} telah dibuat.</p>
          </div>
          <div className="border-t border-b border-gray-100 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Total Tagihan</span>
              <span className="text-2xl font-serif text-[#111]">{formatPrice(finalTotal)}</span>
            </div>
            <div className="bg-[#F9F9F9] p-5 rounded-2xl text-left space-y-1 border border-gray-100">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Silakan Transfer ke:</p>
              <p className="font-bold text-[#111] text-lg">BCA 123 456 7890</p>
              <p className="text-xs text-gray-500">a.n ReLoved Official</p>
            </div>
          </div>
          {/* FIXED: Uses navigate() instead of window.location.href to prevent context crash */}
          <button 
            onClick={() => navigate("/")} 
            className="w-full py-4 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6 pt-8 md:pt-12">
      <h1 className="text-4xl md:text-5xl font-serif italic text-[#111] mb-10 border-b border-black/5 pb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
        
        <section className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div>
               <h2 className="text-lg font-bold text-[#111] uppercase tracking-widest text-xs mb-1">Detail Pengiriman</h2>
               <p className="text-xs text-gray-400">Masukkan alamat pengiriman Anda dengan lengkap.</p>
            </div>
            
            {user && (
               <div className="text-xs text-green-700 bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <div>
                    Logged in as <span className="font-bold">{user.email}</span>. 
                    <div className="text-[10px] opacity-80 mt-0.5">Data diri Anda telah diisi otomatis dari profil.</div>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nama Depan *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nama Belakang</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300" placeholder="Doe" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email (Opsional)</label>
                 <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300" placeholder="john@example.com" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nomor Telepon *</label>
                 <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300" placeholder="+62 812..." />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Alamat Lengkap *</label>
              <textarea rows="3" name="address" value={form.address} onChange={handleChange} className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300 resize-none" placeholder="Jl. Sudirman No. 1..." />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Kota *</label>
                 <input name="city" value={form.city} onChange={handleChange} className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300" placeholder="Jakarta" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Kode Pos</label>
                 <input className="w-full bg-[#F9F9F9] border-transparent focus:bg-white border focus:border-black px-4 py-3.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-300" placeholder="12345" />
               </div>
            </div>
          </div>
        </section>

        <aside className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8 space-y-8">
           <div>
             <h2 className="text-lg font-bold text-[#111] uppercase tracking-widest text-xs mb-6 pb-4 border-b border-gray-100">Ringkasan Pesanan</h2>
             <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}-${item.selectedSize}`} className="flex gap-4 items-start">
                       <div className="w-16 h-20 bg-[#f4f4f4] rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                          {item.image_url ? (
                            <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">IMG</div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0 py-1">
                          <div className="text-sm font-bold text-[#111] truncate font-serif leading-tight">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1 mb-2 flex items-center gap-2">
                             <span>{item.category}</span>
                             {item.selectedSize && (
                                <>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="text-black font-bold bg-gray-100 px-1.5 rounded text-[10px]">Size {item.selectedSize}</span>
                                </>
                             )}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                             {item.quantity} x {formatPrice(item.price)}
                          </div>
                       </div>
                    </div>
                 ))}
             </div>
           </div>
           
           <div className="space-y-3 pt-6 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Pengiriman (Flat)</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-bold text-[#111]">Total</span>
                <span className="font-serif text-3xl text-[#111]">{formatPrice(total)}</span>
              </div>
           </div>
           
           <button 
             onClick={handlePlaceOrder} 
             disabled={loading} 
             className="w-full py-4 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 shadow-xl shadow-black/10 active:scale-[0.98]"
           >
             {loading ? "Memproses..." : "Place Order"}
           </button>
           
           <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
             Dengan menekan tombol di atas, Anda menyetujui Syarat & Ketentuan kami.
           </p>
        </aside>
      </div>
    </div>
  );
}