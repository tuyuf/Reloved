// src/components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const link = "block px-4 py-2 text-sm rounded hover:bg-black/10";
  const active = "block px-4 py-2 text-sm rounded bg-black text-white";

  return (
    <aside className="w-60 bg-white border-r p-6 space-y-4">
      <h1 className="text-xl font-bold tracking-wide mb-4">Admin Panel</h1>

      <NavLink to="/admin" end className={({ isActive }) => (isActive ? active : link)}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/products" className={({ isActive }) => (isActive ? active : link)}>
        Products
      </NavLink>

      <NavLink to="/admin/products/add" className={({ isActive }) => (isActive ? active : link)}>
        + Add Product
      </NavLink>

      <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? active : link)}>
        Orders
      </NavLink>
    </aside>
  );
}
