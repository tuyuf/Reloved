import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="text-left group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-[#f1f1f1] mb-3">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-black/40">
            No Image
          </div>
        )}
      </div>

      <div className="text-[11px] uppercase opacity-50 mb-1">
        {product.condition || "Preloved"}
      </div>
      <div className="text-xs md:text-sm mb-1">{product.name}</div>
      <div className="text-xs md:text-sm">${product.price}</div>
    </button>
  );
}
