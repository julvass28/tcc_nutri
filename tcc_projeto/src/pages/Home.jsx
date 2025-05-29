//Componentes
import Header from '../components/Header';
import Botao from "../components/botao/Botao";
import Carrosel from "../components/carrosel/desktop";
import Titulo from "../components/titulo/titulo";
import Formulario from "../components/formulario/formulario";
import CarroselMobile from '../components/carrosel/mobile';

//Bibliotecas
import { FaUser, FaClipboardList, FaCommentDots, FaBook } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';





//Icons
import Iconclinica from '../assets/img_svg/clinic.svg?react';
import Iconesportiva from '../assets/img_svg/esportiva.svg?react';
import Iconemagrecer from '../assets/img_svg/emagrecimento.svg?react';
import Iconintolerancia from '../assets/img_svg/intolerancia.svg?react';
import Iconpediatria from '../assets/img_svg/pediatria.svg?react';

//Png
import foto from '../assets/img_png/foto_nutri.png';
import foto_nutri from '../assets/img_png/ft-nutri.png';
import dieta from '../assets/img_png/dieta.png';
import acompanhamento from '../assets/img_png/acompanhamento.png';
import peso from '../assets/img_png/peso.png';
import refeicao from '../assets/img_png/refeicao.png';
import escolhas from '../assets/img_png/escolha.png';

//CSS
import '../css/Home.css';

//Arquivo Mocks
import { receitasMock } from '../mocks/receitas';



function Home() {

    useEffect(() => {
        AOS.init({
            duration: 2500,
            once: false,
            disable: false, // <<< garante que NÃO desativa no mobile
        });
    }, []);






    return (
        <>

            <div className="comeco">

                <div className="bloco-inicial">
                    <div className="imagem-com-gradiente" />


                    <div className="bloco-texto">
                        <h1>Te ajudo a transformar sua alimentação de forma leve e sem complicações!</h1>
                        <Botao className='botao-inicial'>Agendar Consulta</Botao>
                    </div>
                </div>




                <div className="descricao espacamento">
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

            <div className="sobre-nutri-mobile espacamento">
                <div className="foto-nutri">
                    <img src={foto_nutri} alt="" />

                </div>
                <div className="infos-dois">
                    <h2 className="primeiro-text text-small">Olá, eu sou a</h2>
                    <h2 className="segundo-text text-medium">Nutricionista</h2>
                    <h2 className="segundo-text text-large">Natália Simanoviski</h2>
                    <hr className='mobile-hr' />
                    <p className="terceiro-text small">Sou nutricionista <span className="color-text"> apaixonada por <br /> transformar
                        a alimentação em algo  <br /> leve  e equilibrado.</span> Além
                        de nutri, <br />  quero ser sua amiga nessa jornada.<br />
                        Vamos juntos?</p>
                    <Botao className="btn-dois" text="+Sobre Mim" >+Sobre Mim</Botao>
                </div>


            </div>


            <div className="carrosel-mobile espacamento ">


                <CarroselMobile
                    titulo="Qual o seu objetivo?"
                    tipo="servicos"
                    dados={[
                        { id: 1, icone: <Iconclinica />, nome: "Nutrição Clínica" },
                        { id: 2, icone: <Iconpediatria />, nome: "Nutrição Pediátrica" },
                        { id: 3, icone: <Iconesportiva />, nome: "Nutrição Esportiva" },
                        { id: 4, icone: <Iconemagrecer />, nome: "Emagrecimento e Obesidade" },
                        { id: 5, icone: <Iconintolerancia />, nome: "Intolerâncias Alimentares" },
                    ]}
                />

            </div>

            <div className="secao espacamento">
                <Titulo texto="Qual o seu objetivo?" />

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

            <div className="sobre-nutri espacamento">
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

            <div className="sobre-consulta espacamento">
                <Titulo texto="Plano Nutricional Feito Para Você!" />

                <div className="planejamento">

                    <div data-aos="fade-up" data-aos-delay="0" className="item">
                        <div className="img-wrapper">
                            <img src={dieta} alt="" />
                        </div>
                        <p>Dieta Personalizado</p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="150" className="item">
                        <div className="img-wrapper">
                            <img src={acompanhamento} alt="" />
                        </div>
                        <p>Acompanhamento Contínuo</p>
                    </div>


                    <div data-aos="fade-up" data-aos-delay="300" className="item">
                        <div className="img-wrapper">
                            <img src={peso} alt="" />
                        </div>
                        <p>Controle de Peso</p>
                    </div>


                    <div data-aos="fade-up" data-aos-delay="450" className="item">
                        <div className="img-wrapper">
                            <img src={refeicao} alt="" />
                        </div>
                        <p>Planejamento de Refeições</p>
                    </div>


                </div>
            </div>

            <div className="funcionamento espacamento">

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

            <div className="dicas espacamento" >
                <div className="imagem-container"  data-aos="fade-right" data-aos-duration="2000">
                    <img src={escolhas} alt="" className='imagem-balançando' />
                  
                </div>
                 
                <div className="conteudo" data-aos="fade-right" data-aos-duration="2000">
                    <div className="linha-texto" >
                        <Titulo texto="Em dúvida do que escolher?"mostrarLinha={false} className='text-dicas' />
                        <p >
                            Saiba exatamente o que comer (e o que evitar) em qualquer lugar!<br />
                            Descubra as melhores e piores opções em restaurantes, fast foods <br />
                            e muito mais. Com dicassimples e práticas, você pode se alimentar<br />
                            melhor sem abrir mão do sabor.
                        </p>
                        <h3>Faça escolhas mais saudáveis todos os dias!</h3>
                    </div>

                    <Botao className="botao-verde" text="Ver Dicas">Ver Dicas</Botao>
                </div>
            </div>


            <div className="Receitas espacamento">
                <Carrosel
                    titulo="Receitas Saudáveis e Deliciosas"
                    subtitulo="Encontre opções equilibradas e saborosas para sua rotina!"
                    dados={receitasMock}

                />
                <div className="btn-receitas">
                    <Botao text="Ver Receitas">Ver Receitas</Botao></div>

            </div>

            <div className="receitas-mobile espacamento">
                <CarroselMobile
                    titulo="Receitas Saudáveis e Deliciosas"
                    subtitulo="Encontre opções equilibradas e saborosas para sua rotina!"
                    tipo="receitas"
                    dados={receitasMock}
                />

            </div>


            <div className="valor espacamento">
                <div className="info-valor">

                    <div className="lado-imagem">
                        <div className="imagem-gradiente"></div>
                    </div>

                    <div className="textos">
                        <h1>Consulta de Nutrição</h1>
                        <p className="text-p">Avaliação completa e plano personalizado</p>

                        <p className="preco-text"><FaUser className="preco-icons" /> Atendimento individualizado</p>
                        <p className="preco-text"><FaClipboardList className="preco-icons" /> Plano alimentar personalizado</p>
                        <p className="preco-text suporte"><FaCommentDots className="preco-icons" /> Suporte por 30 dias via WhatsApp</p>
                        <p className="preco-text"><FaBook className="preco-icons" /> Receitas e materiais de apoio</p>
                    </div>

                    <div className="box-preco">
                        <div className="preco-linha">
                            <h2>R$ 150</h2>
                            <span>consulta avulsa</span>
                        </div>
                        <Botao className="botao-verde">Agendar Consulta</Botao>
                    </div>


                </div>
            </div>



            <div className="form espacamento">

                <Formulario />
            </div>




        </>
    )
} export default Home;