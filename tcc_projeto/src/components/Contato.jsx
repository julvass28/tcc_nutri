import "../css/contato.css";
import contatoTelefone from "../assets/contato_telefone.png";
import contatoConversa from "../assets/contato_conversa.png";
import contatoChamada from "../assets/contato_chamada.png";

export default function Contato() {
  return (
    <section className="contato-wrap" aria-labelledby="contato-title">
      <div className="contato-container">
        <h2 id="contato-title" className="contato-heading">
          Entre em Contato ou Agende sua Consulta
        </h2>
        <span className="contato-divider" aria-hidden="true" />

        <div className="contato-grid">
          <div className="contato-item">
            <img
              src={contatoChamada}
              alt="Ícone de telefone"
              className="contato-icon"
              loading="lazy"
            />
            <a className="contato-link" href="tel:+551130711252">
              Ligue para nós
            </a>
            <p className="contato-sub">(11) 3071-1252</p>
            <span className="contato-mini-bar" aria-hidden="true" />
          </div>

          <div className="contato-item">
            <img
              src={contatoConversa}
              alt="Ícone de conversa"
              className="contato-icon"
              loading="lazy"
            />
            <a
              className="contato-link"
              href="https://wa.me/5511976120337"
              target="_blank"
              rel="noreferrer"
            >
              Mande uma mensagem
            </a>
            <p className="contato-sub">(11) 97612-0337</p>
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
            <a className="contato-link" href="mailto:dranatalia@simanovski.com">
              Envie um e-mail
            </a>
            <p className="contato-sub">dranatalia@simanovski.com</p>
            <span className="contato-mini-bar" aria-hidden="true" />
          </div>
        </div>
      </div>
      
    </section>
  );
}
