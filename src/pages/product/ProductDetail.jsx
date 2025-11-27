import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert("Produk tidak ditemukan");
        navigate("/collections");
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    loadProduct();
  }, [id, navigate]);

  const handleAdd = () => {
    if (!product) return;
    setAdding(true);
    addToCart(product);
    
    setTimeout(() => {
      setAdding(false);
      // Optional: Redirect to cart or show toast
      // navigate("/cart"); 
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

  return (
    <div className="max-w-[1100px] mx-auto pb-20 px-4 sm:px-6 pt-8 md:pt-12">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        
        {/* Left: Image */}
        <div className="aspect-[4/5] w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm tracking-widest uppercase">
              No Image Available
            </div>
          )}
          
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col h-full pt-2 md:pt-4 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4 border-b border-black/5 pb-8">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <span className="bg-white px-2 py-1 rounded border border-gray-200 text-black">
                {product.category || "Collection"}
              </span>
              <span>•</span>
              <span>{product.condition || "Preloved"}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#111] leading-[1.1]">
              {product.name}
            </h1>
            
            <div className="text-2xl font-medium text-gray-900 font-sans">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <h3 className="font-bold text-black uppercase text-[10px] tracking-widest">Description</h3>
            <p>
              {product.description || "No description available for this item. It is a unique preloved piece looking for a new home."}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 mt-auto">
            <button 
              onClick={handleAdd} 
              disabled={product.stock <= 0 || adding}
              className="w-full py-4 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 active:scale-[0.98]"
            >
              {product.stock <= 0 
                ? "Item Sold Out" 
                : adding 
                  ? "Adding to Bag..." 
                  : "Add to Bag"
              }
            </button>
            
            <p className="text-center text-[10px] text-gray-400 mt-4">
              Free shipping on all orders over IDR 500k.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}