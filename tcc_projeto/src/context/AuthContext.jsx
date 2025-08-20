// tcc_projeto/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // carrega usuário corrente
  const loadUser = async (tk) => {
    const useToken = tk || token;
    if (!useToken) return;
    try {
      const res = await fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${useToken}` },
      });
      if (!res.ok) throw new Error();
      const userData = await res.json();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (tk) => {
    localStorage.setItem("token", tk);
    setToken(tk);
    loadUser(tk); // usa o token novo imediatamente
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
