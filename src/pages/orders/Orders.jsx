import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { formatPrice, formatDate } from "../../lib/format";
import { useUser } from "../../context/UserContext"; 
import { motion } from "framer-motion";

export default function Orders() {
  const { user, token } = useUser(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    if (!user || !token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const data = await api.db.get("orders", {
          select: "*, order_items(products(name, image_url))",
          user_id: `eq.${user.id}`,
          status: "in.(pending,paid,processed,shipped)",
          order: "created_at.desc"
      }, token);

      setOrders(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, [user, token]);

  const handleReceived = async (id) => {
    if (!confirm("Konfirmasi pesanan sudah diterima?")) return;
    try {
        await api.db.update("orders", id, { status: "completed" }, token);
        loadOrders();
    } catch (e) {
        alert("Update failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "paid": return "bg-blue-50 text-blue-700 border-blue-100";
      case "processed": return "bg-yellow-50 text-yellow-800 border-yellow-100";
      case "shipped": return "bg-purple-50 text-purple-700 border-purple-100";
      default: return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 pt-24 md:pt-12 px-4 sm:px-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-10 md:py-16 border-b border-black/5 mb-10"
      >
        <h1 className="text-5xl md:text-6xl font-serif italic text-[#111] mb-2">Active Orders</h1>
        <p className="text-sm text-gray-500">Track your journey to sustainable fashion.</p>
      </motion.div>

      {loading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
           <span className="text-gray-400 font-serif italic">Checking status...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-serif text-lg italic">
            {user ? "No active orders." : "Please login to view orders."}
          </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {orders.map((order) => (
            <motion.div 
              key={order.id} 
              variants={itemVariants}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full"
            >
              {/* Image Preview (Ambil gambar pertama) */}
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                 {order.order_items?.[0]?.products?.image_url ? (
                    <img 
                      src={order.order_items[0].products.image_url} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt="Order Item"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-300 uppercase tracking-widest">No Image</div>
                 )}
                 
                 {/* Status Badge Overlay */}
                 <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border bg-white/90 backdrop-blur-md shadow-sm ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                 </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Order ID</div>
                      <div className="font-mono text-xs text-black">#{order.id}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Date</div>
                      <div className="text-xs text-black">{formatDate(order.created_at)}</div>
                   </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                   {order.order_items?.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700 truncate font-medium">
                         {item.products?.name} <span className="text-gray-400 font-normal">x1</span>
                      </div>
                   ))}
                   {order.order_items?.length > 2 && (
                      <div className="text-xs text-gray-400 italic">
                         + {order.order_items.length - 2} more items
                      </div>
                   )}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                   <div className="flex justify-between items-end mb-4">
                      <span className="text-xs text-gray-500">Total Amount</span>
                      <span className="text-xl font-serif text-[#111]">{formatPrice(order.total_price)}</span>
                   </div>

                   {/* Resi Section */}
                   {order.tracking_number ? (
                      <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between text-xs mb-3">
                         <span className="text-gray-500 uppercase tracking-wider font-bold">Resi:</span>
                         <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 select-all">{order.tracking_number}</span>
                      </div>
                   ) : (
                      <div className="text-xs text-gray-400 italic text-center py-2 bg-gray-50/50 rounded-xl mb-3">
                         Waiting for shipment...
                      </div>
                   )}

                   {/* Action Button */}
                   {order.status === "shipped" && (
                      <button 
                        onClick={() => handleReceived(order.id)} 
                        className="w-full py-3 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md active:scale-95"
                      >
                        Confirm Received
                      </button>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}