// src/pages/admin/AdminLayout.jsx
import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaBook } from "react-icons/fa";
import {
  FaGlobe,
  FaSignOutAlt,
  FaHouseUser,
  FaCalendarAlt,
  FaUsers,
  FaBars,
  FaQuestionCircle,
  FaClipboardList,
} from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import "../../css/admin-theme.css";
import { LuCalendarRange } from "react-icons/lu";

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

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`adm-shell ${sidebarOpen ? "" : "adm-nav-collapsed"}`}>
      {/* TOPBAR FIXA */}
      <header className="adm-topbar adm-is-fixed">
        <div className="adm-topbar__left">
          <button
            type="button"
            className="adm-hamburger"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <FaBars />
          </button>
          <span className="adm-dot" />
          <strong>Área Administrativa</strong>
        </div>

        <div className="adm-topbar__right">
          <span className="adm-me">
            {user?.nome ? <small>{user.nome}</small> : <small>Admin</small>}
          </span>

          <NavLink to="/" className="adm-btn">
            <FaGlobe />
            <span>Ver site</span>
          </NavLink>

          <button
            className="adm-btn adm-btn--danger"
            onClick={handleLogoutAndGoLogin}
          >
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* SIDEBAR (off-canvas) */}
      <aside className="adm-sidebar adm-is-fixed" aria-label="Menu lateral">
        <div className="adm-sidebar__brand">Painel Admin</div>

        <nav className="adm-side-nav">
          <NavLink
            end
            to="/admin"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaHouseUser className="ico" />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers className="ico" />
            <span>Usuários</span>
          </NavLink>

          <NavLink
            to="/admin/receitas"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="ico">
              <FaBook />
            </span>
            <span>Receitas</span>
          </NavLink>
          <NavLink
            to="/admin/preco"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="ico">
              <RiMoneyDollarCircleFill />
            </span>
            <span>Ajustar o Preço</span>
          </NavLink>
          <NavLink
            to="/admin/faq"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="ico">
              <FaQuestionCircle />
            </span>
            <span>FAQ</span>
          </NavLink>
          <NavLink
            to="/admin/agenda-full"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarAlt className="ico" />
            <span>Minha Agenda</span>
          </NavLink>
          <NavLink
            to="/admin/agenda"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <LuCalendarRange className="ico" />
            <span>Controle Listado</span>
          </NavLink>
          <NavLink
            to="/admin/consultas"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardList className="ico" />
            <span>Consultas</span>
          </NavLink>
        </nav>
      </aside>

      {/* Overlay para fechar clicando fora (só quando aberto) */}
      {sidebarOpen && (
        <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* CONTEÚDO */}
      <main className="adm-content">
        <Outlet />
      </main>
    </div>
  );
}
