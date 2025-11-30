import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext"; 
import { formatPrice } from "../../lib/format";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useUser();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentStock, setCurrentStock] = useState(0);

  // 1. LOAD DATA PRODUK
  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await api.db.get("products", { id: `eq.${id}`, select: "*" });
        
        if (!data || data.length === 0) {
            navigate("/collections");
            return;
        }

        const productData = data[0];
        setProduct(productData);
        
        if (productData.variants && productData.variants.length > 0) {
           const availableVariant = productData.variants.find(v => Number(v.stock) > 0) || productData.variants[0];
           setSelectedSize(availableVariant.size);
           setCurrentStock(Number(availableVariant.stock));
        } else {
           setCurrentStock(Number(productData.stock) || 0);
        }
      } catch (e) {
        navigate("/collections");
      }
      setLoading(false);
    }
    loadProduct();
  }, [id, navigate]);

  // 2. UPDATE STOK SAAT GANTI SIZE
  useEffect(() => {
     if (product?.variants && selectedSize) {
        const variant = product.variants.find(v => v.size === selectedSize);
        const stock = variant ? Number(variant.stock) : 0;
        setCurrentStock(stock);
        setQty(1); 
     }
  }, [selectedSize, product]);

  const qtyInCart = cart.reduce((total, item) => {
      const isMatch = String(item.id) === String(id) && item.selectedSize === selectedSize;
      return isMatch ? total + (item.quantity || 0) : total;
  }, 0);

  const remainingStock = Math.max(0, currentStock - qtyInCart);
  const isCartFull = qtyInCart >= currentStock && currentStock > 0;

  const handleAdd = () => {
    if (!user) return navigate("/auth/login");
    if (product.variants?.length > 0 && !selectedSize) return alert("Select a size");

    if (qtyInCart >= currentStock) {
        alert("Stok sudah habis (ada di keranjang Anda).");
        return;
    }

    setAdding(true);
    addToCart(product, qty, selectedSize, currentStock);
    
    setTimeout(() => {
      setAdding(false);
      setQty(1);
    }, 500);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return null;

  return (
    <div className="max-w-[1200px] mx-auto pb-20 px-4 sm:px-6 pt-12">
      <button onClick={() => navigate(-1)} className="mb-8 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">← Back</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative">
          {product.image_url ? (
            <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300 text-xs">NO IMAGE</div>
          )}
          {currentStock <= 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-black">SOLD OUT</div>}
        </div>

        <div className="flex flex-col gap-8 pt-4">
          <div className="border-b border-gray-100 pb-8 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.category} • {product.condition}</span>
                
                {selectedSize && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                        currentStock <= 0 ? 'bg-red-100 text-red-600' :
                        isCartFull ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-700'
                    }`}>
                        {currentStock <= 0 ? "Sold Out" : isCartFull ? "Max in Bag" : `${remainingStock} Available`}
                    </span>
                )}
             </div>
             <h1 className="text-5xl font-serif text-[#111]">{product.name}</h1>
             <div className="text-3xl text-[#111]">{formatPrice(product.price)}</div>
          </div>

          {/* Size Selector */}
          {product.variants?.length > 0 && (
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mb-3 block">Size</label>
                <div className="flex gap-2">
                   {product.variants.map(v => (
                      <button 
                        key={v.size}
                        onClick={() => setSelectedSize(v.size)}
                        disabled={Number(v.stock) <= 0}
                        className={`h-12 min-w-[48px] px-4 border rounded-lg text-sm font-medium transition-all ${
                            selectedSize === v.size ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                        } ${Number(v.stock) <= 0 ? 'opacity-30 cursor-not-allowed bg-gray-50' : ''}`}
                      >
                        {v.size}
                      </button>
                   ))}
                </div>
             </div>
          )}

          <div className="mt-auto pt-6 space-y-4">
             {/* Quantity Selector */}
             {!isCartFull && currentStock > 0 && (
                 <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl h-14 w-32">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex-1 h-full hover:bg-gray-50 rounded-l-xl text-lg">-</button>
                        <span className="font-bold w-8 text-center">{qty}</span>
                        <button onClick={() => setQty(q => Math.min(remainingStock, q + 1))} className="flex-1 h-full hover:bg-gray-50 rounded-r-xl text-lg">+</button>
                    </div>
                    <span className="text-xs text-gray-400">Max add: {remainingStock}</span>
                 </div>
             )}

             {isCartFull && (
                 <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-xs text-center font-bold border border-orange-100">
                     You already have all {currentStock} items in your bag.
                 </div>
             )}

             <button
                onClick={handleAdd}
                disabled={user && (currentStock <= 0 || isCartFull || adding)}
                className={`w-full h-14 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    user && (currentStock <= 0 || isCartFull || adding)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-800 shadow-xl active:scale-95"
                }`}
             >
                {!user ? "Login to Buy" : currentStock <= 0 ? "Sold Out" : isCartFull ? "Limit Reached" : adding ? "Adding..." : `Add to Bag — ${formatPrice(product.price * qty)}`}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}