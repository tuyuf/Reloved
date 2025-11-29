import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../lib/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    statusCounts: {
      pending: 0,
      paid: 0,
      processed: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // 1. Hitung Produk
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // 2. Ambil Data Pesanan
      const { data: orders } = await supabase
        .from("orders")
        .select("total_price, status");

      const totalOrders = orders?.length || 0;
      
      // Hitung Revenue (Hanya dari yang sudah dibayar/selesai)
      const revenue = orders
        ?.filter((o) => ["paid", "processed", "shipped", "completed"].includes(o.status))
        .reduce((sum, o) => sum + (o.total_price || 0), 0);

      // Hitung per Status
      const statusCounts = orders?.reduce((acc, order) => {
        const status = order.status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { pending: 0, paid: 0, processed: 0, shipped: 0, completed: 0, cancelled: 0 });

      setStats({
        revenue: revenue || 0,
        totalProducts: productsCount || 0,
        totalOrders,
        statusCounts: statusCounts || {},
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-400 italic font-serif">Loading dashboard...</div>;

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <div className="border-b border-black/5 pb-6">
        <h1 className="text-4xl font-serif text-[#111]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of store performance.</p>
      </div>

      {/* Main Stats (Big Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] text-white p-8 rounded-2xl shadow-lg">
          <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Total Revenue</div>
          <div className="text-3xl font-serif">{formatPrice(stats.revenue)}</div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Total Orders</div>
          <div className="text-3xl font-serif text-[#111]">{stats.totalOrders}</div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Total Products</div>
          <div className="text-3xl font-serif text-[#111]">{stats.totalProducts}</div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h3 className="font-serif text-xl text-[#111] mb-6">Orders by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatusCard label="Pending" value={stats.statusCounts.pending} color="bg-gray-100 text-gray-600" />
          <StatusCard label="Paid" value={stats.statusCounts.paid} color="bg-blue-50 text-blue-700 border border-blue-100" />
          <StatusCard label="Processed" value={stats.statusCounts.processed} color="bg-yellow-50 text-yellow-800 border border-yellow-100" />
          <StatusCard label="Shipped" value={stats.statusCounts.shipped} color="bg-purple-50 text-purple-700 border border-purple-100" />
          <StatusCard label="Completed" value={stats.statusCounts.completed} color="bg-green-50 text-green-700 border border-green-100" />
          <StatusCard label="Cancelled" value={stats.statusCounts.cancelled} color="bg-red-50 text-red-700 border border-red-100" />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, color }) {
  return (
    <div className={`p-5 rounded-xl flex flex-col items-center justify-center text-center ${color}`}>
      <div className="text-2xl font-serif font-bold mb-1">{value || 0}</div>
      <div className="text-[10px] uppercase tracking-widest opacity-80">{label}</div>
    </div>
  );
}