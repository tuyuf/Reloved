import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  // Kita hapus container pembatas (flex center, max-w-md, dll)
  // Agar halaman Login & Register bisa mengambil alih layar sepenuhnya (Full Screen)
  return <Outlet />;
}