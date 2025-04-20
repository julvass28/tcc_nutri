import React from 'react';
import '../css/ReceitasClinicas.css';
import comida from '../assets/comida.jpeg';
import pudim from '../assets/pudim.png';
import chai from '../assets/chai.png';
import crepe from '../assets/crepe.png';
import chips from '../assets/chips.png';
import BarraDeReceitas from '../components/BarraDeReceitas.jsx';
function ReceitasClinicas() {
    return (
        <div>
       

        <div className='img'>

            <img className='comida-img'
                src={comida}
                alt="Imagem de comida"
                style={{ width: '100%', height: 'auto', display: 'block' }}></img>

            {/* Retângulo branco centralizado */}
            <div className="texto">

                <h3 className="titulo">Receitinhas</h3>
                <p className="subtitulo">Confira as receitas que preparei pra você</p>
            </div>
        
        </div>

        <div className='barra'>
        <BarraDeReceitas/>
    </div>
    <div className="frase">

                <h3 className="titulo-frase">
                    Comer bem não precisa ser complicado. Com receitas nutritivas e equilibradas, <br />
                    é possível manter uma alimentação saudável sem abrir mão do sabor.<br />
                    Experimente novas combinações e descubra < br/>
                     receitinhas deliciosas!</h3>
                
            </div>

<div className='linha'>
</div>

<h1 className='sus'> Sugestões deliciosas </h1>

<div class="pudim-container">
  <img src={pudim} alt="Pudim de Chia" class="pudim-img" />
  
  <div class="pudim-conteudo">
    <h2>Pudim de Chia</h2>
    <p>O pudim de chia é uma sobremesa saudável feita com sementes de chia, leite (ou leite vegetal) e adoçante. As sementes formam uma textura cremosa, rica em fibras, ômega-3 e proteínas. É uma opção nutritiva e versátil, podendo ser complementado com frutas ou granola.</p>
    <a href="#" class="leia-mais">Leia mais</a>
  </div>
</div>


<div class="pudim-container">
  <img src={chai} alt="Pudim de Chia" class="pudim-img" />
  
  <div class="pudim-conteudo">
    <h2>Chai Latte</h2>
    <p>O chai latte é uma bebida de origem indiana feita com chá preto, especiarias (como canela e gengibre) e leite espumado. É cremosa, aromática e conhecida por seu sabor picante e reconfortante.</p>
    <a href="#" class="leia-mais">Leia mais</a>
  </div>
</div>


<div class="pudim-container">
  <img src={crepe} alt="Pudim de Chia" class="pudim-img" />
  
  <div class="pudim-conteudo">
    <h2>Crepioca</h2>
    <p>A crepioca é uma mistura de tapioca e ovo, rápida e prática de fazer. É uma opção leve e versátil, podendo ser recheada com o que você preferir, como queijo, frango, legumes ou até doces.</p>
    <a href="#" class="leia-mais">Leia mais</a>
  </div>
</div>


<div class="pudim-container">
  <img src={chips} alt="Pudim de Chia" class="pudim-img" />
  
  <div class="pudim-conteudo">
    <h2>Chips de Batata-Doce Assados</h2>
    <p>Os chips de batata-doce assados são uma alternativa saudável e crocante aos salgadinhos tradicionais. Feitos no forno com azeite e temperos, são uma ótima opção de snack que combina sabor e nutrientes em um único prato.</p>
    <a href="#" class="leia-mais">Leia mais</a>
  </div>
</div>

       
</div>


    );
} export default ReceitasClinicas