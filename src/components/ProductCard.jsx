import { useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/format";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer flex flex-col gap-3 relative bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100"
    >
      {/* Image Frame - Radius disesuaikan */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[#f0f0f0] relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 text-xs tracking-widest uppercase">
            No Image
          </div>
        )}

        {/* Hover Arrow Icon */}
        <div className="hidden md:flex absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm z-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </div>
        
        {/* Sold Out Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Text Info */}
      <div className="px-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-medium text-base leading-tight text-[#111] group-hover:underline decoration-1 underline-offset-4 transition-all line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            <span>{product.category || "Item"}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{product.condition || "Preloved"}</span>
          </div>
          <span className="text-xs font-bold text-black bg-gray-50 px-2 py-1 rounded-md">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}