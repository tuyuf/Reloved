import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ProductCard from "../../components/ProductCard";

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "t-shirt", "shirt", "outer", "hoodie"];

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .gt('stock', 0)
        .order("created_at", { ascending: false });

      if (category !== "All") query = query.eq("category", category);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [category, search]);

  return (
    <div className="max-w-[1200px] mx-auto pb-20 px-4 md:px-0">
      
      {/* Header & Controls */}
      <div className="py-10 md:py-16 space-y-8 border-b border-black/5 mb-10">
        <div>
          <h1 className="text-5xl md:text-6xl font-serif italic text-[#111] mb-4">
            All Collections
          </h1>
          
          {/* Search Input */}
          <div className="relative max-w-sm">
             <input 
               type="text" 
               placeholder="Search collection..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white border-none outline-none px-4 py-3 rounded-xl text-sm shadow-sm focus:ring-1 focus:ring-black/5 pl-10"
             />
             <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        {/* Filter Tabs (Style Updated) */}
        <div className="flex flex-wrap gap-2">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setCategory(cat)}
               className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                 category === cat
                   ? "bg-white text-black shadow-sm ring-1 ring-black/5" 
                   : "bg-[#EAE8E6] text-gray-600 hover:bg-[#e0e0df]"
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-32 text-center text-gray-400 italic font-serif text-xl">Loading collections...</div>
      ) : products.length === 0 ? (
        <div className="py-32 text-center">
          <div className="text-4xl mb-4 opacity-20">Empty</div>
          <p className="text-sm text-gray-400">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}