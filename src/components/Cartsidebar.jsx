// src/components/CartSidebar.jsx
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0), 0);
  const tax = subtotal * 0.11; // Contoh pajak/service
  const total = subtotal + tax;

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-white border-l border-gray-100 h-screen sticky top-0 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-bold text-lg">Order Summary</h2>
        <span className="text-xs bg-black text-white px-2 py-1 rounded-full">{cart.length}</span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            No items yet.
          </div>
        ) : (
          cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{formatPrice(item.price)}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Totals & Checkout */}
      <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Tax (11%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-800 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button 
          onClick={() => navigate("/checkout")}
          disabled={cart.length === 0}
          className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
        >
          Check Out
        </button>
      </div>
    </aside>
  );
}