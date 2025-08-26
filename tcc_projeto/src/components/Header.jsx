import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import "../css/Header.css";
import { FaWhatsapp, FaInstagram, FaUser, FaChevronDown, FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import Botao from "./botao/Botao";
import logo from "../assets/img_png/Logo.png";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openPerfilMenu, setOpenPerfilMenu] = useState(false);
  const perfilRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  // Ao clicar em "Sair": desloga e vai para /login com flag de origem
  const handleLogoutAndGoLogin = async () => {
    try {
      setOpenPerfilMenu(false);
      setOpenMenu(false);
      await logout();
    } finally {
      navigate("/login", { state: { fromLogout: true } });
    }
  };

  // Fecha o dropdown do perfil ao clicar fora/ESC
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!perfilRef.current) return;
      if (openPerfilMenu && !perfilRef.current.contains(e.target)) setOpenPerfilMenu(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpenPerfilMenu(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openPerfilMenu]);

  return (
    <header className="menu">
      {/* Hamburguer */}
      <button className="btn-mobile" onClick={() => setOpenMenu(!openMenu)}>
        <FaBars />
      </button>

      {/* Ícones à esquerda */}
      <div className="icons">
        <HiOutlineEnvelope className="icon" />
        <FaWhatsapp className="icon" />
        <FaInstagram className="icon" />
      </div>

      {/* MENU LATERAL (mobile) */}
      <nav className={`nav-itens left ${openMenu ? "open" : ""}`}>
        <button className="btn-mobile" onClick={() => setOpenMenu(false)}>
          <FaXmark className="xis" />
        </button>
        <ul>
          <li className="dropdown nav-section">
            <span
              className={`nav-text ${openDropdown === "servicos" ? "ativo" : ""}`}
              onClick={() => toggleDropdown("servicos")}
            >
              Serviços <FaChevronDown className={`seta ${openDropdown === "servicos" ? "rotated" : ""}`} />
            </span>
            <ul className={`dropdown-menu ${openDropdown === "servicos" ? "show" : ""}`}>
              <li><Link to="/especialidade/esportiva" onClick={() => setOpenDropdown(null)}>Nutrição Esportiva</Link></li>
              <li><Link to="/especialidade/pediatrica" onClick={() => setOpenDropdown(null)}>Nutrição Pediátrica</Link></li>
              <li><Link to="/especialidade/clinica" onClick={() => setOpenDropdown(null)}>Nutrição Clínica</Link></li>
              <li><Link to="/especialidade/emagrecimento" onClick={() => setOpenDropdown(null)}>Emagrecimento e Obesidade</Link></li>
              <li><Link to="/especialidade/intolerancia" onClick={() => setOpenDropdown(null)}>Intolerâncias Alimentares</Link></li>
            </ul>
          </li>

          <li className="dropdown nav-section">
            <span className={`nav-text ${openDropdown === "blog" ? "ativo" : ""}`} onClick={() => toggleDropdown("blog")}>
              Blog <FaChevronDown className={`seta ${openDropdown === "blog" ? "rotated" : ""}`} />
            </span>
            <ul className={`dropdown-menu ${openDropdown === "blog" ? "show" : ""}`}>
              <li><Link to="/DicaNutri-Praia" onClick={() => setOpenDropdown(null)}>Dicas Alimentares</Link></li>
              <li><Link to="/receitas/clinica" onClick={() => setOpenDropdown(null)}>Receitas</Link></li>
            </ul>
          </li>

          <li className="dropdown nav-section">
            <span
              className={`nav-text ${openDropdown === "calculadoras" ? "ativo" : ""}`}
              onClick={() => toggleDropdown("calculadoras")}
            >
              Calculadoras <FaChevronDown className={`seta ${openDropdown === "calculadoras" ? "rotated" : ""}`} />
            </span>
            <ul className={`dropdown-menu ${openDropdown === "calculadoras" ? "show" : ""}`}>
              <li><Link to="/calculadoras/gasto-calorico" onClick={() => setOpenDropdown(null)}>Gastos Calóricos</Link></li>
              <li><Link to="/calculadoras/imc" onClick={() => setOpenDropdown(null)}>IMC e Peso Ideal</Link></li>
              <li><Link to="/calculadoras/consumo-agua" onClick={() => setOpenDropdown(null)}>Consumo Diário de Água</Link></li>
            </ul>
          </li>

          {/* Links avulsos mobile */}
          <div className="mobile-only">
            <ul className="nav-section">
              <li><Link to="/sobre"><span className="nav-text mobile">Sobre</span></Link></li>
              <li><Link to="/contato"><span className="nav-text mobile">Contato</span></Link></li>
              <li><Link to="#"><span className="nav-text mobile">Agendar Consulta</span></Link></li>
            </ul>

            <div className="infos-mobile">
              <p className="tel">(11) 94030-2492</p>
              <p className="email">dranatalia@simanovski.com</p>
            </div>

            <Botao className="botao-header">Agendar Consulta</Botao>

            <div className="mobile-icons">
              <HiOutlineEnvelope className="icon-mobile" />
              <FaWhatsapp className="icon-mobile" />
              <FaInstagram className="icon-mobile" />
            </div>
          </div>
        </ul>

        {/* BLOCO PERFIL — aparece SÓ dentro do menu lateral e no final do painel */}
        {user && (
          <div className="perfil-mobile-bloco">
            <div className="perfil-mobile-header">
              {user?.fotoUrl ? (
                <img src={user.fotoUrl} alt={user.nome} className="perfil-mobile-foto" />
              ) : (
                <FaUser className="perfil-mobile-icon" />
              )}
              <span>Olá, <strong>{user.nome}</strong></span>
            </div>
            <ul className="perfil-mobile-menu">
              <li><Link to="/perfil" onClick={() => setOpenMenu(false)}>Meu Perfil</Link></li>
              <li><button onClick={handleLogoutAndGoLogin} className="logout-btn">Sair</button></li>
            </ul>
          </div>
        )}
      </nav>

      {/* Logo central */}
      <div className="logo">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>

      {/* Menu desktop à direita */}
      <nav className="nav-itens right">
        <ul>
          <li><Link to="/sobre"><span className="nav-text">Sobre</span></Link></li>
          <li><Link to="/contato"><span className="nav-text">Contato</span></Link></li>
          <li><Link to="#"><span className="nav-text">Agendar Consulta</span></Link></li>
        </ul>
      </nav>

      {/* PERFIL - DESKTOP (dropdown por clique) */}
      <div className="perfil-desktop" ref={perfilRef}>
        {user?.nome ? (
          <div className="perfil-dropdown">
            <button
              type="button"
              className="perfil-trigger"
              onClick={() => setOpenPerfilMenu(v => !v)}
              aria-haspopup="menu"
              aria-expanded={openPerfilMenu}
            >
              <span className="perfil-nome">Olá, <strong>{user.nome}</strong></span>
              {user?.fotoUrl ? (
                <img src={user.fotoUrl} alt={user.nome} className="perfil-foto" />
              ) : (
                <FaUser className="user" />
              )}
            </button>

            {openPerfilMenu && (
              <ul className="perfil-dropdown-menu" role="menu">
                <li role="none"><Link role="menuitem" to="/perfil" onClick={() => setOpenPerfilMenu(false)}>Meu Perfil</Link></li>
                <li role="none"><button role="menuitem" onClick={handleLogoutAndGoLogin} className="logout-btn">Sair</button></li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login"><FaUser title="Fazer login" className="user" /></Link>
        )}
      </div>
    </header>
  );
}

export default Header;
