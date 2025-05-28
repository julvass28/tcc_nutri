import '../css/DicasNutri.css';
import { FaUmbrellaBeach, FaUtensils, FaHamburger, FaShoppingBag, FaCocktail, FaCarSide } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';


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
  Restaurantes oferecem variedade, mas é fácil exagerar. Foque em pratos equilibrados e saborosos, que nutrem sem excessos. Confira as melhores escolhas:
</p>



        <h2 className="dica-nutri-section-title">MELHORES OPÇÕES:</h2>
        <section className="dica-nutri-options" aria-label="Melhores opções">
          {[
            {
              alt: "Peixes e frutos do mar",
              text: "São fontes ricas em proteínas magras e ácidos graxos essenciais, como ômega-3.",
              src: "https://storage.googleapis.com/a1aa/image/2c6dcbb9-e87d-4413-b4e5-5b0f5b87e5b3.jpg",
              title: "Peixes e frutos do mar"
            },
            {
              alt: "Saladas completas",
              text: "Preparadas com vegetais frescos, proteínas magras (como peito de frango grelhado) e grãos integrais.",
              src: "https://storage.googleapis.com/a1aa/image/d5b6722b-c9fd-40ec-fa47-aaab093343a4.jpg",
              title: "Saladas completas"
            },
            {
              alt: "Sopa de legumes",
              text: "Leve e nutritiva, feita com vegetais frescos e temperos naturais, rica em fibras e vitaminas.",
              src: "https://storage.googleapis.com/a1aa/image/cab77daa-b517-4051-04ad-a567d3bfb1d6.jpg",
              title: "Sopa de legumes"
            },
            {
              alt: "Sucos naturais",
              text: "São opções saudáveis, feitos com frutas frescas, ricos em vitaminas e antioxidantes, sem adição de açúcares refinados.",
              src: "https://storage.googleapis.com/a1aa/image/cf50c942-ef78-4310-4663-155460e36597.jpg",
              title: "Sucos naturais"
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
              alt: "Pratos pesados",
              text: "Esses pratos costumam ter alto teor de gorduras saturadas e calorias excessivas.",
              src: "https://storage.googleapis.com/a1aa/image/6c2a98ae-34d1-46f5-ad0f-ab1c90f417f6.jpg",
              title: "Pratos pesados"
            },
            {
              alt: "Sobremesas Calóricas",
              text: " São carregadas de açúcar, gordura e calorias extras, sem oferecer valor nutricional significativo.",
              src: "https://storage.googleapis.com/a1aa/image/86483723-6900-4224-02ea-44f8394d910d.jpg",
              title: "Sobremesas Calóricas"
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