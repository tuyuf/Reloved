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

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);