import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function BottomNav() {
  const { cart } = useCart();

  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${
      isActive ? "text-black scale-105 font-semibold" : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white/90 backdrop-blur-lg border-t border-gray-200 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-5 h-full max-w-md mx-auto">
        
        {/* 1. HOME */}
        <NavLink to="/" end className={navClass}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[9px] uppercase tracking-widest">Home</span>
        </NavLink>

        {/* 2. COLLECTIONS */}
        <NavLink to="/collections" className={navClass}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span className="text-[9px] uppercase tracking-widest">Shop</span>
        </NavLink>

        {/* 3. CART */}
        <NavLink to="/cart" className={navClass}>
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-[14px] flex items-center justify-center bg-black text-white text-[8px] font-bold rounded-full px-1 border border-white">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-widest">Cart</span>
        </NavLink>

        {/* 4. ORDERS */}
        <NavLink to="/orders" className={navClass}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <span className="text-[9px] uppercase tracking-widest">Orders</span>
        </NavLink>

        {/* 5. HISTORY */}
        <NavLink to="/history" className={navClass}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span className="text-[9px] uppercase tracking-widest">History</span>
        </NavLink>

      </div>
    </div>
  );
}