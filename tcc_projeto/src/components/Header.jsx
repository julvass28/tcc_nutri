import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import "../css/Header.css";
import {
  FaWhatsapp,
  FaInstagram,
  FaUser,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import Botao from "./botao/Botao";
import logo from "../assets/img_png/Logo.png";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openPerfilMenu, setOpenPerfilMenu] = useState(false);
  const [fotoOkDesk, setFotoOkDesk] = useState(true);
  const [fotoOkMob, setFotoOkMob] = useState(true);

  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [whatsAppLink, setWhatsAppLink] = useState(null);

  const perfilRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 regra: usuário administrativo (Admin ou Owner)
  const isAdminLike = user?.isAdmin || user?.isOwner;

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  // Fecha o menu lateral / dropdowns em TODA navegação
  useEffect(() => {
    setOpenMenu(false);
    setOpenDropdown(null);
    setOpenPerfilMenu(false);
  }, [location.pathname]);

  // Reseta fallback do avatar quando a URL mudar
  useEffect(() => {
    setFotoOkDesk(!!user?.fotoUrl);
    setFotoOkMob(!!user?.fotoUrl);
  }, [user?.fotoUrl]);

  const handleLogoutAndGoLogin = async () => {
    try {
      setOpenPerfilMenu(false);
      setOpenMenu(false);
      await logout();
    } finally {
      navigate("/login", { state: { fromLogout: true } });
    }
  };

  // Fecha dropdown do perfil ao clicar fora/ESC
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!perfilRef.current) return;
      if (openPerfilMenu && !perfilRef.current.contains(e.target))
        setOpenPerfilMenu(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpenPerfilMenu(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openPerfilMenu]);

  // helper: fechar painel ao clicar em qualquer link do menu lateral
  const closePanel = () => {
    setOpenMenu(false);
    setOpenDropdown(null);
  };

  // NOVO: buscar contato público para telefone/WhatsApp/e-mail
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/config/contact-info`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        const tel = data.whatsapp || data.telefone || "";
        setContactPhone(tel);
        setContactEmail(data.email || "");

        if (tel) {
          const digits = String(tel).replace(/\D/g, "");
          if (digits) {
            let withCountry = digits;
            if (digits.length === 11) {
              withCountry = `55${digits}`;
            }
            setWhatsAppLink(`https://wa.me/${withCountry}`);
          }
        }
      } catch {
        if (!isMounted) return;
        setContactPhone("");
        setContactEmail("");
        setWhatsAppLink(null);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="menu">
      {/* Hamburguer */}
      <button
        className="btn-mobile"
        onClick={() => setOpenMenu(!openMenu)}
        aria-label="Abrir menu"
      >
        <FaBars />
      </button>

      {/* Ícones à esquerda (desktop) */}
      <div className="icons">
        {/* Email → vai pra página de contato */}
        <Link to="/contato" className="icon-link uniform-icon">
          <HiOutlineEnvelope className="icon" />
        </Link>

        {/* WhatsApp → usa número configurado, se existir */}
        {whatsAppLink ? (
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link uniform-icon no-bg"
            aria-label="Falar com a nutricionista pelo WhatsApp"
          >
            <FaWhatsapp className="icon" />
          </a>
        ) : (
          <button
            type="button"
            className="icon-link uniform-icon no-bg"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="icon" />
          </button>
        )}

        {/* Instagram */}
        <a
          href="https://www.instagram.com/neven.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link uniform-icon"
        >
          <FaInstagram className="icon" />
        </a>
      </div>

      {/* MENU LATERAL (mobile) */}
      <nav
        className={`nav-itens left ${openMenu ? "open" : ""}`}
        aria-hidden={!openMenu}
      >
        <button
          className="btn-mobile"
          onClick={() => setOpenMenu(false)}
          aria-label="Fechar menu"
        >
          <FaXmark className="xis" />
        </button>

        <ul>
          {/* ... (resto dos dropdowns de serviços/blog/calculadoras igual) */}

          {/* Serviços */}
          <li className="dropdown nav-section">
            <span
              className={`nav-text ${
                openDropdown === "servicos" ? "ativo" : ""
              }`}
              onClick={() => toggleDropdown("servicos")}
            >
              Serviços{" "}
              <FaChevronDown
                className={`seta ${
                  openDropdown === "servicos" ? "rotated" : ""
                }`}
              />
            </span>
            <ul
              className={`dropdown-menu ${
                openDropdown === "servicos" ? "show" : ""
              }`}
            >
              <li>
                <Link to="/especialidade/esportiva" onClick={closePanel}>
                  Nutrição Esportiva
                </Link>
              </li>
              <li>
                <Link to="/especialidade/pediatrica" onClick={closePanel}>
                  Nutrição Pediátrica
                </Link>
              </li>
              <li>
                <Link to="/especialidade/clinica" onClick={closePanel}>
                  Nutrição Clínica
                </Link>
              </li>
              <li>
                <Link to="/especialidade/emagrecimento" onClick={closePanel}>
                  Emagrecimento e Obesidade
                </Link>
              </li>
              <li>
                <Link to="/especialidade/intolerancia" onClick={closePanel}>
                  Intolerâncias Alimentares
                </Link>
              </li>
            </ul>
          </li>

          {/* Blog */}
          <li className="dropdown nav-section">
            <span
              className={`nav-text ${openDropdown === "blog" ? "ativo" : ""}`}
              onClick={() => toggleDropdown("blog")}
            >
              Blog{" "}
              <FaChevronDown
                className={`seta ${openDropdown === "blog" ? "rotated" : ""}`}
              />
            </span>
            <ul
              className={`dropdown-menu ${
                openDropdown === "blog" ? "show" : ""
              }`}
            >
              <li>
                <Link to="/DicaNutri-Praia" onClick={closePanel}>
                  Dicas Alimentares
                </Link>
              </li>
              <li>
                <Link to="/receitas/clinica" onClick={closePanel}>
                  Receitas
                </Link>
              </li>
            </ul>
          </li>

          {/* Calculadoras */}
          <li className="dropdown nav-section">
            <span
              className={`nav-text ${
                openDropdown === "calculadoras" ? "ativo" : ""
              }`}
              onClick={() => toggleDropdown("calculadoras")}
            >
              Calculadoras{" "}
              <FaChevronDown
                className={`seta ${
                  openDropdown === "calculadoras" ? "rotated" : ""
                }`}
              />
            </span>
            <ul
              className={`dropdown-menu ${
                openDropdown === "calculadoras" ? "show" : ""
              }`}
            >
              <li>
                <Link to="/calculadoras/gasto-calorico" onClick={closePanel}>
                  Gastos Calóricos
                </Link>
              </li>
              <li>
                <Link to="/calculadoras/imc" onClick={closePanel}>
                  IMC e Peso Ideal
                </Link>
              </li>
              <li>
                <Link to="/calculadoras/consumo-agua" onClick={closePanel}>
                  Consumo Diário de Água
                </Link>
              </li>
            </ul>
          </li>

          {/* Links avulsos mobile */}
          <div className="mobile-only">
            <ul className="nav-section">
              <li>
                <Link to="/sobre" onClick={closePanel}>
                  <span className="nav-text mobile">Sobre</span>
                </Link>
              </li>
              <li>
                <Link to="/contato" onClick={closePanel}>
                  <span className="nav-text mobile">Contato</span>
                </Link>
              </li>
            </ul>

            <div className="infos-mobile">
              <p className="tel">{contactPhone || "(11) 94030-2492"}</p>
              <p className="email">
                {contactEmail || "contato@nataliasimanoviski.com"}
              </p>
            </div>

            <Botao
              to="/agendar-consulta"
              className="botao-header"
              onClick={closePanel}
            >
              Agendar Consulta
            </Botao>

            <div className="mobile-icons">
              <HiOutlineEnvelope className="icon-mobile" />
              {whatsAppLink ? (
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar com a nutricionista pelo WhatsApp"
                >
                  <FaWhatsapp className="icon-mobile" />
                </a>
              ) : (
                <FaWhatsapp className="icon-mobile" />
              )}
              <FaInstagram className="icon-mobile" />
            </div>
          </div>
        </ul>

        {/* BLOCO PERFIL — mobile */}
        {user && (
          <div className="perfil-mobile-bloco">
            <div className="perfil-mobile-header">
              {user?.fotoUrl && fotoOkMob ? (
                <img
                  src={user.fotoUrl}
                  alt={user.nome || "Foto do perfil"}
                  className="perfil-mobile-foto"
                  onError={() => setFotoOkMob(false)}
                />
              ) : (
                <FaUser className="perfil-mobile-icon" />
              )}
              <span>
                Olá, <strong>{user.nome}</strong>
              </span>
            </div>
            <ul className="perfil-mobile-menu">
              {!user?.isOwner && (
                <li>
                  <Link to="/perfil" onClick={closePanel}>
                    Meu Perfil
                  </Link>
                </li>
              )}

              {/* 👉 Minhas consultas: só se NÃO for Admin nem Owner */}
              {!isAdminLike && (
                <li>
                  <Link to="/minhas-consultas" onClick={closePanel}>
                    Minhas consultas
                  </Link>
                </li>
              )}

              {user?.isAdmin && (
                <li>
                  <Link to="/admin" onClick={closePanel}>
                    Página Admin
                  </Link>
                </li>
              )}

              <li>
                <button onClick={handleLogoutAndGoLogin} className="logout-btn">
                  Sair
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Logo central + login rápido no mobile */}
      <div className="logo">
        <Link to="/" aria-label="Página inicial">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {!user && (
        <Link
          to="/login"
          className="quick-login"
          aria-label="Entrar / Criar conta"
        >
          <FaUser className="user user--green" />
        </Link>
      )}

      {/* Menu desktop à direita */}
      <nav className="nav-itens right">
        <ul>
          <li>
            <Link to="/sobre">
              <span className="nav-text">Sobre</span>
            </Link>
          </li>
          <li>
            <Link to="/contato">
              <span className="nav-text">Contato</span>
            </Link>
          </li>
          <li>
            <Link to="/agendar-consulta">
              <span className="nav-text">Agendar Consulta</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* PERFIL - DESKTOP */}
      <div className="perfil-desktop" ref={perfilRef}>
        {user?.nome ? (
          <div className="perfil-dropdown">
            <button
              type="button"
              className="perfil-trigger"
              onClick={() => setOpenPerfilMenu((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={openPerfilMenu}
            >
              <span className="perfil-nome">
                Olá, <strong>{user.nome}</strong>
              </span>

              {user?.fotoUrl && fotoOkDesk ? (
                <img
                  src={user.fotoUrl}
                  alt={user.nome || "Foto do perfil"}
                  className="perfil-foto"
                  onError={() => setFotoOkDesk(false)}
                />
              ) : (
                <FaUser className="user user--green" />
              )}
            </button>

            {openPerfilMenu && (
              <ul className="perfil-dropdown-menu" role="menu">
                {!user?.isOwner && (
                  <li role="none">
                    <Link
                      role="menuitem"
                      to="/perfil"
                      onClick={() => setOpenPerfilMenu(false)}
                    >
                      Meu Perfil
                    </Link>
                  </li>
                )}

                {/* 👉 Mesmo comportamento aqui: paciente vê, Admin/Owner não */}
                {!isAdminLike && (
                  <li role="none">
                    <Link
                      role="menuitem"
                      to="/minhas-consultas"
                      onClick={() => setOpenPerfilMenu(false)}
                    >
                      Minhas consultas
                    </Link>
                  </li>
                )}

                {user?.isAdmin && (
                  <li role="none">
                    <Link
                      role="menuitem"
                      to="/admin"
                      onClick={() => setOpenPerfilMenu(false)}
                    >
                      Página Admin
                    </Link>
                  </li>
                )}

                <li role="none">
                  <button
                    role="menuitem"
                    onClick={handleLogoutAndGoLogin}
                    className="logout-btn"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login" aria-label="Entrar / Criar conta">
            <FaUser title="Fazer login" className="user user--green" />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
