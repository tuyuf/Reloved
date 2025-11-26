import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="reloved-page py-20 text-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="reloved-page py-10">
      <h1 className="text-3xl font-bold mb-6">This Week</h1>

      {products.length === 0 && (
        <p className="text-gray-500">Belum ada produk ~</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="space-y-2">
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-48 object-cover rounded"
            />

            <p className="text-xs uppercase text-gray-400">{p.condition}</p>

            <h3 className="font-medium">{p.name}</h3>

            <p className="text-sm font-semibold">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
