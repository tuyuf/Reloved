import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext"; // Import useUser
import { formatPrice } from "../../lib/format";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser(); // Ambil data user login
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Stok untuk ukuran yang SEDANG dipilih
  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        navigate("/collections");
      } else {
        setProduct(data);
        // Default select varian pertama yang stoknya > 0
        if (data.variants && data.variants.length > 0) {
           const availableVariant = data.variants.find(v => v.stock > 0) || data.variants[0];
           setSelectedSize(availableVariant.size);
           setCurrentStock(availableVariant.stock);
        } else {
           // Fallback jika produk lama (tidak ada variants)
           setCurrentStock(data.stock || 0);
        }
      }
      setLoading(false);
    }

    loadProduct();
  }, [id, navigate]);

  // Update stok saat size berubah
  useEffect(() => {
     if (product?.variants && selectedSize) {
        const variant = product.variants.find(v => v.size === selectedSize);
        setCurrentStock(variant ? variant.stock : 0);
        setQty(1); // Reset qty saat ganti size
     }
  }, [selectedSize, product]);

  const handleAdd = () => {
    if (!product) return;

    // 1. CEK LOGIN TERLEBIH DAHULU
    if (!user) {
        // Arahkan ke login jika belum masuk
        navigate("/auth/login");
        return;
    }
    
    // Validasi Size jika produk memiliki varian
    if (product.variants && product.variants.length > 0 && !selectedSize) {
       alert("Please select a size.");
       return;
    }
    
    setAdding(true);
    addToCart(product, qty, selectedSize);
    
    setTimeout(() => {
      setAdding(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl font-serif italic text-gray-400 animate-pulse">Loading details...</div>
      </div>
    );
  }

  if (!product) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-[1200px] mx-auto pb-20 px-4 sm:px-6 pt-8 md:pt-12"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        
        {/* IMAGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-[4/5] w-full bg-[#f4f4f4] rounded-2xl overflow-hidden shadow-sm relative group"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm tracking-widest uppercase">
              No Image
            </div>
          )}
          
          {/* Label Sold Out hanya jika TOTAL stok habis */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </motion.div>

        {/* DETAILS */}
        <div className="flex flex-col h-full pt-2 md:pt-4 space-y-8">
          
          <div className="space-y-4 border-b border-black/5 pb-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <span className="bg-white px-2 py-1 rounded border border-gray-200 text-black">
                     {product.category || "Collection"}
                  </span>
                  <span>•</span>
                  <span>{product.condition || "Preloved"}</span>
               </div>
               
               {/* Indikator Stok per Varian */}
               {selectedSize && (
                  <div className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full ${currentStock < 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                     {currentStock > 0 ? `${currentStock} Stock (Size ${selectedSize})` : `Size ${selectedSize} Sold Out`}
                  </div>
               )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#111] leading-[1.1]">
              {product.name}
            </h1>
            
            <div className="text-3xl font-medium text-gray-900 font-sans">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Size Selector */}
          {product.variants && product.variants.length > 0 && (
             <div className="space-y-3">
                <h3 className="font-bold text-black uppercase text-[10px] tracking-widest">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                   {product.variants.map((v) => (
                      <button
                         key={v.size}
                         onClick={() => setSelectedSize(v.size)}
                         disabled={v.stock <= 0}
                         className={`min-w-[48px] h-12 px-4 rounded-lg text-sm font-medium border transition-all duration-200 relative
                            ${selectedSize === v.size 
                               ? 'bg-black text-white border-black shadow-lg transform scale-105' 
                               : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                            }
                            ${v.stock <= 0 ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-300 border-gray-100' : ''}
                         `}
                      >
                         {v.size}
                         {v.stock <= 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                         )}
                      </button>
                   ))}
                </div>
             </div>
          )}

          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <h3 className="font-bold text-black uppercase text-[10px] tracking-widest">Description</h3>
            <p>
              {product.description || "No description available for this item."}
            </p>
          </div>

          <div className="pt-6 mt-auto space-y-4">
             {currentStock > 0 && (
                <div className="flex items-center gap-4">
                   <div className="flex items-center border border-gray-200 rounded-xl h-14 w-32 bg-white">
                      <button 
                         onClick={() => setQty(q => Math.max(1, q - 1))}
                         className="flex-1 h-full text-lg hover:bg-gray-50 rounded-l-xl transition-colors"
                      >-</button>
                      <span className="font-bold w-8 text-center">{qty}</span>
                      <button 
                         onClick={() => setQty(q => Math.min(currentStock, q + 1))}
                         className="flex-1 h-full text-lg hover:bg-gray-50 rounded-r-xl transition-colors"
                      >+</button>
                   </div>
                   <div className="text-xs text-gray-400">
                      Max: {currentStock}
                   </div>
                </div>
             )}

            <button 
              onClick={handleAdd} 
              // Tombol tetap aktif jika belum login agar bisa diklik untuk redirect
              disabled={(!user ? false : currentStock <= 0) || adding}
              className="w-full h-14 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {!user 
                ? "Login to Buy" // Teks berubah jika belum login
                : currentStock <= 0 
                    ? "Size Sold Out" 
                    : adding 
                        ? "Adding..." 
                        : (
                            <>
                            <span>Add to Bag</span>
                            <span>—</span>
                            <span>{formatPrice(product.price * qty)}</span>
                            </>
                        )
              }
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}