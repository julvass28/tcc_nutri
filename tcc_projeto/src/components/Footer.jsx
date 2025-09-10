
import { Link } from 'react-router-dom';
import React from 'react';
import '../css/Footer.css';
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import FooterOnda from '../assets/Footer_onda.jsx';
import Botao from './botao/Botao.jsx';

function Footer() {
    return (
        <div className='geral-footer'>
            <FooterOnda></FooterOnda>
            <footer className='footer'>

                <div className='footer-container'>
                    <nav className='nav-footer-um'>

                        <ul className='list-links'>
                            <h3 className='list-text-links'> Links Úteis </h3>

                            <li><Link to="/receitas/clinica" id='li-design'>Receitas Saudáveis</Link></li>
                            <li><Link to="/DicaNutri-Praia" id='li-design'>Dicas Alimentares</Link></li>
                            <li><Link to="/sobre" id='li-design'>Sobre a  Dra. Natália Simanoviski</Link></li>
                            <li><Link to="/contato" id='li-design'>Fale Comigo</Link></li>
                        </ul>

                        <ul className='list-links'>

                            <h3 className='list-text-servicos'> Serviços </h3>
                            <li><Link to="/especialidade/esportiva" id='li-design'>Nutrição Esportiva</Link></li>
                            <li><Link to="/especialidade/pediatrica" id='li-design'>Nutrição Pediátrica</Link></li>
                            <li><Link to="/especialidade/clinica" id='li-design'>Nutrição Clínica</Link></li>
                            <li><Link to="/especialidade/emagrecimento" id='li-design'>Emagrecimento e Obesidade</Link></li>
                            <li><Link to="/especialidade/intolerancia" id='li-design'>Intolerâncias Alimentares</Link></li>
                        </ul>

                        <ul className='list-links'>

                            <h3 className='list-text-calculadoras'> Calculadoras</h3>
                            <li><Link to="#" id='li-design'>Calorias e Nutrientes</Link></li>
                            <li><Link to="/calculadoras/gasto-calorico" id='li-design'>Gastos Caloricos</Link></li>
                            <li><Link to="/calculadoras/imc" id='li-design'>IMC e Peso Ideal</Link></li>
                            <li><Link to="/calculadoras/consumo-agua" id='li-design'>Consumo diário de Água</Link></li>
                        </ul>
                    </nav>

                    <div className='section-footer'>
                        <div className='section-pai'>
                            
                                 <Botao className='button-footer-agendar'>Agendar Consulta</Botao>
                            
<div className='icons-footer'>
                               
  <a
    href="https://instagram.com/seu_user_aqui" //link do instagram
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Abrir Instagram"
    title="Instagram"
  >
    <FaInstagram className="icon-footer" />
  </a>

  <a
    href="https://wa.me/5511976120337?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta." //link 
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Enviar WhatsApp"
    title="WhatsApp"
  >
    <FaWhatsapp className="icon-footer" />
  </a>

  <a
    href="mailto:dranatalia@simanovski.com?subject=Agendamento%20de%20consulta&body=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta." //link 
    target="_blank"
    aria-label="Enviar e-mail"
    title="E-mail"
  >
    <HiOutlineEnvelope className="icon-footer" />
  </a>
</div>

                            
                        </div>
                        <div className='logo-footer'>
                            <img src="src\assets\img_png\Logo.png" alt="Logo" width={200} />
                            <p id='crn'>CRN : 37892 </p>
                        </div>
                    </div>
                </div>

                <div className='direitos'>
                    <p id='text-direitos-um'>Alimentação saudável é um investimento no seu bem-estar!</p>
                    <p id='text-direitos-dois'>© 2025 Natália Simanoviski | Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
export default Footer;
