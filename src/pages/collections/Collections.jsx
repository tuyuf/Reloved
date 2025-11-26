import ProductCard from "../../components/ProductCard";

const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `ReLoved Piece #${i + 1}`,
  price: 20 + i * 3,
  condition: i % 2 ? "Very Good" : "Like New",
  image_url:
    "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=800",
}));

export default function Collections() {
  return (
    <div className="reloved-page pt-10 space-y-8">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em]">
            XIV Collections
          </div>
          <div className="text-xl md:text-2xl font-semibold">23–24</div>
        </div>

        <div className="flex gap-6 text-[11px] uppercase tracking-[0.2em] opacity-70">
          <button className="underline-offset-4 underline">All</button>
          <button>Men</button>
          <button>Women</button>
          <button>Accessories</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
