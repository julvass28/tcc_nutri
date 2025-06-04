import '../css/DicasNutri.css';
import { FaUmbrellaBeach, FaUtensils, FaHamburger, FaShoppingBag, FaCocktail, FaCarSide } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import Formulario from "../components/formulario/formulario";

import ff1 from '../assets/dicasnutri/ff1.png';
import ff2 from '../assets/dicasnutri/ff2.png';
import ff3 from '../assets/dicasnutri/ff3.png';
import ff4 from '../assets/dicasnutri/ff4.png';
import ff5 from '../assets/dicasnutri/ff5.png';
import ff6 from '../assets/dicasnutri/ff6.png';
import ff7 from '../assets/dicasnutri/ff7.png';

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
  Embora o fast food seja conhecido por suas opções rápidas, é possível fazer escolhas mais equilibradas, sem abrir mão da conveniência.
</p>


       


        <h2 className="dica-nutri-section-title">MELHORES OPÇÕES:</h2>
        <section className="dica-nutri-options" aria-label="Melhores opções">
          {[
            {
              alt: "Sanduíches grelhados",
              text: " Prefira opções de carne magra, como frango grelhado, acompanhados de vegetais frescos.",
              src: ff1,
              title: "Sanduíches grelhados"
            },
            {
              alt: "Wraps",
              text: "Geralmente mais leves que os hambúrgueres, com menos calorias.",
              src: ff2,
              title: "Wraps"
            },
            {
              alt: "Saladas com proteínas magras",
              text: "Muitas redes de fast food oferecem saladas nutritivas com opções como frango ou atum",
              src: ff3,
              title: "Saladas com proteínas magras"
            },
            {
              alt: "Poke",
              text: "Prato havaiano nutritivo, com arroz, vegetais frescos e peixe marinado, rico em proteínas, fibras e antioxidantes. Uma opção leve e deliciosa para uma alimentação equilibrada.",
              src: ff4,
              title: "Poke"
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
              alt: "Hambúrguer duplo com bacon e molhos industrializados",
              text: "Alto teor de gorduras ruins, sódio e calorias vazias.",
              src: ff5,
              title: "Hambúrguer duplo com bacon e molhos industrializados"
            },
            {
              alt: "Nuggets e Frituras",
              text: "Esses alimentos são ricos em gorduras ruins e aditivos, aumentando o risco de doenças e prejudicando a saúde.",
              src: ff6,
              title: "Nuggets e Frituras"
            },
              {
              alt: "Bebidas açucaradas e milkshakes",
              text: "Além de extremamente calóricos, são fontes de açúcar refinado, que não traz benefícios à saúde.",
              src: ff7,
              title: "Bebidas açucaradas e milkshakes"
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