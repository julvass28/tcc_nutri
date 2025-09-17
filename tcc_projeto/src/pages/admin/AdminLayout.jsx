// src/pages/admin/AdminLayout.jsx
import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaBook } from "react-icons/fa";
import {
  FaGlobe,
  FaSignOutAlt,
  FaHouseUser,
  FaUsers,
  FaBars,
} from "react-icons/fa";
import "../../css/admin-theme.css";

export default function AdminLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogoutAndGoLogin = async () => {
    try {
      await logout?.();
    } finally {
      navigate("/login", { state: { fromLogout: true } });
    }
  };

  // fecha no ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`admin-shell ${sidebarOpen ? "" : "nav-collapsed"}`}>
      {/* TOPBAR FIXA */}
      <header className="admin-topbar fixed">
        <div className="admin-topbar__left">
          <button
            type="button"
            className="hamburger"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <FaBars />
          </button>
          <span className="dot" />
          <strong>Área Administrativa</strong>
        </div>

        <div className="admin-topbar__right">
          <span className="me">
            {user?.nome ? <small>{user.nome}</small> : <small>Admin</small>}
          </span>

          <NavLink to="/" className="btn-top">
            <FaGlobe />
            <span>Ver site</span>
          </NavLink>

          <button className="btn-top danger" onClick={handleLogoutAndGoLogin}>
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* SIDEBAR (off-canvas) */}
      <aside className="admin-sidebar fixed" aria-label="Menu lateral">
        <div className="admin-sidebar__brand">Painel Admin</div>

        <nav className="side-nav">
          <NavLink
            end
            to="/admin"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaHouseUser className="ico" />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers className="ico" />
            <span>Usuários</span>
          </NavLink>

         <NavLink
  to="/admin/receitas"
  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
  onClick={() => setSidebarOpen(false)}
>
  <span className="ico"><FaBook/></span>
  <span>Receitas</span>
</NavLink>
          {/* Libera quando tiver as páginas:
          <NavLink to="/admin/agenda" className={({isActive}) => "nav-link" + (isActive ? " active" : "")} onClick={() => setSidebarOpen(false)}>
            <FaCalendarAlt className="ico" /><span>Agenda</span>
          </NavLink>
          <NavLink to="/admin/consultas" className={({isActive}) => "nav-link" + (isActive ? " active" : "")} onClick={() => setSidebarOpen(false)}>
            <FaClipboardList className="ico" /><span>Consultas</span>
          </NavLink>
          <NavLink to="/admin/recipes" className={({isActive}) => "nav-link" + (isActive ? " active" : "")} onClick={() => setSidebarOpen(false)}>
            <FaUtensils className="ico" /><span>Receitas</span>
          </NavLink>
          <NavLink to="/admin/faq" className={({isActive}) => "nav-link" + (isActive ? " active" : "")} onClick={() => setSidebarOpen(false)}>
            <FaQuestionCircle className="ico" /><span>FAQ</span>
          </NavLink>
          */}
        </nav>
      </aside>

      {/* Overlay para fechar clicando fora (só quando aberto) */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* CONTEÚDO */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
