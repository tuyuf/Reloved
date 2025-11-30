import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import Footer from "./Footer"; // Import Footer

export default function Sidebar() {
  const { user, token } = useUser();
  const { cart } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (!user || !token) {
      setHistoryCount(0);
      return;
    }

    async function fetchHistoryCount() {
      try {
        const data = await api.db.get("orders", {
            select: "id",
            user_id: `eq.${user.id}`,
            status: "in.(completed,cancelled)"
        }, token);

        if (data) {
            setHistoryCount(data.length);
        }
      } catch (error) {
        console.error("Failed to fetch history count", error);
      }
    }

    fetchHistoryCount();
  }, [user, token]);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group relative font-medium ${
      isActive 
        ? "bg-white text-black shadow-sm ring-1 ring-black/5" 
        : "text-gray-500 hover:text-black hover:bg-black/5"
    }`;

  const avatarUrl = user?.user_metadata?.avatar_url;
  const firstName = user?.user_metadata?.first_name || (user?.email ? user.email.split('@')[0] : 'Guest');

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] relative bg-[#F3F3F1] border-r border-black/5 ${
        isCollapsed ? "w-20" : "w-72"
      }`} 
    >
      <div className={`flex-1 flex flex-col ${isCollapsed ? "px-3 py-6" : "p-8"}`}>
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-12 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-800 transition-transform duration-300 z-50 focus:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* PROFILE SECTION */}
        <Link 
          to="/profile" 
          className={`flex items-center gap-4 mb-12 transition-all duration-300 group ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 min-w-[40px] rounded-lg bg-white border border-gray-200 overflow-hidden shadow-sm shrink-0 relative group-hover:ring-2 ring-black/10 transition-all">
            {avatarUrl ? (
              <img src={avatarUrl} alt="profile" className="w-full h-full object-cover" />
            ) : user?.email ? (
              <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold text-xs uppercase">
                  {user.email[0]}
              </div>
            ) : (
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="guest" className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"}`}>
            <h3 className="font-bold text-sm whitespace-nowrap text-[#111] leading-tight capitalize">
              {firstName}
            </h3>
            <p className="text-[11px] text-gray-500 truncate">Member</p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="space-y-2 flex-1">
          <NavLink to="/" className={navClass} title="Home">
            <svg className="min-w-[20px]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              Home
            </span>
          </NavLink>
          
          <NavLink to="/collections" className={navClass} title="Collections">
            <svg className="min-w-[20px]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              Collections
            </span>
          </NavLink>

          <NavLink to="/cart" className={navClass} title="Cart">
            <div className="relative flex items-center justify-center min-w-[20px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] flex items-center justify-center bg-[#111] text-white text-[9px] font-bold rounded-full px-1 ring-2 ring-[#F3F3F1]">
                  {cart.length}
                </span>
              )}
            </div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              Cart
            </span>
          </NavLink>

          <NavLink to="/orders" className={navClass} title="Orders">
            <svg className="min-w-[20px]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              Orders
            </span>
          </NavLink>
          
          <NavLink to="/history" className={navClass} title="History">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <svg className="min-w-[20px]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                  History
                </span>
              </div>
              {historyCount > 0 && (
                <span className={`text-xs font-medium bg-[#E5E5E0] px-2 py-0.5 rounded-md text-gray-600 transition-all ${isCollapsed ? "hidden" : "block"}`}>
                  {historyCount}
                </span>
              )}
            </div>
          </NavLink>
        </nav>
      </div>

      {/* FOOTER INSIDE SIDEBAR */}
      <Footer inSidebar={true} isCollapsed={isCollapsed} />
    </aside>
  );
}