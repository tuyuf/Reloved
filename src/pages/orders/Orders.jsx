import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice, formatDate } from "../../lib/format";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(products(name, image_url))")
      .in("status", ["pending", "paid", "processed", "shipped"])
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  const handleReceived = async (id) => {
    if (!confirm("Konfirmasi pesanan sudah diterima?")) return;
    const { error } = await supabase.from("orders").update({ status: "completed" }).eq("id", id);
    if (!error) loadOrders();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "paid": return "bg-[#EAE8E6] text-gray-800";
      case "processed": return "bg-yellow-50 text-yellow-800 border border-yellow-100";
      case "shipped": return "bg-[#111] text-white";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="py-10 md:py-16 border-b border-black/5 mb-10">
        <h1 className="text-5xl font-serif italic text-[#111] mb-2">Active Orders</h1>
        <p className="text-sm text-gray-500">Lacak perjalanan barang pesanan Anda.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-serif italic">Memeriksa status...</div>
      ) : orders.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-400 font-serif text-lg italic">Tidak ada pesanan aktif.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-gray-100 pb-6">
                <div className="space-y-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${getStatusStyle(order.status)}`}>{order.status}</span>
                  <div className="pt-2 flex items-baseline gap-2 text-xs text-gray-400"><span>#{order.id}</span><span>•</span><span>{formatDate(order.created_at)}</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-gray-400 tracking-widest">Total</div>
                  <div className="text-2xl font-serif text-[#111]">{formatPrice(order.total_price)}</div>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {order.order_items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden border border-gray-100">
                      {item.products?.image_url ? <img src={item.products.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">IMG</div>}
                    </div>
                    <div><div className="font-medium text-gray-800">{item.products?.name}</div><div className="text-xs text-gray-400 mt-0.5">Qty: 1</div></div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 md:px-8">
                {order.tracking_number ? <div className="flex items-center gap-3 text-xs"><span className="text-gray-400 uppercase tracking-widest font-bold">Resi:</span><span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">{order.tracking_number}</span></div> : <span className="text-xs text-gray-400 italic">Menunggu pengiriman...</span>}
                {order.status === "shipped" && <button onClick={() => handleReceived(order.id)} className="btn-primary w-full sm:w-auto">Konfirmasi Terima</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}