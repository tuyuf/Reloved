import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="reloved-page pt-10 grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] gap-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.25em] mb-4">
          Shopping Bag
        </div>

        {cart.length === 0 ? (
          <div className="text-xs opacity-70">
            Your bag is empty.{" "}
            <Link to="/collections" className="underline">
              Browse collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[100px_minmax(0,1fr)_auto] gap-6 items-center border-b border-black/5 pb-4"
              >
                <div className="aspect-[3/4] bg-[#f1f1f1] overflow-hidden">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] uppercase opacity-60">
                    Preloved
                  </div>
                  <div>{item.name}</div>
                  <div className="opacity-70">${item.price}</div>
                </div>
                <div className="text-right space-y-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] uppercase tracking-[0.15em] opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="bg-white/80 backdrop-blur border border-black/5 p-6 space-y-4 h-fit">
        <div className="text-[11px] uppercase tracking-[0.25em] mb-1">
          Order Summary
        </div>
        <div className="flex justify-between text-xs">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-xs opacity-70">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </div>
        <div className="border-t border-black/10 pt-3 flex justify-between text-xs font-semibold">
          <span>Total</span>
          <span>${subtotal}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          disabled={cart.length === 0}
          className="w-full btn-minimal mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </aside>
    </div>
  );
}
