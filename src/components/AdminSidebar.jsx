import { NavLink, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext"; 

export default function AdminSidebar() {
  const { logoutAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/"); 
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
      isActive 
        ? "bg-black text-white font-medium shadow-md" 
        : "text-gray-500 hover:bg-gray-50 hover:text-black"
    }`;

  return (
    // Update Style: Gunakan h-full dan overflow-y-auto agar sidebar juga bisa di-scroll jika menunya panjang
    <aside className="h-full w-full bg-white p-6 flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2 flex-shrink-0">
        <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-serif italic font-bold text-lg">
          A
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide">Admin Panel</h3>
          <p className="text-[9px] text-gray-400 uppercase tracking-wider">ReLoved Manager</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-1 flex-1">
        <div className="px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overview</div>
        
        <NavLink to="/admin" end className={navClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </NavLink>

        <div className="mt-6 px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</div>
        
        <NavLink to="/admin/products" className={navClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Products
        </NavLink>
        
        <NavLink to="/admin/orders" className={navClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Orders
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-gray-100 pt-6 space-y-3 flex-shrink-0 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log Out
        </button>
        
        <div className="text-xs text-center text-gray-400 pt-2">
          <a href="/" className="hover:text-black transition-colors">← Back to Shop</a>
        </div>
      </div>
    </aside>
  );
}