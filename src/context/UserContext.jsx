import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("reloved_token"));

  useEffect(() => {
    async function loadSession() {
      if (!token) return;
      try {
        const userData = await api.auth.getUser(token);
        if (userData && userData.id) setUser(userData);
        else logout();
      } catch {
        logout();
      }
    }
    loadSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.auth.signIn(email, password);
      if (data.access_token) {
        localStorage.setItem("reloved_token", data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    if (token) await api.auth.signOut(token).catch(() => {});
    localStorage.removeItem("reloved_token");
    setToken(null);
    setUser(null);
  };

  // --- TAMBAHKAN FUNGSI INI ---
  const updateProfile = async (updates) => {
    if (!token) throw new Error("Anda harus login.");
    try {
      // Kita bungkus updates ke dalam properti 'data' karena ini adalah user_metadata di Supabase
      const updatedUser = await api.auth.updateUser(token, { data: updates });
      
      if (updatedUser) {
        setUser(updatedUser); // Update state lokal agar UI langsung berubah
        return { success: true };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    // JANGAN LUPA MASUKKAN updateProfile KE DALAM VALUE
    <UserContext.Provider value={{ user, token, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);