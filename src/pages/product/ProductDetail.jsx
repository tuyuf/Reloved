import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = {
    id,
    name: "Abstract Print Shirt",
    price: 39,
    condition: "Like New",
    image_url:
      "https://images.pexels.com/photos/7671163/pexels-photo-7671163.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Relaxed-fit shirt with camp collar and short sleeves. Button-up front.",
  };

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <div className="reloved-page pt-10 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10">
      <div className="aspect-[3/4] bg-[#f1f1f1] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-6">
        <div className="text-[11px] uppercase tracking-[0.25em]">
          Top / Shirt
        </div>
        <h1 className="text-xl md:text-2xl font-semibold">
          {product.name}
        </h1>
        <div className="text-sm md:text-base">${product.price}</div>
        <div className="text-[11px] uppercase opacity-60">
          Condition: {product.condition}
        </div>

        <p className="text-xs md:text-sm opacity-80 max-w-md">
          {product.description}
        </p>

        <div className="space-y-4 pt-4">
          <div className="text-[11px] uppercase tracking-[0.25em]">
            Size
          </div>
          <div className="flex gap-2 text-xs">
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                className="w-10 h-9 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleAdd} className="btn-minimal mt-6">
          Add To Bag
        </button>
      </div>
    </div>
  );
}
