import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import ProductCard from "../../components/ProductCard";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { toggleCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
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
        .limit(8);

      if (activeCategory !== "All") query = query.eq("category", activeCategory);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [activeCategory, search]);

  // Animasi Container Utama (Stagger Effect)
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Jeda 0.1 detik antar item
        delayChildren: 0.2,   // Tunggu 0.2 detik sebelum mulai
      }
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6">
      
      {/* 1. HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center py-16 md:py-24 space-y-6"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-lg bg-[#EAE8E6] text-[10px] uppercase tracking-widest font-medium text-gray-600 shadow-sm"
        >
          From the store of ReLoved
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl leading-[1.1] text-[#111]">
          Curated fashion for the <br />
          <span className="italic font-serif font-normal text-black/80">conscious</span> style.
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
      </motion.div>

      {/* 2. FILTERS */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }} 
         animate={{ opacity: 1, y: 0 }} 
         transition={{ delay: 0.4, duration: 0.5 }}
         className="flex flex-wrap gap-2 justify-center mb-16"
      >
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.value
                ? "bg-white text-black shadow-sm ring-1 ring-black/5 scale-105" 
                : "bg-[#EAE8E6] text-gray-600 hover:bg-[#e0e0df] hover:text-black"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* 3. PRODUCT GRID */}
      {loading ? (
        <div className="py-32 text-center text-gray-400 italic font-serif text-xl flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
           <span className="animate-pulse">Loading treasures...</span>
        </div>
      ) : products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-32 text-center bg-white rounded-xl border border-dashed border-gray-200 mx-4"
        >
          <p className="text-gray-400 mb-2 text-lg">No products found.</p>
          <button onClick={() => {setActiveCategory("All"); setSearch("")}} className="text-sm text-black underline underline-offset-4 hover:text-gray-600">Clear filters</button>
        </motion.div>
      ) : (
        <motion.div 
          variants={gridContainerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
        >
          <AnimatePresence>
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* 4. FOOTER PROMO */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-32 py-20 text-center border-t border-black/5"
      >
        <h2 className="text-4xl md:text-5xl mb-6 font-serif text-[#111]">
          Help you find <br />
          <span className="italic font-normal text-gray-500">timeless</span> pieces.
        </h2>
      </motion.div>
    </div>
  );
}