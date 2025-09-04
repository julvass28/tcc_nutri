import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRouteAdmin({ children }) {
  const { user, token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <div style={{ padding: 24 }}>Carregando…</div>;
  if (!user.isAdmin) return <Navigate to="/login" replace />;

  return children;
}
