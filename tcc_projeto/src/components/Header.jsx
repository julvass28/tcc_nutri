import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import { FaWhatsapp, FaInstagram, FaUser, FaChevronDown } from "react-icons/fa";
import { HiOutlineEnvelope } from "react-icons/hi2";
import logo from '../assets/Logo.png';

function Header() {
  return (
    <header className='menu'>
      <div className="icons">
        <HiOutlineEnvelope className='icon' />
        <FaWhatsapp className='icon' />
        <FaInstagram className='icon' />
      </div>

      <nav className='nav-left'>
        <ul>
          <li className='dropdown'>
            <span className='nav-text'>
              Serviços <FaChevronDown className='seta' />
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/especialidade/esportiva">Nutrição Esportiva</Link>
              </li>
              <li>
                <Link to="/especialidade/pediatrica">Nutrição Pediátrica</Link>
              </li>
              <li>
                <Link to="/especialidade/clinica">Nutrição Clínica</Link>
              </li>
              <li>
                <Link to="/especialidade/emagrecimento">Emagrecimento/Obesidade</Link>
              </li>
              <li>
                <Link to="/especialidade/intolerancia">Intolerâncias Alimentares</Link>
              </li>
            </ul>
          </li>

          <li className='dropdown'>
            <span className='nav-text'>
              Blog <FaChevronDown className='seta' />
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/blog/dicas-alimentares">Dicas Alimentares</Link>
              </li>
              <li>
                <Link to="/blog/receitas">Receitas</Link>
              </li>
              <li>
                <Link to="/blog/artigos">Artigos</Link>
              </li>
            </ul>
          </li>

          <li className='dropdown'>
            <span className='nav-text'>
              Calculadoras <FaChevronDown className='seta' />
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/calculadoras/calorias-nutrientes">Calorias e Nutrientes</Link>
              </li>
              <li>
                <Link to="/calculadoras/gastos-caloricos">Gastos Calóricos</Link>
              </li>
              <li>
                <Link to="/calculadoras/imc">IMC e Peso Ideal</Link>
              </li>
              <li>
                <Link to="/calculadoras/consumo-agua">Consumo Diário de Água</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className='nav-right'>
        <ul>
          <li>
            <Link to="/sobre"><span className='nav-text'>Sobre</span></Link>
          </li>
          <li>
            <Link to="/contato"><span className='nav-text'>Contato</span></Link>
          </li>
          <li>
            <Link to="/agendar-consulta"><span className='nav-text'>Agendar Consulta</span></Link>
          </li>
        </ul>
      </nav>

      <div className="perfil">
        <FaUser className='user' />
      </div>
    </header>
  );
}

export default Header;
