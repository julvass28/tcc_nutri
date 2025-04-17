import { Link } from 'react-router-dom';
import React from 'react';
import '../css/Header.css';
import { FaWhatsapp, FaInstagram, FaUser, FaChevronDown } from "react-icons/fa";
import { HiOutlineEnvelope } from "react-icons/hi2";

import logo from '../assets/Logo.png';


function Header() {
    return (
        <header className='menu'>

            <div className="icons">
                <HiOutlineEnvelope className='icon'></HiOutlineEnvelope>
                <FaWhatsapp className='icon'></FaWhatsapp>
                <FaInstagram className='icon'></FaInstagram>
            </div>


            <nav className='nav-left'>
                <ul>
                    <li className='dropdown'>
                        <span className='nav-text'> Serviços <FaChevronDown className='seta' /></span>
                        <ul className="dropdown-menu">
                            <li><Link to>Nutrição Esportiva</Link></li>
                            <li><Link to>Nutrição Pediátrica</Link></li>
                            <li><Link to>Nutrição Clínica</Link></li>
                            <li><Link to>Emagrecimento e Obesidade</Link></li>
                            <li><Link to>Intolerâncias Aliemtares</Link></li>
                        </ul>
                    </li>

                    <li className='dropdown'>
                        <span className='nav-text'> Blog<FaChevronDown className='seta'></FaChevronDown></span>
                        <ul className="dropdown-menu">
                            <li><Link to>Dicas Alimentares</Link></li>
                            <li><Link to='/Receitas'>Receitas</Link></li>
                            <li><Link to>Artigos</Link></li>

                        </ul>
                    </li>

                    <li className='dropdown'>
                        <span className='nav-text'> Calculadoras<FaChevronDown className='seta'></FaChevronDown></span>
                        <ul className="dropdown-menu">
                            <li><Link to>Calorias e Nutrientes</Link></li>
                            <li><Link to>Gastos Caloricos</Link></li>
                            <li><Link to>IMC e Peso Ideal</Link></li>
                            <li><Link to>Consumo diário de Água</Link></li>

                        </ul>
                    </li>

                </ul>
            </nav>

            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <nav className='nav-right'>
                <ul>
                    <li><Link to="/"><span className='nav-text'> Sobre </span></Link></li>
                    <li><Link to="/"> <span className='nav-text'> Contato</span></Link></li>
                    <li><Link to="/"> <span className='nav-text'> Agendar Consulta</span></Link></li>
                </ul>
            </nav>
            <div className="perfil">
                <FaUser className='user'></FaUser>
            </div>




        </header>

    )
} export default Header;


