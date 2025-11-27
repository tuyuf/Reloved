import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice, formatDate } from "../../lib/format";
import { useUser } from "../../context/UserContext"; // Import User Context

export default function History() {
  const { user } = useUser(); // Ambil data user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Jika user belum login, set kosong dan stop
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
         .from("orders")
         .select("*, order_items(products(name, image_url))")
         .eq("user_id", user.id) // Filter HANYA riwayat milik user ini
         .in("status", ["completed", "cancelled"])
         .order("created_at", { ascending: false });
         
      if (error) console.error(error);
      else setOrders(data || []);
      
      setLoading(false);
    }
    load();
  }, [user]); // Reload saat user berubah

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 flex items-end justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#111] mb-2">History</h1>
          <p className="text-gray-500">Riwayat transaksi Anda yang sudah selesai.</p>
        </div>
        {user && (
          <div className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500">
            Total: {orders.length}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 animate-pulse">Memuat riwayat...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-gray-400 italic">
           {user ? "Belum ada riwayat pesanan." : "Silakan login untuk melihat riwayat Anda."}
        </div>
      ) : (
        <div className="space-y-4">
           {orders.map((order) => (
              <div key={order.id} className="group bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-300 transition-all hover:shadow-sm flex flex-col sm:flex-row items-center gap-6 opacity-85 hover:opacity-100">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                    order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                 }`}>
                    {order.status === 'completed' ? '✓' : '✕'}
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                       <span className="font-bold text-sm text-gray-900">Order #{order.id}</span>
                       <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border w-fit mx-auto sm:mx-0 ${
                          order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                       }`}>
                          {order.status}
                       </span>
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                 </div>
                 <div className="text-center sm:text-right min-w-[100px]">
                    <div className="text-sm font-bold text-gray-900">{formatPrice(order.total_price)}</div>
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}