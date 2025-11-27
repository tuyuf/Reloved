import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../lib/format";
import { supabase } from "../../lib/supabase";

export default function Checkout() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState(null);
  
  const subtotal = cart.reduce((s, p) => s + (p.price || 0), 0);
  const shippingCost = 20000;
  const total = subtotal + shippingCost;

  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "", city: "", phone: "", email: ""
  });

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  // Fungsi Validasi & Checkout
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!form.firstName || !form.address || !form.phone) return alert("Mohon lengkapi data pengiriman.");
    
    setLoading(true);

    try {
      // 1. CEK STOK TERLEBIH DAHULU
      // Kita group cart berdasarkan ID produk untuk menghitung total quantity per item
      const cartItemsMap = cart.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
      }, {});

      // Cek ke database apakah stok cukup
      for (const [productId, qty] of Object.entries(cartItemsMap)) {
        const { data: product } = await supabase
          .from('products')
          .select('stock, name')
          .eq('id', productId)
          .single();
        
        if (!product || product.stock < qty) {
          throw new Error(`Stok untuk "${product?.name || 'Produk'}" tidak mencukupi. Tersisa: ${product?.stock || 0}`);
        }
      }

      // 2. BUAT ORDER (Jika stok aman)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: `${form.firstName} ${form.lastName}`,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: `${form.address}, ${form.city}`,
          total_price: total,
          status: 'pending' 
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. MASUKKAN ORDER ITEMS & KURANGI STOK
      const itemsToInsert = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        price: item.price,
        quantity: 1 
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Panggil RPC untuk mengurangi stok (looping per jenis barang)
      for (const [productId, qty] of Object.entries(cartItemsMap)) {
        await supabase.rpc('decrement_stock', { row_id: productId, qty: qty });
      }

      // 4. SUKSES
      setSavedOrderId(orderData.id);
      setIsOrderPlaced(true);
      setCart([]); // Kosongkan keranjang
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
        <div className="py-24 bg-white rounded-xl border border-dashed border-gray-200">
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
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">✓</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-serif italic text-[#111]">Order Berhasil!</h1>
            <p className="text-sm text-gray-500">Terima kasih, {form.firstName}. Pesanan #{savedOrderId} telah dibuat.</p>
          </div>
          <div className="border-t border-b border-gray-100 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-gray-400">Total Tagihan</span>
              <span className="text-2xl font-serif text-[#111]">{formatPrice(total)}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Silakan Transfer ke:</p>
              <p className="font-bold text-[#111]">BCA 123 456 7890</p>
              <p className="text-xs text-gray-500">a.n ReLoved Official</p>
            </div>
          </div>
          <button onClick={() => { window.location.href = "/" }} className="w-full py-4 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">Kembali ke Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6 pt-8 md:pt-12">
      <h1 className="text-4xl md:text-5xl font-serif italic text-[#111] mb-10 border-b border-black/5 pb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        <section className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#111] uppercase tracking-widest text-xs mb-4">Detail Pengiriman</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nama Depan *</label>
                <input name="firstName" onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nama Belakang</label>
                <input name="lastName" onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email (Opsional)</label>
              <input name="email" onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nomor Telepon *</label>
              <input name="phone" onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="+62 812..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Alamat Lengkap *</label>
              <input name="address" onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="Jl. Sudirman No. 1..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Kota *</label>
                 <input name="city" onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="Jakarta" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Kode Pos</label>
                 <input className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition-colors" placeholder="12345" />
               </div>
            </div>
          </div>
        </section>

        <aside className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8 space-y-8">
           <div>
             <h2 className="text-lg font-bold text-[#111] uppercase tracking-widest text-xs mb-6 pb-4 border-b border-gray-100">Ringkasan Pesanan</h2>
             <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                 {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                       <div className="w-14 h-16 bg-[#f0f0f0] rounded-md overflow-hidden shrink-0 relative">
                          {item.image_url ? (
                            <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">IMG</div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111] truncate">{item.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{formatPrice(item.price)}</div>
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
                <span className="font-serif text-2xl text-[#111]">{formatPrice(total)}</span>
              </div>
           </div>
           <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-4 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-black/10 active:scale-95">
             {loading ? "Memproses..." : "Place Order"}
           </button>
           <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">Dengan menekan tombol di atas, Anda menyetujui Syarat & Ketentuan kami.</p>
        </aside>
      </div>
    </div>
  );
}