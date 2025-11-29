import { useState } from "react";
import { supabase } from "/src/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    
    if (!form.firstName || !form.phone || !form.address || !form.email || !form.password) {
        setErr("Mohon lengkapi semua field wajib (*)");
        return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          address: form.address,
          city: form.city
        }
      }
    });

    setLoading(false);
    if (error) {
        setErr(error.message);
    } else {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* BAGIAN KIRI: FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-lg space-y-8 my-auto"
        >
          <div className="text-left mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-[#111] mb-2 leading-tight italic">
              Join the movement.
            </h1>
            <p className="text-gray-500 text-sm tracking-wide">
              Create your account and start your sustainable journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* GRID NAMA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Name *</label>
                    <input
                        name="firstName"
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                        placeholder="John"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                    <input
                        name="lastName"
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone *</label>
                <input
                    name="phone"
                    type="tel"
                    onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                    placeholder="+62 812..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address *</label>
                <textarea
                    name="address"
                    rows="2"
                    onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent resize-none"
                    placeholder="Full address..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City *</label>
                <input
                    name="city"
                    onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                    placeholder="Jakarta"
                />
            </div>

            <div className="space-y-2 pt-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email *</label>
                <input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                    placeholder="john@example.com"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password *</label>
                <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition-all placeholder:text-gray-300 bg-transparent"
                    placeholder="••••••••"
                />
            </div>

            {err && <div className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{err}</div>}

            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#111] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
                {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-6">
            <p className="text-xs text-gray-400">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-black font-bold hover:underline underline-offset-4 ml-1 transition-all">
                Login here
                </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* BAGIAN KANAN: GAMBAR (Hanya Desktop) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#EAE8E6]">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Register Fashion" 
            className="w-full h-full object-cover grayscale opacity-90"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </motion.div>
        
        <div className="absolute top-12 right-12 text-white z-10 text-right">
          <h2 className="text-4xl font-serif italic mb-2">Curated.</h2>
          <p className="text-xs uppercase tracking-[0.3em] opacity-80">Timeless Pieces</p>
        </div>
      </div>

    </div>
  );
}