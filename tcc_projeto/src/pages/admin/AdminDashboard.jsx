// src/pages/admin/AdminDashboard.jsx
import React, { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/admin-theme.css";

import {
  FaArrowLeft,
  FaEdit,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaUtensils,
  FaQuestionCircle,
} from "react-icons/fa";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const hojeFmt = useMemo(() => {
    const d = new Date();
    const fmt = new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
    // ex.: "sex., 4 de abril" -> ajusta para "sex, 4 de abril"
    return fmt.format(d).replace(".,", ",").replace(".", "");
  }, []);

  const displayName = user?.nome ? `Dra. ${user.nome}` : "Dra. Administradora";
  const cards = [
    { to: "/admin/users", icon: <FaUsers />, label1: "Usuários", label2: "Cadastrados" },
    { to: "/admin/agenda", icon: <FaCalendarAlt />, label1: "Minha", label2: "Agenda" },
    { to: "/admin/consultas", icon: <FaClipboardList />, label1: "Consultas", label2: "" },
    { to: "/admin/receitas", icon: <FaUtensils />, label1: "Criar", label2: "Receitas" },
    { to: "/admin/faq", icon: <FaQuestionCircle />, label1: "FAQ", label2: "" },
  ];

  return (
    <div className="admin-home">
      <style>{`
        .admin-home{--rose:#D1A0A0;--olive:#8A8F75;--bg:#ECE7E6;--text:#2E2E2E}
        .hero{
          position:relative;border-radius:14px;overflow:hidden;
          background: #f5f3f2; border:1px solid var(--border);
          min-height:180px; display:flex; align-items:flex-end;
        }
       
.hero .wave{
  position:absolute;
  inset:auto 0 0 0;
  height:68%;
  pointer-events:none;
  background: linear-gradient(180deg,#D6DBCE 0%, #E7ECE3 100%);
  /* curvas mais bruscas, grandes picos/vales */
  clip-path: path("M 0 72% C 15% 100% 30% 44% 50% 74% C 70% 104% 85% 36% 100% 70% L 100% 0 L 0 0 Z");
  filter: drop-shadow(0 6px 16px rgba(0,0,0,.08));
  animation: waveFloat 8s ease-in-out infinite alternate;
}

.hero .wave::after{
  content:"";
  position:absolute;
  inset:auto 0 0 0;
  height:74%;
  background: linear-gradient(180deg,#C9CEC1 0%, #DADFD6 100%);
  /* segunda curva ainda mais agressiva */
  clip-path: path("M 0 68% C 18% 110% 36% 34% 54% 80% C 74% 120% 90% 32% 100% 68% L 100% 0 L 0 0 Z");
  opacity:.55;
  animation: waveDrift 14s ease-in-out infinite alternate;
}

/* animações */
@keyframes waveFloat{
  0%   { transform: translateY(0) }
  100% { transform: translateY(12px) }
}
@keyframes waveDrift{
  0%   { transform: translateY(0) translateX(0) }
  100% { transform: translateY(10px) translateX(12px) }
}

@media (prefers-reduced-motion: reduce){
  .hero .wave, .hero .wave::after{ animation:none }
}

        .hero .content{
          position:relative; z-index:1; width:100%;
          padding: 22px 20px 18px 20px;
        }
        .hero h1{
          margin:0 0 8px; font-size:28px; color:#B47883; /* rosé mais escuro pro título */
          font-weight:800; letter-spacing:.2px;
        }
        .hero .sub{
          display:flex; align-items:center; gap:8px; color:#5f6b55; font-weight:600
        }
        .hero .edit{
          margin-left:auto; display:inline-flex; align-items:center; gap:6px;
          color:#5f6b55; text-decoration:none; font-weight:600;
        }
        .hero .topline{
          position:absolute; top:12px; left:12px; right:12px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .hero .back{
          display:inline-flex; align-items:center; gap:8px;
          color:#6c7a5b; background:transparent; border:none; cursor:pointer;
          font-weight:600;
        }

        /* GRID de atalhos */
        .tiles{
          display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap:16px; margin-top:14px;
        }
        .tile{
          background:#fff; border:1px solid var(--rose);
          border-radius:14px; padding:16px;
          display:flex; align-items:center; gap:12px;
          text-decoration:none; color:var(--text);
          box-shadow: 0 2px 0 rgba(212,159,159,.35);
          transition:.15s ease;
        }
        .tile:hover{ transform: translateY(-1px); box-shadow:0 6px 18px rgba(0,0,0,.1) }
        .tile .ico{
          width:42px; height:42px; border-radius:12px;
          display:grid; place-items:center; background:rgba(209,160,160,.15);
          color:#B47883; font-size:20px;
        }
        .tile .labels{line-height:1.1}
        .tile .labels b{font-size:18px}
        .tile .labels small{display:block; color:#6b6b6b; margin-top:2px}

        /* caixinha que segura as tiles (fica "solta" como no Figma) */
        .panel{
          margin-top:14px; background:#fff; border:1px solid var(--border);
          border-radius:14px; padding:18px;
        }

        /* responsivo */
        @media (max-width:720px){
          .hero h1{font-size:24px}
          .tile{padding:14px}
        }
      `}</style>

      <div className="hero">
        <div className="wave" />
        <div className="topline">
         

          <Link className="edit" to="/perfil">
            <FaEdit /> Editar Perfil
          </Link>
        </div>

        <div className="content">
          <h1>Bem-vinda, {displayName}</h1>
          <div className="sub">
            <FaCalendarAlt />
            <span>{hojeFmt}</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="tiles">
          {cards.map((c, i) => (
            <Link key={i} to={c.to} className="tile">
              <div className="ico">{c.icon}</div>
              <div className="labels">
                <b>{c.label1}</b>
                {c.label2 ? <small>{c.label2}</small> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
