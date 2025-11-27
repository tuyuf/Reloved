import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../lib/format";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext"; // Import useUser

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { user } = useUser(); // Cek status login

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  // Helper function untuk mendapatkan stok yang tersedia berdasarkan varian/size
  const getAvailableStock = (item) => {
    // Jika item memiliki varian (sistem baru)
    if (item.variants && item.variants.length > 0 && item.selectedSize) {
      const variant = item.variants.find((v) => v.size === item.selectedSize);
      return variant ? Number(variant.stock) : 0;
    }
    // Jika item menggunakan stok global (sistem lama)
    return Number(item.stock) || 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6"
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
              const currentStock = getAvailableStock(item);
              const isMaxStockReached = item.quantity >= currentStock;

              return (
                <div 
                  key={`${item.id}-${idx}-${item.selectedSize}`} 
                  className="flex gap-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-100 group"
                >
                  {/* Image */}
                  <div className="w-24 h-32 bg-[#f0f0f0] rounded-lg overflow-hidden shrink-0 relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 uppercase tracking-widest">No Img</div>
                    )}
                  </div>

                  {/* Details */}
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
                      {/* Quantity Control di Cart */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 w-fit">
                           <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                           >-</button>
                           
                           <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                           
                           <button 
                              onClick={() => {
                                if (!isMaxStockReached) {
                                  updateQuantity(item.id, item.selectedSize, 1);
                                }
                              }}
                              disabled={isMaxStockReached}
                              className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                                isMaxStockReached 
                                  ? "text-gray-300 cursor-not-allowed" 
                                  : "hover:bg-gray-200 text-black"
                              }`}
                           >+</button>
                        </div>
                        {isMaxStockReached && (
                          <span className="text-[9px] text-red-500 font-medium ml-1">
                            Max stok: {currentStock}
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-medium text-[#111]">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
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

            <button
              onClick={() => {
                if (!user) {
                  navigate("/auth/login");
                } else {
                  navigate("/checkout");
                }
              }}
              className="w-full bg-[#111] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
            >
              {user ? "Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}