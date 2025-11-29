import { useState } from "react";
import { supabase } from "/src/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) setErr(error.message);
    else navigate("/");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      
      {/* BAGIAN KIRI: GAMBAR (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#F4F2F0]">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" 
            alt="Login Fashion" 
            className="w-full h-full grayscale contrast-125"
            style={{ objectFit: "cover", objectPosition: "center" }} // FIX: Mencegah gambar gepeng
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </motion.div>
        
        <div className="absolute bottom-12 left-12 text-white z-10 p-4">
          <h2 className="text-7xl font-serif italic mb-2 tracking-tighter">ReLoved.</h2>
          <p className="text-sm uppercase tracking-[0.4em] font-medium opacity-90">
            Timeless & Sustainable
          </p>
        </div>
      </div>

      {/* BAGIAN KANAN: FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md space-y-10 my-auto" // my-auto agar vertikal center jika layar tinggi
        >
          <div className="text-left">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
              Welcome Back
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-[#111] mb-4 leading-none">
              Sign In
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter your details to access your curated collection and order history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-black transition-colors">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={form.email}
                  className="w-full border-b border-gray-200 py-3 text-base outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2 group">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-black transition-colors">
                    Password
                  </label>
                </div>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  value={form.password}
                  className="w-full border-b border-gray-200 py-3 text-base outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {err && (
              <div className="text-xs text-red-600 bg-red-50 p-4 rounded-none border-l-2 border-red-600">
                {err}
              </div>
            )}

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#111] text-white rounded-none text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Login to Account"}
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  New Member?{" "}
                  <Link to="/auth/register" className="text-black font-bold hover:underline underline-offset-4 ml-1 transition-all">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}