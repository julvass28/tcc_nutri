
import { Link } from 'react-router-dom';
import React from 'react';
import '../css/Footer.css';
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import FooterOnda from '../assets/Footer_onda.jsx';

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
                            <li><Link to="#" id='li-design'>Fale Comigo</Link></li>
                        </ul>

                        <ul className='list-links'>

                            <h3 className='list-text-servicos'> Serviços </h3>
                            <li><Link to="/especialidade/esportiva" id='li-design'>Nutrição Esportiva</Link></li>
                            <li><Link to="/especialidade/pediatrica" id='li-design'>Nutrição Pediátrica</Link></li>
                            <li><Link to="/especialidade/clinica" id='li-design'>Nutrição Clínica</Link></li>
                            <li><Link to="/especialidade/emagrecimento" id='li-design'>Emagrecimento e Obesidade</Link></li>
                            <li><Link to="/especialidade/intolerancia" id='li-design'>Intolerâncias Aliemtares</Link></li>
                        </ul>

                        <ul className='list-links'>

                            <h3 className='list-text-calculadoras'> Calculadoras</h3>
                            <li><Link to="#" id='li-design'>Calorias e Nutrientes</Link></li>
                            <li><Link to="#" id='li-design'>Gastos Caloricos</Link></li>
                            <li><Link to="/calculadoras/imc" id='li-design'>IMC e Peso Ideal</Link></li>
                            <li><Link to="/calculadoras/consumo-agua" id='li-design'>Consumo diário de Água</Link></li>
                        </ul>
                    </nav>

                    <div className='section-footer'>
                        <div className='section-pai'>
                            <div className='button-footer'>
                                <button>Agendar Consulta</button>
                            </div>
                            <div className='icons-footer'>
                                <FaInstagram className='icon-footer'></FaInstagram>
                                <FaLinkedin className='icon-footer'></FaLinkedin>
                                <FaWhatsapp className='icon-footer'></FaWhatsapp>
                                <HiOutlineEnvelope className='icon-footer'></HiOutlineEnvelope>
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
