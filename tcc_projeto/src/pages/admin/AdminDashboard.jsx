// src/pages/admin/AdminDashboard.jsx
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/admin-theme.css";
import waveBg from "../../assets/onda-duas-cores.svg";
import { LuCalendarRange } from "react-icons/lu";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import {
  FaEdit,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaUtensils,
  FaQuestionCircle,
} from "react-icons/fa";
import SpinnerOverlay from "../../components/SpinnerOverlay";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMsg, setOverlayMsg] = useState("Carregando…");

  const hojeFmt = useMemo(() => {
    const d = new Date();
    const fmt = new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
    return fmt.format(d).replace(".,", ",").replace(".", "");
  }, []);

  const displayName = user?.nome ? `Dr(a). ${user.nome}` : "Dra. Administradora";

  const cards = [
    { to: "/admin/users", icon: <FaUsers />, label1: "Usuários", label2: "Cadastrados" },
    { to: "/admin/agenda-full", icon: <FaCalendarAlt />, label1: "Minha Agenda", label2: "Calendário Completo" },
    { to: "/admin/consultas", icon: <FaClipboardList />, label1: "Consultas", label2: "" },
    { to: "/admin/receitas", icon: <FaUtensils />, label1: "Criar", label2: "Receitas" },
    { to: "/admin/faq", icon: <FaQuestionCircle />, label1: "FAQ", label2: "" },
    { to: "/admin/preco", icon: <RiMoneyDollarCircleFill />, label1: "Ajustar Preço", label2: "R$ da Consulta" },
  ];

  const navigateWithSpinner = async (to, msg = "Abrindo…") => {
    setOverlayMsg(msg);
    setOverlayOpen(true);
    await new Promise((res) => setTimeout(res, 650));
    navigate(to);
    setOverlayOpen(false);
  };

  return (
    <div className="admin-home">
      <style>{`
        .admin-home{
          --rose:#D1A0A0; --olive:#8A8F75; --bg:#ECE7E6; --text:#2E2E2E;
          --border: rgba(0,0,0,.08);
          padding-top:100px;
        }
        .hero{
          position:relative;
          border-radius:14px;
          overflow:hidden;
          background:#f5f3f2;
          border:1px solid var(--border);
          min-height:180px;
          display:flex;
          align-items:flex-end;
        }
        .hero-bg{ position:absolute; inset:0; background-repeat:no-repeat; background-position: bottom center; background-size: 160% auto; opacity:1; pointer-events:none; display:none; }
        .hero.has-bg .hero-bg{ display:block; }
        .hero::after{ content:""; position:absolute; inset:0; background: linear-gradient(to top, rgba(255,255,255,.75), rgba(255,255,255,0)); pointer-events:none; }
        .hero .content{ position:relative; z-index:1; width:100%; padding: 22px 20px 18px 20px; }
        .hero h1{ margin:0 0 8px; font-size:28px; color:#D1A0A0; font-weight:800; letter-spacing:.2px; }
        .hero .sub{ display:flex; align-items:center; gap:8px; color:#5f6b55; font-weight:600; }
        .hero .topline{ position:absolute; top:12px; left:12px; right:12px; display:flex; align-items:center; justify-content:flex-end; z-index:1; }
        .panel{ margin-top:14px; background:#fff; border:1px solid var(--border); border-radius:14px; padding:18px; }
        .tiles{ display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-top:2px; }
        .tile{ background:#fff; border:1px solid var(--rose); border-radius:14px; padding:16px; display:flex; align-items:center; gap:12px; text-decoration:none; color:var(--text); box-shadow: 0 2px 0 rgba(212,159,159,.35); transition:.15s ease; cursor:pointer }
        .tile:hover{ transform: translateY(-1px); box-shadow:0 6px 18px rgba(0,0,0,.1) }
        .tile .ico{ width:42px; height:42px; border-radius:12px; display:grid; place-items:center; background:rgba(209,160,160,.15); color:#B47883; font-size:20px; }
        .tile .labels{line-height:1.1}
        .tile .labels b{font-size:18px}
        .tile .labels small{display:block; color:#6b6b6b; margin-top:2px}
      `}</style>

      <div className="hero has-bg">
        <div className="hero-bg" style={{ backgroundImage: `url(${waveBg})` }} />
        <div className="topline">
          <button className="edit" onClick={() => navigateWithSpinner("/admin/configuracoes", "Abrindo configurações…")} style={{background:"transparent", border:"none", color:"#444", fontWeight:600, cursor:"pointer"}}>
            <FaEdit /> Editar Perfil
          </button>
        </div>

        <div className="content">
          <h1>Bem-vindo(a), {displayName}</h1>
          <div className="sub">
            <FaCalendarAlt />
            <span>{hojeFmt}</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="tiles">
          {cards.map((c, i) => (
            <div key={i} className="tile" role="button" onClick={() => navigateWithSpinner(c.to, `Abrindo ${c.label1}…`)}>
              <div className="ico">{c.icon}</div>
              <div className="labels">
                <b>{c.label1}</b>
                {c.label2 ? <small>{c.label2}</small> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SpinnerOverlay open={overlayOpen} message={overlayMsg} />
    </div>
  );
}
