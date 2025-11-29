import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "/src/context/UserContext"; 

export default function Navbar() {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header 
      className={`md:hidden fixed top-0 w-full z-40 flex items-center justify-between px-5 py-4 transition-all duration-300 ${
        scrolled 
          ? "bg-[#F4F2F0]/80 backdrop-blur-md border-b border-black/5 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <Link to="/" className="text-xl font-serif italic font-bold text-[#111] tracking-tight">
        ReLoved.
      </Link>

      <Link to="/profile" className="relative group">
        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center active:scale-95 transition-transform">
           {avatarUrl ? (
             <img src={avatarUrl} alt="profile" className="w-full h-full object-cover" />
           ) : user?.email ? (
             <span className="text-xs font-bold text-black uppercase">
                {user.email[0]}
             </span>
           ) : (
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
             </svg>
           )}
        </div>
      </Link>
    </header>
  );
}