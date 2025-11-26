import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { cart } = useCart();
  const subtotal = cart.reduce((s, p) => s + (p.price || 0), 0);

  return (
    <div className="reloved-page pt-10 grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] gap-10">
      <section className="space-y-6">
        <div className="text-[20px] md:text-2xl font-semibold tracking-[0.16em] uppercase">
          Checkout
        </div>

        {/* CONTACT INFO */}
        <div className="space-y-4">
          <div className="text-[11px] uppercase tracking-[0.25em]">
            Contact Info
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="Email"
            />
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="Phone"
            />
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="space-y-4">
          <div className="text-[11px] uppercase tracking-[0.25em]">
            Shipping Address
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="First Name"
            />
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="Last Name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="Country"
            />
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="State / Region"
            />
          </div>
          <input
            className="border border-black/10 bg-white/70 px-3 py-2 text-xs w-full outline-none"
            placeholder="Address"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="City"
            />
            <input
              className="border border-black/10 bg-white/70 px-3 py-2 outline-none"
              placeholder="Postal Code"
            />
          </div>
        </div>

        <button className="btn-minimal mt-4 w-full md:w-auto">
          Shipping →
        </button>
      </section>

      {/* ORDER SUMMARY */}
      <aside className="bg-white/80 backdrop-blur border border-black/5 p-6 space-y-4 h-fit">
        <div className="text-[11px] uppercase tracking-[0.25em] mb-2">
          Your Order
        </div>

        <div className="space-y-3 max-h-64 overflow-auto pr-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 items-center text-xs border-b border-black/5 pb-2"
            >
              <div className="w-14 aspect-[3/4] bg-[#f1f1f1] overflow-hidden">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase opacity-60">
                  Preloved
                </div>
                <div>{item.name}</div>
              </div>
              <div>${item.price}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs pt-2">
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
      </aside>
    </div>
  );
}
