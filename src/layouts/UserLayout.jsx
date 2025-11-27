import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CartSidebar from "../components/Cartsidebar";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    // Background diambil dari body (index.css), jadi di sini transparan saja
    <div className="flex min-h-screen font-sans">
      
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-[#F3F3F1]/90 backdrop-blur-md">
          <Navbar />
        </div>

        {/* Content */}
        <main className="flex-1 w-full p-4 md:p-8 md:pt-12">
           <Outlet context={{ toggleCart, isCartOpen }} />
        </main>
      </div>

      {/* RIGHT CART SIDEBAR */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          <button 
            onClick={() => setIsCartOpen(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
          <CartSidebar onClose={() => setIsCartOpen(false)} />
        </div>
      </div>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}