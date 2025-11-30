import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { formatPrice, formatDate } from "../../lib/format";
import { useUser } from "../../context/UserContext";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!token) return;
      try {
        const data = await api.db.get("orders", {
            id: `eq.${id}`,
            select: `*, order_items (quantity, price, products (name, image_url))`
        }, token);

        if (data && data.length > 0) {
            setOrder(data[0]);
        } else {
            alert("Pesanan tidak ditemukan");
            navigate("/admin/orders");
        }
      } catch (error) {
        console.error(error);
        navigate("/admin/orders");
      }
      setLoading(false);
    }
    loadOrder();
  }, [id, navigate, token]);

  if (loading) return <div className="p-20 text-center text-gray-400 italic font-serif">Loading detail...</div>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header & Back Button */}
      <div className="mb-8">
        <button 
          onClick={() => navigate("/admin/orders")}
          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-4 flex items-center gap-2"
        >
          ← Back to Orders
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-black/5 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#111] mb-2">Order #{order.id}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest">
            {order.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Order Items */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500">Items Ordered</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.order_items?.map((item, idx) => (
                <div key={idx} className="p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    {item.products?.image_url && (
                      <img src={item.products.image_url} className="w-full h-full object-cover" alt={item.products.name} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.products?.name || "Unknown Item"}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.quantity} x {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Total Amount</span>
              <span className="font-serif text-2xl text-[#111]">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-serif text-lg mb-4 pb-2 border-b border-gray-100 text-[#111]">Customer</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Name</label>
                <div className="font-medium text-gray-900">{order.customer_name}</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Email</label>
                <div className="text-gray-600 break-all">{order.customer_email || "-"}</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Phone</label>
                <div className="text-gray-600">{order.customer_phone || "-"}</div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
            <h3 className="font-serif text-lg mb-4 pb-2 border-b border-gray-100 text-[#111] flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Shipping Address
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {order.shipping_address}
            </p>
            
            {order.tracking_number && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Tracking Number</label>
                <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded inline-block border border-gray-200">
                  {order.tracking_number}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}