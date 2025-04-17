import React from 'react';
import '../css/ReceitasClinicas.css';
import comida from '../assets/comida.jpeg';

function ReceitasClinicas() {
    return (
        <div className='img'>

            <img
                src={comida}
                alt="Imagem de comida"
                style={{ width: '100%', height: 'auto', display: 'block' }}></img>

            {/* Retângulo branco centralizado */}
            <div className="texto">

                <h3 className="titulo">Receitinhas</h3>
                <p className="subtitulo">Confira as receitas que preparei pra você</p>
            </div>
        </div>




    )
} export default ReceitasClinicas