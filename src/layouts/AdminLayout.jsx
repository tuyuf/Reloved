import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useAdmin } from "../context/AdminContext"; // Jika ada proteksi admin

export default function AdminLayout() {
  // Logic proteksi admin bisa diletakkan di sini jika diperlukan
  
  return (
    <div className="flex min-h-screen bg-[#f4f2f0] font-sans text-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}