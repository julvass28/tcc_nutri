import Header from '../components/Header';

import '../css/Home.css';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import foto from '../assets/img_png/foto_nutri.png';
import Botao from "../components/botao/Botao";
import foto_nutri from '../assets/img_png/ft-nutri.png';
import Titulo from "../components/titulo/titulo";
import Iconclinica from '../assets/img_svg/clinic.svg?react';
import Iconesportiva from '../assets/img_svg/esportiva.svg?react';
import Iconemagrecer from '../assets/img_svg/emagrecimento.svg?react';
import Iconintolerancia from '../assets/img_svg/intolerancia.svg?react';
import Iconpediatria from '../assets/img_svg/pediatria.svg?react';
import dieta from '../assets/img_png/dieta.png';
import acompanhamento from '../assets/img_png/acompanhamento.png';
import peso from '../assets/img_png/peso.png';
import refeicao from '../assets/img_png/refeicao.png';
import escolhas from '../assets/img_png/escolha.png';
import Carrosel from "../components/carrosel/carrosel";
import { receitasMock } from '../mocks/receitas';
import { FaUser, FaClipboardList, FaCommentDots, FaBook } from "react-icons/fa";
import Formulario from "../components/formulario/formulario";
import imagem from '../assets/img_png/imagem.jpg'









function Home() {

    return (
        <>
            <Header />

            <div className="comeco">

            <div className="bloco-inicial">
                <img src={imagem} alt=""  className='imagem-fundo' />
               
                 <div className="bloco-texto">
                    <h1>Te ajudo a transformar sua alimentação de forma leve e sem complicações!</h1>
                    <Botao className='botao-inicial'>Agendar Consulta</Botao>
                 </div>
            </div>




            <div className="descricao">
                <div className="infos">
                    <img src={foto} alt="" className="foto" />
                    <h2 className="num">CRN : 37892</h2>
                </div>
                <div className="sobre">
                    <h2 className="primeiro-text">NUTRICIONISTA</h2>
                    <h1 className="segundo-text">Natália Simanoviski</h1>
                    <p className="terceiro-text">Cuidado nutricional personalizado para <br /> cada necessidade!</p>
                    <Botao >Agendar Consulta</Botao>
                </div>
            </div>
            </div>


            <div className="secao">
                <Titulo className="espacamento" texto="Qual o seu objetivo?" />

                <div className="categorias">


                    <div className="linha">

                        <div className="categoria">
                            <Iconclinica className="icone" />
                            <p>Nutrição Clínica</p>
                        </div>

                        <div className="categoria">
                            <Iconpediatria className="icone" />
                            <p>Nutrição Pediátrica</p>
                        </div>

                        <div className="categoria">
                            <Iconesportiva className="icone" />
                            <p>Nutrição Esportiva</p>
                        </div>

                    </div>


                    <div className="linha linha-menor">

                        <div className="categoria">
                            <div className="conteudo-categoria">
                                <Iconemagrecer className="icone" />
                                <p>Emagrecimento <br />e Obesidade</p>
                            </div>
                        </div>

                        <div className="categoria">
                            <div className="conteudo-categoria">
                                <Iconintolerancia className="icone" />
                                <p>Intolerâncias <br /> Alimentares</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="sobre-nutri">
                <div className="infos-dois">
                    <h2 className="primeiro-text text-small">Olá, eu sou a</h2>
                    <h2 className="segundo-text text-medium">Nutricionista</h2>
                    <h2 className="segundo-text text-large">Natália Simanoviski</h2>
                    <p className="terceiro-text small">Sou nutricionista <span className="color-text"> apaixonada por transformar <br />
                        a alimentação em algo leve e equilibrado.</span> Além
                        <br /> de nutri, quero ser sua amiga nessa jornada.<br />
                        Vamos juntos?</p>
                    <Botao className="btn-dois" text="+Sobre Mim" >+Sobre Mim</Botao>
                </div>

                <div className="foto-nutri">
                    <img src={foto_nutri} alt="" />

                </div>
            </div>

            <div className="secao sobre-consulta">
                <Titulo className="espacamento" texto="Plano Nutricional Feito Para Você!" />

                <div className="planejamento">

                    <div className="item">
                        <div className="img-wrapper">
                            <img src={dieta} alt="" />
                        </div>
                        <p>Dieta Personalizado</p>
                    </div>

                    <div className="item">
                        <div className="img-wrapper">
                            <img src={acompanhamento} alt="" />
                        </div>
                        <p>Acompanhamento Contínuo</p>
                    </div>


                    <div className="item">
                        <div className="img-wrapper">
                            <img src={peso} alt="" />
                        </div>
                        <p>Controle de Peso</p>
                    </div>


                    <div className="item">
                        <div className="img-wrapper">
                            <img src={refeicao} alt="" />
                        </div>
                        <p>Planejamento de Refeições</p>
                    </div>


                </div>
            </div>

            <div className="funcionamento">

                <div className="topic">
                    <Titulo texto="Como Funciona Meu Atendimento Online?" mostrarLinha={false} />
                    <div className="topicos">
                        <p><IoIosCheckmarkCircleOutline className="icone-dois" />Anamnese Nutricional</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois" />Avaliação Física e Nutricional</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois" />Consulta Online</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois" />Estratégia Alimentar Individualizada</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois" />Acompanhamento Contínuo</p>
                    </div>
                    <Botao text="Saiba Mais" >Saiba Mais</Botao>
                </div>
            </div>

            <div className="dicas">
                <img className="imagem-container" src={escolhas} alt="" />


                <div className="conteudo">
                    <div className="linha-texto">
                        <Titulo texto="Em dúvida do que escolher?" mostrarLinha={false} />
                        <p>
                            Saiba exatamente o que comer (e o que evitar) em qualquer lugar!<br />
                            Descubra as melhores e piores opções em restaurantes, fast foods <br />
                            e muito mais. Com dicassimples e práticas, você pode se alimentar<br />
                            melhor sem abrir mão do sabor.
                        </p>
                        <h3>Faça escolhas mais saudáveis todos os dias!</h3>
                    </div>

                    <Botao className="botao-verde" text="Ver Dicas" >Ver Dicas</Botao>

                </div>
            </div>

            <div className="Receitas">
                <Carrosel
                    titulo="Receitas Saudáveis e Deliciosas"
                    subtitulo="Encontre opções equilibradas e saborosas para sua rotina!"
                    dados={receitasMock}

                />
                <div className="botao">
                    <Botao text="Ver Receitas">Ver Receitas</Botao>
                </div>
            </div>

            <div className="valor">
                <div className="info-valor">

                    <div className="lado-imagem">
                        <div className="imagem-gradiente"></div>
                        <div className="box-preco">
                            <h2>R$ 150</h2>
                            <span>consulta avulsa</span>
                            <Botao className="botao-verde">Agendar Consulta</Botao>
                        </div>
                    </div>

                    <div className="textos">
                        <h1>Consulta de Nutrição</h1>
                        <p className="text-p">Avaliação completa e plano personalizado</p>

                        <p className="preco-text"><FaUser className="preco-icons" /> Atendimento individualizado</p>
                        <p className="preco-text"><FaClipboardList className="preco-icons" /> Plano alimentar personalizado</p>
                        <p className="preco-text"><FaCommentDots className="preco-icons" /> Suporte por 30 dias via WhatsApp</p>
                        <p className="preco-text"><FaBook className="preco-icons" /> Receitas e materiais de apoio</p>
                    </div>

                </div>
            </div>


            <Formulario />





        </>
    )
} export default Home;