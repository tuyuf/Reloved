// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const navClass =
    "text-[10px] md:text-xs tracking-[0.25em] uppercase flex items-center gap-2 px-4 py-2 rounded-full border border-black/10";
  const navActive = "bg-black text-white border-black";
  const navInactive = "bg-white text-black hover:bg-black/5";

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black/5 bg-white/80 backdrop-blur px-6 py-8 flex flex-col gap-8">
        <button
          onClick={() => navigate("/")}
          className="text-xs tracking-[0.35em] uppercase text-left"
        >
          ReLoved
        </button>

        <div className="flex flex-col gap-3">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${navClass} ${isActive ? navActive : navInactive}`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${navClass} ${isActive ? navActive : navInactive}`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black/60" />
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${navClass} ${isActive ? navActive : navInactive}`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black/40" />
            Orders
          </NavLink>
        </div>

        <div className="mt-auto text-[10px] text-black/40 tracking-[0.25em] uppercase">
          Admin Panel
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-10 py-8">
        <Outlet />
      </main>
    </div>
  );
}
