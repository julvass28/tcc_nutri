import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3001/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, [token]);

  const login = (tk) => {
    localStorage.setItem("token", tk);
    setToken(tk);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
