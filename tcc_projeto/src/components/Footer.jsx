import { Link } from 'react-router-dom';
import React from 'react';
import '../css/Footer.css';
import { FaChevronDown } from "react-icons/fa";

function Footer() {

    return (
        <footer className='footer'>

            <nav className='nav-footer'>
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

        </footer>

    )
}

export default Footer;