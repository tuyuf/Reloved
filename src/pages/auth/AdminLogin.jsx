import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext"; 
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      navigate("/admin"); 
    } else {
      setError("Incorrect PIN. Access Denied.");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] p-6 text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mx-auto mb-6 text-xl font-serif font-bold">
            A
          </div>
          <h1 className="text-3xl font-serif italic mb-2">Manager Access</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Restricted Area
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-[#222] border border-[#333] text-center text-white text-lg tracking-[0.5em] py-4 rounded-xl outline-none focus:border-white transition-colors placeholder:text-gray-700 font-mono"
              placeholder="••••••"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 text-center font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            Unlock Dashboard
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Return to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}