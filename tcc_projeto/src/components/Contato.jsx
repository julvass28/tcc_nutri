// tcc_projeto/src/components/Contato.jsx
import { useEffect, useState } from "react";
import "../css/contato.css";
import contatoTelefone from "../assets/contato_telefone.png";
import contatoConversa from "../assets/contato_conversa.png";
import contatoChamada from "../assets/contato_chamada.png";
import { API } from "../services/api"; // assume que API está definido aqui

export default function Contato() {
  const [config, setConfig] = useState({
    nome: "Nutricionista Natália Simanoviski", // permanece como fallback se quiser exibir nome
    telefone: "1130711252",
    whatsapp: "11976120337",
    email: "dranatalia@simanovski.com",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Chamada pública conforme seu backend: GET /config/contact-info
        const r = await fetch(`${API}/config/contact-info`);
        if (!r.ok) {
          console.warn("Contato: resposta não OK", r.status);
          setLoading(false);
          return;
        }
        const data = await r.json();
        // backend retorna { email, telefone, whatsapp }
        setConfig((prev) => ({
          ...prev,
          email: data.email || prev.email,
          telefone: data.telefone || prev.telefone,
          whatsapp: data.whatsapp || data.telefone || prev.whatsapp,
        }));
      } catch (err) {
        console.error("Erro ao buscar /config/contact-info:", err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers
  const onlyDigits = (s = "") => (s + "").replace(/\D/g, "");
  const ensureCountry = (digits = "") => {
    if (!digits) return "";
    if (digits.length >= 12) return digits;
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return `55${digits}`;
  };

  const telefoneDigits = onlyDigits(config.telefone);
  const whatsappDigits = onlyDigits(config.whatsapp);
  const telHref =
    telefoneDigits.length > 0
      ? `tel:+${ensureCountry(telefoneDigits)}`
      : whatsappDigits.length > 0
      ? `tel:+${ensureCountry(whatsappDigits)}`
      : "#";
  const waHref =
    whatsappDigits.length > 0
      ? `https://wa.me/${ensureCountry(whatsappDigits)}`
      : telefoneDigits.length > 0
      ? `https://wa.me/${ensureCountry(telefoneDigits)}`
      : "#";
  const mailHref = config.email ? `mailto:${config.email}` : "#";

  return (
    <section className="contato-wrap" aria-labelledby="contato-title">
      <div className="contato-container">
        <h2 id="contato-title" className="contato-heading">
          Entre em Contato ou Agende sua Consulta
        </h2>
        <span className="contato-divider" aria-hidden="true" />

        <div className="contato-grid">
          {/* Telefone */}
          <div className="contato-item">
            <img
              src={contatoChamada}
              alt="Ícone de telefone"
              className="contato-icon"
              loading="lazy"
            />
            <a className="contato-link" href={telHref}>
              Ligue para nós
            </a>
            <p className="contato-sub">
              {loading ? "Carregando..." : formatDisplayPhone(config.telefone)}
            </p>
            <span className="contato-mini-bar" aria-hidden="true" />
          </div>

          {/* WhatsApp / Mensagem */}
          <div className="contato-item">
            <img
              src={contatoConversa}
              alt="Ícone de conversa"
              className="contato-icon"
              loading="lazy"
            />
            <a
              className="contato-link"
              href={waHref}
              target={waHref === "#" ? undefined : "_blank"}
              rel={waHref === "#" ? undefined : "noreferrer"}
            >
              Mande uma mensagem
            </a>
            <p className="contato-sub">
              {loading ? "Carregando..." : formatDisplayPhone(config.whatsapp || config.telefone)}
            </p>
            <span className="contato-mini-bar" aria-hidden="true" />
          </div>

          {/* E-mail */}
          <div className="contato-item">
            <img
              src={contatoTelefone}
              alt="Ícone de e-mail"
              className="contato-icon"
              loading="lazy"
            />
            <a className="contato-link" href={mailHref}>
              Envie um e-mail
            </a>
            <p className="contato-sub">{loading ? "Carregando..." : config.email}</p>
            <span className="contato-mini-bar" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Formatação exibida */
function formatDisplayPhone(raw = "") {
  const d = (raw + "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length > 11 && d.startsWith("55")) {
    const dd = d.slice(2);
    if (dd.length === 11) return `(${dd.slice(0, 2)}) ${dd.slice(2, 7)}-${dd.slice(7)}`;
    if (dd.length === 10) return `(${dd.slice(0, 2)}) ${dd.slice(2, 6)}-${dd.slice(6)}`;
  }
  return d;
}
