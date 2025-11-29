import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice, formatDate } from "../../lib/format";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "All Orders", value: "All" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Processed", value: "processed" },
    { label: "Shipped", value: "shipped" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  async function loadOrders() {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select(`*, order_items (quantity, products (name))`)
      .order("created_at", { ascending: false });

    if (activeTab !== "All") {
      query = query.eq("status", activeTab);
    }

    const { data, error } = await query;
    if (!error) setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, [activeTab]);

  async function handleStatusChange(orderId, newStatus) {
    let additionalData = {};
    if (newStatus === 'shipped') {
        const resi = prompt("Masukkan Nomor Resi Pengiriman:");
        if (!resi) return;
        additionalData.tracking_number = resi;
    }

    const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, ...additionalData })
        .eq('id', orderId);

    if (error) alert("Gagal update status");
    else loadOrders();
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return 'bg-white border border-gray-300 text-gray-600';
      case 'paid': return 'bg-blue-50 border border-blue-200 text-blue-600';
      case 'processed': return 'bg-yellow-50 border border-yellow-200 text-yellow-700';
      case 'shipped': return 'bg-purple-50 border border-purple-200 text-purple-700';
      case 'completed': return 'bg-green-50 border border-green-200 text-green-700';
      case 'cancelled': return 'bg-red-50 border border-red-200 text-red-600';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // PERBAIKAN: Hapus 'h-screen' atau pembatas tinggi statis. Biarkan container mengalir (flow).
  // AdminLayout sudah menangani scroll container utama.
  return (
    <div className="space-y-8 pb-20 w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-6 border-b border-black/5 pb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif text-[#111]">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer orders.</p>
          </div>
          <div className="text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {orders.length} Results
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-black text-white shadow-lg" 
                  : "bg-[#EAE8E6] text-gray-500 hover:text-black hover:bg-[#e0e0df]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      {/* Tambahkan overflow-x-auto agar tabel bisa di-scroll horizontal di layar kecil */}
      <div className="w-full overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 italic font-serif">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-serif text-lg italic mb-2">No orders found.</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              In {activeTab === 'All' ? 'all categories' : activeTab} status
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left min-w-[800px]"> {/* Min-width agar tabel tidak gepeng */}
                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">ID</th>
                    <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                    <th className="px-6 py-4 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 whitespace-nowrap">Total</th>
                    <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => {
                    const isFinal = ['completed', 'cancelled'].includes(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          <Link to={`/admin/orders/${order.id}`} className="hover:underline hover:text-black">
                            #{order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{order.shipping_address}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-serif font-medium text-gray-900 whitespace-nowrap">{formatPrice(order.total_price)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              disabled={isFinal}
                              className={`appearance-none border text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-xs font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all cursor-pointer
                                ${isFinal ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-200 hover:border-gray-300'}
                              `}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="processed">Processed</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}