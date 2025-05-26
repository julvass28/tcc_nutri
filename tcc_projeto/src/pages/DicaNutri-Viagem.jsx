import '../css/DicasNutri.css';
import { FaUmbrellaBeach, FaUtensils, FaHamburger, FaShoppingBag, FaCocktail, FaCarSide } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';


// Exemplo de como importar imagem localmente:
// import frutasImg from './assets/frutas.jpg';


const NutriIndica = () => {
  return (
    <div className="dica-nutri-container">
      <div className="dica-nutri-titulo">
        <h1>Nutri Indica: O Que Escolher e O Que Evitar</h1>
        <p>Faça escolhas inteligentes! Veja o que comer (e evitar)<br />em diferentes lugares.</p>
      </div>

<div className='container-nav-dica'>
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
              src: "https://storage.googleapis.com/a1aa/image/2c6dcbb9-e87d-4413-b4e5-5b0f5b87e5b3.jpg",
              title: "Sanduíches Naturais"
            },
            {
              alt: "Frutas Frescas ou Secas",
              text: " Maçã, banana e uvas são fáceis de transportar e ricas em fibras e vitaminas.",
              src: "https://storage.googleapis.com/a1aa/image/d5b6722b-c9fd-40ec-fa47-aaab093343a4.jpg",
              title: "Frutas Frescas ou Secas"
            },
            {
              alt: "Saladas de Pote",
              text: "Opções pré-montadas com proteínas magras, vegetais e molho à parte são nutritivas e práticas.",
              src: "https://storage.googleapis.com/a1aa/image/cab77daa-b517-4051-04ad-a567d3bfb1d6.jpg",
              title: "Saladas de Pote"
            },
            {
              alt: "Wraps Integrais com Frango ou Atum",
              text: "Mais leves que fast food e fáceis de comer na estrada ou no avião.",
              src: "https://storage.googleapis.com/a1aa/image/cf50c942-ef78-4310-4663-155460e36597.jpg",
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
              src: "https://storage.googleapis.com/a1aa/image/6c2a98ae-34d1-46f5-ad0f-ab1c90f417f6.jpg",
              title: "Doces Industriais (Donuts, Bolos de Mercado, Biscoitos Recheados)"
            },
            {
              alt: "Embutidos (Salsicha, Salame, Mortadela, Presunto Gordo)",
              text: "Possuem muito sódio, causando retenção de líquidos e mal-estar.",
              src: "https://storage.googleapis.com/a1aa/image/86483723-6900-4224-02ea-44f8394d910d.jpg",
              title: "Embutidos (Salsicha, Salame, Mortadela, Presunto Gordo)"
            },
             {
              alt: "Salgadinhos de Pacote e Snacks Ultraprocessados",
              text: "Ricos em sódio e gordura, podem causar sede excessiva e má digestão.",
              src: "https://storage.googleapis.com/a1aa/image/86483723-6900-4224-02ea-44f8394d910d.jpg",
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
      </main>
    </div>
  );
};

export default NutriIndica;