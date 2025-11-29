import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useAdmin } from "../context/AdminContext";

export default function AdminLayout() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login", { 
        state: { from: location }, 
        replace: true 
      });
    }
  }, [isAdmin, navigate, location]);

  if (!isAdmin) return null; 

  return (
    // STRATEGI BARU: Body Scroll
    // Gunakan 'min-h-screen' agar background penuh, tapi biarkan tinggi tumbuh sesuai konten
    <div className="flex min-h-screen w-full bg-[#f4f2f0] font-sans text-gray-900">
      
      {/* Sidebar Desktop: Sticky (Menempel saat scroll) */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </div>
      
      {/* Main Content: Mengisi sisa ruang & Mengalir natural ke bawah */}
      <main className="flex-1 w-full min-w-0">
        <div className="p-6 md:p-12 w-full max-w-7xl mx-auto pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}