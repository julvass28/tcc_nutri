import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../css/Header.css';
import { FaWhatsapp, FaInstagram, FaUser, FaChevronDown, FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import Botao from './botao/Botao';
import logo from "../assets/img_png/Logo.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



function Header() {
    const [openMenu, setOpenMenu] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user } = useContext(AuthContext);

    const toggleDropdown = (menuName) => {
        setOpenDropdown(openDropdown === menuName ? null : menuName);
    };

    return (
        <header className='menu'>
            <button className='btn-mobile' onClick={() => setOpenMenu(!openMenu)}>
                <FaBars />
            </button>

            <div className="icons">
                <HiOutlineEnvelope className='icon' />
                <FaWhatsapp className='icon' />
                <FaInstagram className='icon' />
            </div>

            <nav className={`nav-itens left ${openMenu ? 'open' : ''}`}>
                <button className='btn-mobile' onClick={() => setOpenMenu(false)}>
                    <FaXmark className='xis' />
                </button>
                <ul>
                    <li className='dropdown nav-section'>
                        <span className={`nav-text ${openDropdown === 'servicos' ? 'ativo' : ''}`} onClick={() => toggleDropdown('servicos')}>
                            Serviços <FaChevronDown className={`seta ${openDropdown === 'servicos' ? 'rotated' : ''}`} />
                        </span>
                        <ul className={`dropdown-menu ${openDropdown === 'servicos' ? 'show' : ''}`}>
                            <li><Link to="/especialidade/esportiva" onClick={() => setOpenDropdown(null)}>Nutrição Esportiva</Link></li>
                            <li><Link to="/especialidade/pediatrica" onClick={() => setOpenDropdown(null)}>Nutrição Pediátrica</Link></li>
                            <li><Link to="/especialidade/clinica" onClick={() => setOpenDropdown(null)}>Nutrição Clínica</Link></li>
                            <li><Link to="/especialidade/emagrecimento" onClick={() => setOpenDropdown(null)}>Emagrecimento e Obesidade</Link></li>
                            <li><Link to="/especialidade/intolerancia" onClick={() => setOpenDropdown(null)}>Intolerâncias Alimentares</Link></li>
                        </ul>
                    </li>

                    <li className='dropdown nav-section'>
                        <span className={`nav-text ${openDropdown === 'blog' ? 'ativo' : ''}`} onClick={() => toggleDropdown('blog')}>
                            Blog <FaChevronDown className={`seta ${openDropdown === 'blog' ? 'rotated' : ''}`} />
                        </span>
                        <ul className={`dropdown-menu ${openDropdown === 'blog' ? 'show' : ''}`}>
                            <li><Link to="/DicaNutri-Praia" onClick={() => setOpenDropdown(null)}>Dicas Alimentares</Link></li>
                            <li><Link to="/receitas/clinica" onClick={() => setOpenDropdown(null)}>Receitas</Link></li>
                            <li><Link to="#" onClick={() => setOpenDropdown(null)}>Artigos</Link></li>
                        </ul>
                    </li>

                    <li className='dropdown nav-section'>
                        <span className={`nav-text ${openDropdown === 'calculadoras' ? 'ativo' : ''}`} onClick={() => toggleDropdown('calculadoras')}>
                            Calculadoras <FaChevronDown className={`seta ${openDropdown === 'calculadoras' ? 'rotated' : ''}`} />
                        </span>
                        <ul className={`dropdown-menu ${openDropdown === 'calculadoras' ? 'show' : ''}`}>
                            <li><Link to="/calculadoras/calorias-nutrientes" onClick={() => setOpenDropdown(null)}>Calorias e Nutrientes</Link></li>
                            <li><Link to="/calculadoras/gasto-calorico" onClick={() => setOpenDropdown(null)}>Gastos Calóricos</Link></li>
                            <li><Link to="/calculadoras/imc" onClick={() => setOpenDropdown(null)}>IMC e Peso Ideal</Link></li>
                            <li><Link to="/calculadoras/consumo-agua" onClick={() => setOpenDropdown(null)}>Consumo Diário de Água</Link></li>
                        </ul>
                    </li>

                    <div className="mobile-only">
                        <ul className='nav-section'>
                            <li><Link to="/sobre"><span className="nav-text mobile">Sobre</span></Link></li>
                            <li><Link to="/contato"><span className="nav-text mobile">Contato</span></Link></li>
                            <li><Link to="#"><span className="nav-text mobile">Agendar Consulta</span></Link></li>
                        </ul>

                        <div className="infos-mobile">
                            <p className='tel'>(11) 94030-2492</p>
                            <p className='email'>dranatalia@simanovski.com</p>
                        </div>

                        <Botao className='botao-header'>Agendar Consulta</Botao>

                        <div className="mobile-icons">
                            <HiOutlineEnvelope className='icon-mobile' />
                            <FaWhatsapp className='icon-mobile' />
                            <FaInstagram className='icon-mobile' />
                        </div>
                    </div>
                </ul>
            </nav>

            <div className="logo">
                <Link to="/"><img src={logo} alt="Logo" /></Link>
            </div>

            <nav className='nav-itens'>
                <ul>
                    <li><Link to="/sobre"><span className='nav-text'>Sobre</span></Link></li>
                    <li><Link to="/contato"><span className='nav-text'>Contato</span></Link></li>
                    <li><Link to="#"><span className='nav-text'>Agendar Consulta</span></Link></li>
                </ul>
            </nav>

            <div className="perfil" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {user?.nome ? (
                    <>
                        <span style={{ color: "#454545" }}>
                            Olá, <strong>{user.nome}</strong>
                        </span>

                        <Link to="/perfil">
                            <FaUser className="user" title="Editar Perfil"/>
                        </Link>

                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("nome");
                                window.location.reload();
                            }}
                            style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "#D1A0A0",
                                marginLeft: "5px"
                            }}
                        >
                            Sair(DEV)
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        <FaUser title='Fazer login' className="user" />
                    </Link>
                )}
            </div>


        </header>
    );
}

export default Header;
