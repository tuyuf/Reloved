import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Cek apakah ada status admin yang tersimpan di browser
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("reloved_is_admin") === "true";
  });

  // Fungsi Login (Verifikasi PIN)
  const loginAdmin = (pin) => {
    const correctPin = import.meta.env.VITE_ADMIN_PIN || "123456"; // Default jika env belum diset
    
    if (pin === correctPin) {
      setIsAdmin(true);
      localStorage.setItem("reloved_is_admin", "true"); // Simpan sesi
      return true;
    }
    return false;
  };

  // Fungsi Logout
  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem("reloved_is_admin"); // Hapus sesi
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);