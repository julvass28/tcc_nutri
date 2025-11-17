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
import SpinnerOverlay from "../../components/SpinnerOverlay";

export default function AdminLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // overlay spinner para navegações do menu
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMsg, setOverlayMsg] = useState("Carregando…");

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

  // navegação com overlay (padronizada)
  const navigateWithOverlay = async (to) => {
    setOverlayMsg("Abrindo…");
    setOverlayOpen(true);
    // deixar visível por um tempo mínimo (UX)
    await new Promise((res) => setTimeout(res, 650));
    setSidebarOpen(false);
    navigate(to);
    setOverlayOpen(false);
  };

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

          <button className="adm-btn" onClick={() => navigateWithOverlay("/")}>
            <FaGlobe />
            <span>Ver site</span>
          </button>

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
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin"); }}
          >
            <FaHouseUser className="ico" />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin/users"); }}
          >
            <FaUsers className="ico" />
            <span>Usuários</span>
          </NavLink>

          <NavLink
            to="/admin/receitas"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin/receitas"); }}
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
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin/preco"); }}
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
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin/faq"); }}
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
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin/agenda-full"); }}
          >
            <FaCalendarAlt className="ico" />
            <span>Minha Agenda</span>
          </NavLink>

          <NavLink
            to="/admin/consultas"
            className={({ isActive }) =>
              "adm-navlink" + (isActive ? " adm-is-active" : "")
            }
            onClick={(e) => { e.preventDefault(); navigateWithOverlay("/admin/consultas"); }}
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

      <SpinnerOverlay open={overlayOpen} message={overlayMsg} />
    </div>
  );
}
