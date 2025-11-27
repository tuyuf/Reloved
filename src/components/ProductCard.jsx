import { useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/format";
import { motion } from "framer-motion";

export default function ProductCard({ product, index }) { // Tambahkan prop 'index' untuk stagger effect manual jika perlu
  const navigate = useNavigate();

  // Varian animasi kartu
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier curve for smooth easing
        delay: index ? index * 0.05 : 0 // Opsional: stagger manual jika parent tidak support staggerChildren
      } 
    },
    hover: {
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={cardVariants} // Menggunakan varian dari parent atau lokal
      // Hapus initial/animate/whileInView di sini jika dikontrol parent (Home/Collections), 
      // tapi agar fleksibel biarkan parent mengontrol "initial" & "animate" state container-nya.
      // Jika berdiri sendiri (misal lazy load saat scroll), gunakan ini:
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }} // Trigger sedikit sebelum elemen masuk penuh
      
      whileHover="hover"
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer flex flex-col gap-3 relative bg-white p-3 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-gray-100 h-full"
    >
      {/* Image Frame */}
      <div className="aspect-[4/5] w-full overflow-hidden rounded-md bg-[#f0f0f0] relative">
        {product.image_url ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 text-xs tracking-widest uppercase">
            No Image
          </div>
        )}

        {/* Hover Arrow Icon - Animated */}
        <div className="hidden md:flex absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm z-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </div>
        
        {/* Sold Out Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px] z-10">
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Text Info */}
      <div className="px-1 flex flex-col gap-1 flex-1 justify-end">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-base leading-tight text-[#111] group-hover:text-black/70 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        <div className="flex justify-between items-end mt-1">
          <div className="flex flex-col gap-0.5">
             <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
               <span>{product.category || "Item"}</span>
               <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
               <span>{product.condition || "Preloved"}</span>
             </div>
             {/* Stock preview on card */}
             {product.stock > 0 && product.stock <= 3 && (
                <span className="text-[9px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded w-fit">Only {product.stock} left</span>
             )}
          </div>
          <span className="text-sm font-bold text-black font-sans bg-gray-50 px-2 py-1 rounded-md group-hover:bg-black group-hover:text-white transition-colors duration-300">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}