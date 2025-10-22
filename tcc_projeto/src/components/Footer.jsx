import { Link } from 'react-router-dom';
import React from 'react';
import '../css/Footer.css';
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram} from "react-icons/fa";
import FooterOnda from '../assets/Footer_onda.jsx';
import Botao from './botao/Botao.jsx';
import Logo from '../assets/img_png/Logo.png'

function Footer() {
  return (
    <div className='ftr-wrap'>
      <FooterOnda />
      <footer className='ftr'>

        <div className='ftr-container'>
          <nav className='ftr-nav'>

            <ul className='ftr-list'>
              <h3>Links Úteis</h3>
              <li><Link to="/receitas/clinica" className='ftr-link'>Receitas Saudáveis</Link></li>
              <li><Link to="/DicaNutri-Praia" className='ftr-link'>Dicas Alimentares</Link></li>
              <li><Link to="/sobre" className='ftr-link ftr-link--short'>Sobre a Dra. Natália Simanoviski</Link></li>
              <li><Link to="/contato" className='ftr-link'>Fale Comigo</Link></li>
            </ul>

            <ul className='ftr-list'>
              <h3>Serviços</h3>
              <li><Link to="/especialidade/esportiva" className='ftr-link'>Nutrição Esportiva</Link></li>
              <li><Link to="/especialidade/pediatrica" className='ftr-link'>Nutrição Pediátrica</Link></li>
              <li><Link to="/especialidade/clinica" className='ftr-link'>Nutrição Clínica</Link></li>
              <li><Link to="/especialidade/emagrecimento" className='ftr-link'>Emagrecimento e Obesidade</Link></li>
              <li><Link to="/especialidade/intolerancia" className='ftr-link'>Intolerâncias Alimentares</Link></li>
            </ul>

            <ul className='ftr-list'>
              <h3>Calculadoras</h3>
              <li><Link to="#" className='ftr-link'>Calorias e Nutrientes</Link></li>
              <li><Link to="/calculadoras/imc" className='ftr-link'>IMC e Peso Ideal</Link></li>
              <li><Link to="/calculadoras/consumo-agua" className='ftr-link'>Consumo diário de Água</Link></li>
            </ul>
          </nav>

          <div className='ftr-side'>
            <div className='ftr-side-inner'>
              <Botao to="/agendar-consulta" className="ftr-cta">Agendar Consulta</Botao>

<div className="ftr-icons">
  {/* Instagram - externo */}
  <a
    href="https://instagram.com/neven.dev"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Abrir Instagram"
    title="Instagram"
    className="ftr-icon-link"
  >
    <FaInstagram className="ftr-icon" />
  </a>

  {/* WhatsApp - apenas visual, sem função */}
  <span
    className="ftr-icon-link is-static"
    aria-hidden="true"
    title="WhatsApp"
  >
    <FaWhatsapp className="ftr-icon" />
  </span>

  {/* E-mail - vai para /contato (rota interna) */}
  <Link
    to="/contato"
    aria-label="Ir para página de contato"
    title="Contato"
    className="ftr-icon-link"
  >
    <HiOutlineEnvelope className="ftr-icon" />
  </Link>
</div>
</div>
            <div className='ftr-logo'>
              <img src={Logo} alt="Logo" width={200} loading="lazy" decoding="async" />
              <p id='crn'>CRN : 37892</p>
            </div>
          </div>
        </div>

        <div className='ftr-copy'>
          <p className='ftr-copy-top'>Alimentação saudável é um investimento no seu bem-estar!</p>
          <p className='ftr-copy-bottom'>© 2025 Natália Simanoviski | Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
export default Footer;
