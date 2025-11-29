import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatPrice, formatDate } from "../../lib/format";
import { useUser } from "../../context/UserContext"; 
import { motion } from "framer-motion";

export default function History() {
  const { user } = useUser(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
         .from("orders")
         .select("*, order_items(products(name, image_url))")
         .eq("user_id", user.id)
         .in("status", ["completed", "cancelled"])
         .order("created_at", { ascending: false });
         
      if (error) console.error(error);
      else setOrders(data || []);
      
      setLoading(false);
    }
    load();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    // UPDATED: Padding & Width disamakan dengan Home
    // pt-24 dipertahankan untuk mobile agar tidak nabrak navbar, md:pt-12 untuk desktop
    <div className="w-full max-w-[1200px] mx-auto pb-20 pt-24 md:pt-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 border-b border-black/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-5xl font-serif text-[#111] mb-2">History</h1>
          <p className="text-gray-500 text-sm">Past transactions and archives.</p>
        </div>
        {user && (
          <div className="text-xs font-bold bg-[#F4F2F0] px-4 py-2 rounded-full text-gray-600">
            Total: {orders.length} Orders
          </div>
        )}
      </motion.div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
           <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
           <span className="text-gray-400 text-sm italic">Loading archives...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-2xl border border-dashed border-gray-200">
           <p className="text-gray-400 font-serif text-lg italic">
             {user ? "No history yet." : "Please login to view history."}
           </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // Ubah menjadi Grid agar lebih rapi di layar lebar
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
           {orders.map((order) => (
              <motion.div 
                key={order.id} 
                variants={itemVariants}
                className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                 {/* Status Icon */}
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 ${
                    order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                 }`}>
                    {order.status === 'completed' ? '✓' : '✕'}
                 </div>

                 {/* Main Info */}
                 <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                       <span className="font-mono text-xs text-gray-400 mb-1 md:mb-0">#{order.id}</span>
                       <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                       {order.order_items?.map((item, i) => (
                          <span key={i} className="text-sm font-medium text-gray-900 border-r border-gray-200 pr-2 last:border-0 mr-1 last:mr-0">
                             {item.products?.name}
                          </span>
                       ))}
                    </div>

                    <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        order.status === 'completed' 
                          ? 'bg-white text-green-700 border-green-100' 
                          : 'bg-white text-red-600 border-red-100'
                    }`}>
                        {order.status}
                    </div>
                 </div>

                 {/* Price */}
                 <div className="w-full md:w-auto text-left md:text-right pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 mt-2 md:mt-0">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Paid</div>
                    <div className="text-xl font-serif text-[#111]">{formatPrice(order.total_price)}</div>
                 </div>
              </motion.div>
           ))}
        </motion.div>
      )}
    </div>
  );
}