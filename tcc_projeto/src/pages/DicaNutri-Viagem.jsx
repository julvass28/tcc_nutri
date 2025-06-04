import '../css/DicasNutri.css';
import { FaUmbrellaBeach, FaUtensils, FaHamburger, FaShoppingBag, FaCocktail, FaCarSide } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import Formulario from "../components/formulario/formulario";

import viagem1 from '../assets/dicasnutri/viagem1.png';
import viagem2 from '../assets/dicasnutri/viagem2.png';
import viagem3 from '../assets/dicasnutri/viagem3.png';
import viagem4 from '../assets/dicasnutri/viagem4.png';
import viagem5 from '../assets/dicasnutri/viagem5.png';
import viagem6 from '../assets/dicasnutri/viagem6.png';
import viagem7 from '../assets/dicasnutri/viagem7.png';


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
 Viajar exige praticidade, mas também não precisa significar abrir mão de uma alimentação saudável. Planeje-se e aposte em opções leves e energéticas.
</p>


       


        <h2 className="dica-nutri-section-title">MELHORES OPÇÕES:</h2>
        <section className="dica-nutri-options" aria-label="Melhores opções">
          {[
            {
              alt: "Sanduíches Naturais",
              text: " Feitos com pão integral, frango desfiado, atum ou queijo branco, são práticos e nutritivos.",
              src: viagem1,
              title: "Sanduíches Naturais"
            },
            {
              alt: "Frutas Frescas ou Secas",
              text: " Maçã, banana e uvas são fáceis de transportar e ricas em fibras e vitaminas.",
              src: viagem2,
              title: "Frutas Frescas ou Secas"
            },
            {
              alt: "Saladas de Pote",
              text: "Opções pré-montadas com proteínas magras, vegetais e molho à parte são nutritivas e práticas.",
              src: viagem3,
              title: "Saladas de Pote"
            },
            {
              alt: "Wraps Integrais com Frango ou Atum",
              text: "Mais leves que fast food e fáceis de comer na estrada ou no avião.",
              src: viagem4,
              title: "Wraps Integrais com Frango ou Atum"
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
              alt: "Doces Industriais (Donuts, Bolos de Mercado, Biscoitos Recheados)",
              text: "Excesso de açúcar e conservantes levam à fadiga e picos de glicose.",
              src: viagem5,
              title: "Doces Industriais (Donuts, Bolos de Mercado, Biscoitos Recheados)"
            },
            {
              alt: "Embutidos (Salsicha, Salame, Mortadela, Presunto Gordo)",
              text: "Possuem muito sódio, causando retenção de líquidos e mal-estar.",
              src: viagem6,
              title: "Embutidos (Salsicha, Salame, Mortadela, Presunto Gordo)"
            },
             {
              alt: "Salgadinhos de Pacote e Snacks Ultraprocessados",
              text: "Ricos em sódio e gordura, podem causar sede excessiva e má digestão.",
              src: viagem7,
              title: "Salgadinhos de Pacote e Snacks Ultraprocessados"
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