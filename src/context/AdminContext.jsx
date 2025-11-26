import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const loginAdmin = (pin) => {
    if (pin === import.meta.env.VITE_ADMIN_PIN) setIsAdmin(true);
    return pin === import.meta.env.VITE_ADMIN_PIN;
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
