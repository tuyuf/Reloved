import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const navLinkClass = ({ isActive }) =>
    `text-xs md:text-sm tracking-[0.25em] uppercase ${
      isActive ? "font-semibold" : "font-normal"
    }`;

  return (
    <header className="border-b border-black/5 bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="reloved-page flex items-center justify-between h-16">
        {/* Left: menu icon + logo text */}
        <div className="flex items-center gap-6">
          <button className="h-8 w-8 flex flex-col justify-center gap-1">
            <span className="h-[1px] w-5 bg-black" />
            <span className="h-[1px] w-4 bg-black" />
          </button>

          <Link
            to="/"
            className="text-xs md:text-sm tracking-[0.35em] uppercase"
          >
            ReLoved
          </Link>

          <nav className="hidden md:flex items-center gap-8 ml-6">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/collections" className={navLinkClass}>
              Collections
            </NavLink>
            <button className="text-xs tracking-[0.25em] uppercase opacity-60 cursor-default">
              New
            </button>
          </nav>
        </div>

        {/* Center: small diamond */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-6 h-6 rotate-45 border border-black/40 flex items-center justify-center">
            <div className="w-2 h-2 bg-black" />
          </div>
        </div>

        {/* Right: icons */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDark((v) => !v)}
            className="h-9 w-9 rounded-full border border-black/15 flex items-center justify-center text-xs"
          >
            {isDark ? "☾" : "☀︎"}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="px-4 h-9 rounded-full border border-black/80 text-xs tracking-[0.25em] uppercase flex items-center gap-2"
          >
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="text-[10px] bg-black text-white rounded-full px-2 py-[1px]">
                {cart.length}
              </span>
            )}
          </button>

          {/* Avatar / Login */}
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="h-9 w-9 rounded-full border border-black/80 flex items-center justify-center text-[11px]"
            >
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="h-9 w-9 rounded-full border border-black/80 flex items-center justify-center text-[11px]"
            >
              ◦
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
