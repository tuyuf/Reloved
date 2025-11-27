import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
      isActive 
        ? "bg-black text-white font-medium shadow-md" 
        : "text-gray-500 hover:bg-gray-50 hover:text-black"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 p-6 flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
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

      {/* Footer */}
      <div className="border-t border-gray-100 pt-6 text-xs text-center text-gray-400">
        <a href="/" className="hover:text-black transition-colors">← Back to Shop</a>
      </div>
    </aside>
  );
}