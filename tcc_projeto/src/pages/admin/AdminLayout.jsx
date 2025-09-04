import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../css/admin-theme.css";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const loc = useLocation();
  const navigate = useNavigate();

  const goLogout = () => {
    logout?.();
    navigate("/login", { state: { fromLogout: true } });
  };

  const isActive = (path) => loc.pathname === path;

  return (
    <div className="admin-shell">
      <aside className="admin-aside">
        <div className="brand">
          <span className="dot" /> Painel Admin
        </div>

        <nav className="menu">
          <Link
            className={`menu-item ${isActive("/admin") ? "active" : ""}`}
            to="/admin"
          >
            <i className="fas fa-gauge" /> <span>Início</span>
          </Link>
          <Link
            className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
            to="/admin/users"
          >
            <i className="fas fa-users" /> <span>Usuários</span>
          </Link>
        
        </nav>
      </aside>

      <div className="admin-body">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>Área Administrativa</h1>
          </div>
          <div className="topbar-right">
            <div className="me">
              <i className="fas fa-user-shield" />
              <span>{user?.nome || "Admin"}</span>
            </div>
            <Link to="/" className="btn-outline">
              <i className="fas fa-globe" style={{ marginRight: 6 }} />
              Ver site
            </Link>
            <button className="btn-logout" onClick={goLogout}>
              <i className="fas fa-right-from-bracket" /> Sair
            </button>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
