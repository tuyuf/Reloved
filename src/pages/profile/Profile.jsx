import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext"; 
import { uploadAvatar } from "../../lib/uploadImage"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, token, updateProfile, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setFormData({
        firstName: meta.first_name || "",
        lastName: meta.last_name || "",
        phone: meta.phone || "",
        address: meta.address || "",
        city: meta.city || "",
        avatar_url: meta.avatar_url || ""
      });
      setAvatarPreview(meta.avatar_url || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar (Maks 2MB)");
        return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalAvatarUrl = formData.avatar_url;

      if (avatarFile && user) {
        const uploadedUrl = await uploadAvatar(avatarFile, user.id);
        if (uploadedUrl) {
            finalAvatarUrl = uploadedUrl;
        }
      }

      if (token) {
          await updateProfile({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            avatar_url: finalAvatarUrl 
          });
          alert("Profil berhasil diperbarui!");
          setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Gagal memperbarui profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto pt-24 pb-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-[#111]"></div>

        <div className="text-center mb-8">
          {/* AVATAR SECTION */}
          <div className="relative w-28 h-28 mx-auto mb-4 group">
             <div className="w-full h-full rounded-full bg-[#F4F2F0] flex items-center justify-center border-[5px] border-white shadow-lg overflow-hidden relative">
                {avatarPreview ? (
                   <img 
                     src={avatarPreview} 
                     alt="Profile" 
                     className="w-full h-full object-cover" 
                     key={avatarPreview} 
                   />
                ) : (
                   <span className="font-serif text-4xl italic text-black font-bold">
                      {user.email ? user.email[0].toUpperCase() : "?"}
                   </span>
                )}
             </div>
             
             {isEditing && (
               <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="text-center text-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="text-[9px] font-bold uppercase tracking-widest block">Upload</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
               </label>
             )}

             {!isEditing && (
               <div className="absolute -bottom-3 right-0 left-0 mx-auto w-fit bg-black text-white text-[9px] px-3 py-1 rounded-full uppercase tracking-widest font-bold border-4 border-white shadow-sm z-20">
                  Member
               </div>
             )}
          </div>
          
          <h2 className="text-3xl font-serif text-[#111] mb-1 capitalize">
            {formData.firstName || "Welcome,"} {formData.lastName}
          </h2>
          <p className="text-xs text-gray-400 font-mono tracking-wide">{user.email}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] border border-gray-100 px-4 py-3 rounded-xl text-sm focus:border-black focus:bg-white transition-colors outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] border border-gray-100 px-4 py-3 rounded-xl text-sm focus:border-black focus:bg-white transition-colors outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-gray-100 px-4 py-3 rounded-xl text-sm focus:border-black focus:bg-white transition-colors outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Address</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-gray-100 px-4 py-3 rounded-xl text-sm focus:border-black focus:bg-white transition-colors outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-gray-100 px-4 py-3 rounded-xl text-sm focus:border-black focus:bg-white transition-colors outline-none"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                   setIsEditing(false);
                   setAvatarPreview(user.user_metadata?.avatar_url || null);
                   setAvatarFile(null);
                }}
                className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-bold uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-bold uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100/50 space-y-6">
               <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Personal Details</h3>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] font-bold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
                  >
                    EDIT
                  </button>
               </div>
               
               <div className="grid grid-cols-1 gap-6 text-sm">
                  <div className="flex gap-4 items-start">
                     <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 text-lg shadow-sm">📍</div>
                     <div>
                        <div className="font-bold text-gray-900 mb-1">Shipping Address</div>
                        <div className="text-gray-500 leading-relaxed text-xs">
                           {formData.address ? (
                               <>
                                {formData.address}<br/>
                                {formData.city}
                               </>
                           ) : (
                               <span className="italic text-gray-400">No address set.</span>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start">
                     <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 text-lg shadow-sm">📞</div>
                     <div>
                        <div className="font-bold text-gray-900 mb-1">Contact Number</div>
                        <div className="text-gray-500 text-xs">
                           {formData.phone || <span className="italic text-gray-400">No phone set.</span>}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-xl border border-red-100 text-red-500 bg-white hover:bg-red-50 transition-all text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
              >
                <span>Sign Out</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}