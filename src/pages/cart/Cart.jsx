import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../lib/format";
import { motion } from "framer-motion";
import { api } from "../../services/api"; // Updated import

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [latestStocks, setLatestStocks] = useState({}); 
  const [loadingStocks, setLoadingStocks] = useState(true);

  useEffect(() => {
    async function fetchLatestStocks() {
      if (cart.length === 0) {
        setLoadingStocks(false);
        return;
      }

      // Extract unique IDs
      const productIds = [...new Set(cart.map(item => item.id))];
      
      // REST API: Filter using 'in' operator
      const idFilter = `(${productIds.join(',')})`;

      try {
        const data = await api.db.get("products", {
            select: "id,stock,variants",
            id: `in.${idFilter}`
        });

        if (data) {
            const stockMap = {};
            data.forEach(p => {
                stockMap[p.id] = p;
            });
            setLatestStocks(stockMap);
        }
      } catch (error) {
        console.error("Failed to fetch stocks", error);
      }
      setLoadingStocks(false);
    }

    fetchLatestStocks();
  }, [cart.length]);

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  const checkStockStatus = (item) => {
    const productData = latestStocks[item.id];
    if (!productData) return { available: 999, isEnough: true };

    let realStock = 0;
    if (item.selectedSize && productData.variants) {
       const variant = productData.variants.find(v => v.size === item.selectedSize);
       realStock = variant ? Number(variant.stock) : 0;
    } else {
       realStock = Number(productData.stock);
    }

    return {
       available: realStock,
       isEnough: realStock >= item.quantity
    };
  };

  const hasStockIssue = cart.some(item => {
     const status = checkStockStatus(item);
     return !status.isEnough;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6 pt-24 md:pt-12"
    >
      {/* Header */}
      <div className="py-10 md:py-16 border-b border-black/5 mb-10">
        <h1 className="text-5xl font-serif italic text-[#111] mb-2">Shopping Bag</h1>
        <p className="text-sm text-gray-500">
          {cart.reduce((acc, item) => acc + item.quantity, 0)} items in your bag.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-xl font-serif italic text-gray-400 mb-4">Your bag is empty.</p>
          <Link 
            to="/collections" 
            className="inline-block border-b border-black pb-0.5 text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          
          {/* Cart Items List */}
          <div className="space-y-6">
            {cart.map((item, idx) => {
              const { available, isEnough } = checkStockStatus(item);

              return (
                <div 
                  key={`${item.id}-${idx}-${item.selectedSize}`} 
                  className={`flex gap-6 p-4 bg-white rounded-xl shadow-sm transition-all border group relative
                    ${!isEnough ? "border-red-500 ring-1 ring-red-200 bg-red-50/30" : "border-transparent hover:border-gray-100"}
                  `}
                >
                  {!loadingStocks && !isEnough && (
                     <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1 z-10 shadow-sm">
                        <span>Stok Kurang! Sisa: {available}</span>
                     </div>
                  )}

                  <div className="w-24 h-32 bg-[#f0f0f0] rounded-lg overflow-hidden shrink-0 relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 uppercase tracking-widest">No Img</div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-xl text-[#111] leading-tight mb-1">
                            {item.name}
                          </h3>
                          <div className="flex gap-2 items-center text-xs text-gray-500 uppercase tracking-wider font-medium">
                             <span>{item.category}</span>
                             <span>•</span>
                             {item.selectedSize && (
                                <span className="bg-black text-white px-2 rounded-sm text-[10px]">
                                   Size: {item.selectedSize}
                                </span>
                             )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Remove"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-3 rounded-lg px-2 py-1 w-fit border ${!isEnough ? 'border-red-200 bg-white' : 'bg-gray-50 border-transparent'}`}>
                           <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                           >-</button>
                           
                           <span className={`text-xs font-bold w-4 text-center ${!isEnough ? 'text-red-600' : ''}`}>{item.quantity}</span>
                           
                           <button 
                              onClick={() => {
                                 if (item.quantity < available) {
                                    updateQuantity(item.id, item.selectedSize, 1);
                                 } else {
                                    alert(`Maksimal stok tersedia hanya ${available} item.`);
                                 }
                              }}
                              className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${item.quantity >= available ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200 text-black'}`}
                           >+</button>
                        </div>
                        {!isEnough && (
                           <span className="text-[10px] text-red-600 font-bold animate-pulse">Kurangi jumlah!</span>
                        )}
                      </div>
                      <div className="text-lg font-medium text-[#111]">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="font-serif text-2xl text-[#111] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-[#111]">Total</span>
                <span className="font-serif text-2xl text-[#111]">{formatPrice(subtotal)}</span>
              </div>
            </div>

            {hasStockIssue && (
               <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs text-center font-bold flex flex-col gap-1">
                  <span className="uppercase tracking-widest text-[10px]">Perhatian</span>
                  <span>Ada barang melebihi stok tersedia.</span>
                  <span>Mohon kurangi jumlah barang yang bertanda merah.</span>
               </div>
            )}

            <button
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0 || loadingStocks || hasStockIssue}
              className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95
                 ${(cart.length === 0 || loadingStocks || hasStockIssue) 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                    : "bg-[#111] text-white hover:bg-gray-800 shadow-black/10"
                 }
              `}
            >
              {loadingStocks ? "Checking Stock..." : hasStockIssue ? "Stock Limit Exceeded" : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}