import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function CartSidebar({ onClose }) {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [latestStocks, setLatestStocks] = useState({});
  const [loadingStocks, setLoadingStocks] = useState(true);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
  const tax = subtotal * 0.11; 
  const total = subtotal + tax;

  // Cek stok real-time mirip Cart.jsx
  useEffect(() => {
    async function fetchLatestStocks() {
      if (cart.length === 0) {
        setLoadingStocks(false);
        return;
      }
      const productIds = [...new Set(cart.map(item => item.id))];
      const { data } = await supabase.from('products').select('id, stock, variants').in('id', productIds);
      if (data) {
        const stockMap = {};
        data.forEach(p => stockMap[p.id] = p);
        setLatestStocks(stockMap);
      }
      setLoadingStocks(false);
    }
    fetchLatestStocks();
  }, [cart]);

  // Validasi
  const hasStockIssue = cart.some(item => {
     const productData = latestStocks[item.id];
     if (!productData) return false;
     
     let realStock = 0;
     if (item.selectedSize && productData.variants) {
        const variant = productData.variants.find(v => v.size === item.selectedSize);
        realStock = variant ? Number(variant.stock) : 0;
     } else {
        realStock = Number(productData.stock);
     }
     return item.quantity > realStock;
  });

  return (
    <aside className="h-full flex flex-col w-full md:w-96 bg-white border-l border-gray-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-bold text-lg">Order Summary</h2>
        <span className="text-xs bg-black text-white px-2 py-1 rounded-full">{cart.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">No items yet.</div>
        ) : (
          cart.map((item, idx) => {
             // Logic cek stok per item untuk UI merah
             const productData = latestStocks[item.id];
             let isEnough = true;
             let available = 999;
             
             if (productData) {
                if (item.selectedSize && productData.variants) {
                   const variant = productData.variants.find(v => v.size === item.selectedSize);
                   available = variant ? Number(variant.stock) : 0;
                } else {
                   available = Number(productData.stock);
                }
                isEnough = item.quantity <= available;
             }

             return (
                <div key={`${item.id}-${idx}`} className={`flex gap-3 items-start p-3 bg-gray-50 rounded-xl border ${!isEnough ? 'border-red-300 bg-red-50' : 'border-transparent'}`}>
                  <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 relative">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                       {item.quantity} x {formatPrice(item.price)} 
                       {item.selectedSize && <span className="font-bold ml-1">({item.selectedSize})</span>}
                    </p>
                    {!isEnough && <p className="text-[9px] text-red-600 font-bold mt-1">Stok kurang! Max: {available}</p>}
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-gray-300 hover:text-red-500 transition-colors">×</button>
                </div>
             )
          })
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-800 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {hasStockIssue && (
           <div className="text-[10px] text-red-600 text-center font-bold bg-red-50 p-2 rounded">
              Stok tidak cukup. Cek keranjang Anda.
           </div>
        )}

        <button 
          onClick={() => { onClose(); navigate("/checkout"); }}
          disabled={cart.length === 0 || hasStockIssue}
          className={`w-full py-3.5 rounded-xl font-bold text-sm mt-4 transition-colors shadow-lg
             ${(cart.length === 0 || hasStockIssue) 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-black text-white hover:bg-gray-800"
             }
          `}
        >
          Check Out
        </button>
      </div>
    </aside>
  );
}