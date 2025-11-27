import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth/login");
  };

  return (
    <div className="max-w-xl mx-auto pt-16 pb-20">
      <div className="bg-white p-10 rounded-2xl shadow-sm text-center space-y-8 relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
        <div className="w-28 h-28 mx-auto rounded-full bg-[#f4f2f0] overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
          {user?.email ? (
             <span className="font-serif text-4xl italic text-black">{user.email[0].toUpperCase()}</span>
          ) : (
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-[#111]">
            {user?.email ? user.email.split('@')[0] : "Guest"}
          </h2>
          <p className="text-sm text-gray-400 font-mono">{user?.email || "No active session"}</p>
          <div className="pt-2">
            <span className="px-4 py-1.5 bg-[#111] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Member
            </span>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 w-full">
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-xs uppercase tracking-widest font-bold"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}