import { Link, useLocation } from "react-router-dom";
import React from "react";
import "../css/Footer.css";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import FooterOnda from "../assets/Footer_onda.jsx";
import Botao from "./botao/Botao.jsx";
import logo from "../assets/img_png/Logo.png";

function Footer() {
  const { pathname } = useLocation();

  // rotas onde o CTA (botão de agendar consulta) deve sumir
  const hideCtaOn = ["/agendar-consulta", "/consulta"];
  const hideCta = hideCtaOn.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );

  // bloco de ícones (pra não repetir JSX)
  const Icons = () => (
    <div className="icons-footer">
      <FaInstagram className="icon-footer" />
      <FaLinkedin className="icon-footer" />
      <FaWhatsapp className="icon-footer" />
      <HiOutlineEnvelope className="icon-footer" />
    </div>
  );

  return (
    <div className="geral-footer">
      <FooterOnda />
      <footer className="footer">
        <div className="footer-container">
          <nav className="nav-footer-um">
            <ul className="list-links-footer">
              <div className="list-links-footer-x">
                <div className="list-text-links-x">
                  <h3 className="list-text-links"> Links Úteis </h3>

                  <li><Link to="/receitas/clinica" id="li-design">Receitas Saudáveis</Link></li>
                  <li><Link to="/DicaNutri-Praia" id="li-design">Dicas Alimentares</Link></li>
                  <li><Link to="/sobre" id="li-design">Sobre a Dra. Natália Simanoviski</Link></li>
                  <li><Link to="/contato" id="li-design">Fale Comigo</Link></li>
                </div>

                {/* BLOCO MOBILE */}
                <div className="section-footer-mobile">
                  {!hideCta && (
                    <div className="section-pai">
                      <Botao className="button-footer-agendar" to="/agendar-consulta">
                        Agendar Consulta
                      </Botao>
                      <Icons />
                    </div>
                  )}

                  <div className="logo-footer">
                    <img src={logo} alt="Logo" width={200} />
                    <p id="crn">CRN : 37892 </p>
                    {hideCta && <Icons />}{/* ícones “descem” quando CTA some */}
                  </div>
                </div>
              </div>
            </ul>

            <div className="list-links-footer-active">
              <ul className="list-links-footer">
                <h3 className="list-text-servicos"> Serviços </h3>
                <li><Link to="/especialidade/esportiva" id="li-design">Nutrição Esportiva</Link></li>
                <li><Link to="/especialidade/pediatrica" id="li-design">Nutrição Pediátrica</Link></li>
                <li><Link to="/especialidade/clinica" id="li-design">Nutrição Clínica</Link></li>
                <li><Link to="/especialidade/emagrecimento" id="li-design">Emagrecimento e Obesidade</Link></li>
                <li><Link to="/especialidade/intolerancia" id="li-design">Intolerâncias Aliemtares</Link></li>
              </ul>

              <ul className="list-links-footer">
                <h3 className="list-text-calculadoras"> Calculadoras</h3>
                <li><Link to="#" id="li-design">Calorias e Nutrientes</Link></li>
                <li><Link to="/calculadoras/gasto-calorico" id="li-design">Gastos Caloricos</Link></li>
                <li><Link to="/calculadoras/imc" id="li-design">IMC e Peso Ideal</Link></li>
                <li><Link to="/calculadoras/consumo-agua" id="li-design">Consumo diário de Água</Link></li>
              </ul>
            </div>

            {/* BLOCO DESKTOP */}
            <div className="list-links-footer-mobile">
              <ul className="list-links-footer">
                <h3 className="list-text-servicos"> Serviços </h3>
                <li><Link to="/especialidade/esportiva" id="li-design">Nutrição Esportiva</Link></li>
                <li><Link to="/especialidade/pediatrica" id="li-design">Nutrição Pediátrica</Link></li>
                <li><Link to="/especialidade/clinica" id="li-design">Nutrição Clínica</Link></li>
                <li><Link to="/especialidade/emagrecimento" id="li-design">Emagrecimento e Obesidade</Link></li>
                <li><Link to="/especialidade/intolerancia" id="li-design">Intolerâncias Alimentares</Link></li>
              </ul>

              <ul className="list-links-footer">
                <h3 className="list-text-calculadoras"> Calculadoras</h3>
                <li><Link to="#" id="li-design">Calorias e Nutrientes</Link></li>
                <li><Link to="/calculadoras/gasto-calorico" id="li-design">Gastos Caloricos</Link></li>
                <li><Link to="/calculadoras/imc" id="li-design">IMC e Peso Ideal</Link></li>
                <li><Link to="/calculadoras/consumo-agua" id="li-design">Consumo diário de Água</Link></li>
              </ul>
            </div>
          </nav>

          {/* COLUNA DIREITA (desktop) */}
          <div className={`section-footer ${hideCta ? "no-cta" : ""}`}>
            {!hideCta && (
              <div className="section-pai">
                <Botao className="button-footer-agendar" to="/agendar-consulta">
                  Agendar Consulta
                </Botao>
                <Icons />
              </div>
            )}

            <div className="logo-footer">
              <img src={logo} alt="Logo" width={200} />
              <p id="crn">CRN : 37892 </p>
              {hideCta && <Icons />}{/* ícones “descem” quando CTA some */}
            </div>
          </div>
        </div>

        <div className="direitos">
          <p id="text-direitos-um">
            Alimentação saudável é um investimento no seu bem-estar!
          </p>
          <p id="text-direitos-dois">
            © 2025 Natália Simanoviski | Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default Footer;
