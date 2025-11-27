import { useEffect, useState, useRef } from "react";
// Pastikan import tanpa ekstensi agar aman
import { supabase } from "../../lib/supabase";
import ProductCard from "../../components/ProductCard";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { toggleCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  
  // Ref untuk input search
  const searchInputRef = useRef(null);

  const categories = [
    { label: "All", value: "All" },
    { label: "T-Shirt", value: "t-shirt" },
    { label: "Shirt", value: "shirt" },
    { label: "Outer", value: "outer" },
    { label: "Hoodie", value: "hoodie" },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .gt('stock', 0)
        .order("created_at", { ascending: false })
        .limit(8); // MEMBATASI HANYA 8 PRODUK

      if (activeCategory !== "All") query = query.eq("category", activeCategory);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [activeCategory, search]);

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6">
      
      {/* 1. HERO SECTION */}
      <div className="text-center py-16 md:py-24 space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-lg bg-[#EAE8E6] text-[10px] uppercase tracking-widest font-medium text-gray-600 shadow-sm">
          From the store of ReLoved
        </div>
        
        <h1 className="text-5xl md:text-7xl leading-[1.1] text-[#111]">
          Curated fashion for the <br />
          <span className="italic font-serif font-normal">conscious</span> style.
        </h1>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-10 relative flex items-center">
          <div className="relative w-full group">
            <input 
              ref={searchInputRef}
              type="text"
              placeholder="Search for items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-transparent outline-none pl-6 pr-14 py-4 rounded-xl text-sm shadow-sm focus:shadow-md focus:ring-1 focus:ring-black/5 transition-all placeholder:text-gray-400"
            />
            <button 
              onClick={() => searchInputRef.current?.focus()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FILTERS (Updated Style: Rounded-lg & Colors) */}
      <div className="flex flex-wrap gap-2 justify-center mb-16">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-white text-black shadow-sm ring-1 ring-black/5" // Active: Putih
                : "bg-[#EAE8E6] text-gray-600 hover:bg-[#e0e0df]"     // Inactive: Cream Grey
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. PRODUCT GRID */}
      {loading ? (
        <div className="py-32 text-center text-gray-400 italic font-serif text-xl animate-pulse">Loading treasures...</div>
      ) : products.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-xl border border-dashed border-gray-200 mx-4">
          <p className="text-gray-400 mb-2 text-lg">No products found.</p>
          <button onClick={() => {setActiveCategory("All"); setSearch("")}} className="text-sm text-black underline underline-offset-4 hover:text-gray-600">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* TOMBOL LIHAT SELENGKAPNYA */}
          <div className="mt-16 flex justify-center">
            <a 
              href="/collections"
              className="px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-full text-xs font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm hover:shadow-md"
            >
              <span className="italic font-serif font-normal">See All Collections</span>
            </a>
          </div>
        </>
      )}

      {/* 4. FOOTER PROMO */}
      <div className="mt-32 py-20 text-center border-t border-black/5">
        <h2 className="text-4xl md:text-5xl mb-6 font-serif">
          Help you find <br />
          <span className="italic font-normal">timeless</span> pieces.
        </h2>
      </div>
    </div>
  );
}