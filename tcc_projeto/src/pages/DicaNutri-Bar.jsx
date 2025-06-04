import '../css/DicasNutri.css';
import { FaUmbrellaBeach, FaUtensils, FaHamburger, FaShoppingBag, FaCocktail, FaCarSide } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import Formulario from "../components/formulario/formulario";

import bar1 from '../assets/dicasnutri/bar1.png';
import bar2 from '../assets/dicasnutri/bar2.png';
import bar3 from '../assets/dicasnutri/bar3.png';
import bar4 from '../assets/dicasnutri/bar4.png';
import bar5 from '../assets/dicasnutri/bar5.png';
import bar6 from '../assets/dicasnutri/bar6.png';


const NutriIndica = () => {
  return (
    <div className="dica-nutri-container">
      <div className="dica-nutri-titulo">
        <h1>Nutri Indica: O Que Escolher e O Que Evitar</h1>
        <p>Faça escolhas inteligentes! Veja o que comer (e evitar)<br />em diferentes lugares.</p>
      </div>

<div className='container-nav-dica'>
  <div className='nav-scroll-wrapper'>
  <nav className="dica-nutri-nav" aria-label="Categorias">

    <NavLink to="/DicaNutri-Praia" className={({ isActive }) => isActive ? "dica-nutri-btn active" : "dica-nutri-btn"}>
  <FaUmbrellaBeach />Praia
</NavLink>

<NavLink to="/DicaNutri-Restaurantes" className={({ isActive }) => isActive ? "dica-nutri-btn active" : "dica-nutri-btn"}>
  <FaUtensils />Restaurantes
</NavLink>

<NavLink to="/DicaNutri-FastFood" className={({ isActive }) => isActive ? "dica-nutri-btn active" : "dica-nutri-btn"}>
  <FaHamburger />Fast Food
</NavLink>

<NavLink to="/DicaNutri-Shopping" className={({ isActive }) => isActive ? "dica-nutri-btn active" : "dica-nutri-btn"}>
  <FaShoppingBag />Shopping
</NavLink>

<NavLink to="/DicaNutri-Bar" className={({ isActive }) => isActive ? "dica-nutri-btn active" : "dica-nutri-btn"}>
  <FaCocktail />Bar
</NavLink>

<NavLink to="/DicaNutri-Viagem" className={({ isActive }) => isActive ? "dica-nutri-btn active" : "dica-nutri-btn"}>
  <FaCarSide />Viagem
</NavLink>

  </nav>
  </div>
</div>

      <main className="dica-nutri-main"> 
       <p>
 Os bares costumam oferecer opções saborosas, mas é possível fazer escolhas mais equilibradas para não prejudicar sua saúde.
</p>


       


        <h2 className="dica-nutri-section-title">MELHORES OPÇÕES:</h2>
        <section className="dica-nutri-options" aria-label="Melhores opções">
          {[
            {
              alt: "Tacos com Recheios Naturais",
              text: "Prefira versões com carne magra, frango ou peixe grelhado, acompanhados de vegetais e molhos leves.",
              src: bar1,
              title: "Tacos com Recheios Naturais"
            },
            {
              alt: "Peixes Grelhados ou Assados",
              text: "Como tilápia e salmão, são leves e ricos em ômega-3.",
              src: bar2,
              title: "Peixes Grelhados ou Assados"
            },
            {
              alt: "Bruschettas com Pão Integral",
              text: " Versões com tomate, queijo branco e ervas frescas são saborosas e mais leves que opções fritas.",
              src: bar3,
              title: "Bruschettas com Pão Integral"
            },
            {
              alt: "Espetinhos de frango grelhado com molho de ervas",
              text: "Proteína magra e temperos naturais fazem dessa uma excelente escolha.",
              src: bar4,
              title: "Espetinhos de frango grelhado com molho de ervas"
            }
          ].map((item, index) => (
            <article className="dica-nutri-card" key={index}>
              <img src={item.src} alt={item.alt} width="60" height="60" />
              <p><strong>{item.title}:</strong> {item.text}</p>
            </article>
          ))}
        </section>

        <h2 className="dica-nutri-section-title">EVITE:</h2>
        <section className="dica-nutri-avoid" aria-label="Evite">
          {[
            {
              alt: "Porções grandes de frituras (pastéis, mandioca frita)",
              text: "Rica em gordura saturada e inflamatória.",
              src: bar5,
              title: "Porções grandes de frituras (pastéis, mandioca frita)"
            },
            {
              alt: "Bebidas alcoólicas muito doces e calóricas (caipirinhas com açúcar refinado)",
              text: " Excesso de açúcar combinado com álcool pode ser prejudicial ao metabolismo.",
              src: bar6,
              title: "Bebidas alcoólicas muito doces e calóricas (caipirinhas com açúcar refinado)"
            }
          ].map((item, index) => (
            <article className="dica-nutri-card" key={index}>
              <img src={item.src} alt={item.alt} width="60" height="60" />
              <p><strong>{item.title}:</strong> {item.text}</p>
            </article>
          ))}
        </section>

        <h2 className="dica-nutri-section-title">DICAS EXTRAS:</h2>
        <section className="dica-nutri-tips" aria-label="Dicas extras">
          {[
            "Pratique o equilíbrio: Em qualquer ambiente, o segredo é o equilíbrio. Não é preciso eliminar certos alimentos, mas sim aprender a consumi-los com moderação.",
            "Hidrate-se: A água é a melhor amiga da alimentação saudável. Mantenha-se hidratado o tempo todo, especialmente em climas quentes ou quando estiver consumindo bebidas alcoólicas.",
            "Atenção aos tamanhos das porções: Muitas vezes, os restaurantes e fast foods oferecem porções maiores do que o necessário. Prefira porções menores e mais nutritivas.",
            "Evite comer por impulso: Procure escolher seus alimentos com base na fome real e não pela vontade momentânea, especialmente em lugares como shoppings e bares."
          ].map((tip, index) => (
            <article className="dica-nutri-card" key={index}>
              <p>• <strong>{tip.split(":")[0]}:</strong>{tip.split(":")[1]}</p>
            </article>
          ))}
        </section>

        <footer className="dica-nutri-footer" aria-label="Agendamento">
          AGENDE SUA CONSULTA E TENHA DICAS EXCLUSIVAS
        </footer>
        <button className="dica-nutri-btn-agendar" type="button">Agendar Consulta</button>
          <div className="form espacamento">
                        <Formulario />
                    </div>
      </main>
    </div>
  );
};

export default NutriIndica;