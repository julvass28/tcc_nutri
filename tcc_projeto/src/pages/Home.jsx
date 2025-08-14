//Componentes
import Botao from "../components/botao/Botao";
import Carrosel from "../components/carrosel/desktop";
import Titulo from "../components/titulo/titulo";
import Formulario from "../components/formulario/formulario";
import CarroselMobile from '../components/carrosel/mobile';
import SectionCalculators from '../components/SectionCalculators';

//Bibliotecas
import { FaUser, FaClipboardList, FaCommentDots, FaBook } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';






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
            disable: false,
        });
    }, []);






    return (
        <>

            <div className="home-comeco">

                <div className="home-bloco-inicial">
                    <div className="home-imagem-com-gradiente" />


                    <div className="home-bloco-texto">
                        <h1>Te ajudo a transformar sua alimentação de forma leve e sem complicações!</h1>
                        <Botao className='botao-inicial-home'>Agendar Consulta</Botao>
                    </div>
                </div>




                <div className="home-descricao espacamento">
                    <div className="home-infos">
                        <img src={foto} alt="" className="home-foto" />
                        <h2 className="num-home">CRN : 37892</h2>
                    </div>
                    <div className="sobre-home">
                        <h2 className="primeiro-text-home">NUTRICIONISTA</h2>
                        <h1 className="segundo-text-home">Natália Simanoviski</h1>
                        <p className="terceiro-text-home">Cuidado nutricional personalizado para <br /> cada necessidade!</p>
                        <Botao >Agendar Consulta</Botao>
                    </div>
                </div>
            </div>

            <div className="sobre-nutri-mobile espacamento">
                <div className="foto-nutri-home">
                    <img src={foto_nutri} alt="" />

                </div>
                <div className="infos-dois-home">
                    <h2 className="primeiro-text-home text-small-home">Olá, eu sou a</h2>
                    <h2 className="segundo-text-home text-medium-home">Nutricionista</h2>
                    <h2 className="segundo-text-home text-large-home">Natália Simanoviski</h2>
                    <hr className='mobile-hr' />
                    <p className="terceiro-text-home small-home">Sou nutricionista <span className="color-text"> apaixonada por  transformar
                        a alimentação em algo  leve  e equilibrado.</span> Além
                        de nutri,  quero ser sua amiga nessa jornada.
                        Vamos juntos?</p>
                    <Botao className="btn-dois" text="+Sobre Mim" >+Sobre Mim</Botao>
                </div>


            </div>


            <div className="carrosel-mobile espacamento ">


                <CarroselMobile
                    titulo="Qual o seu objetivo?"
                    tipo="servicos"
                    dados={[
                        { id: 1, icone: <Iconclinica />, nome: "Nutrição Clínica",  link: "/especialidade/clinica" },
                        { id: 2, icone: <Iconpediatria />, nome: "Nutrição Pediátrica", link: "/especialidade/pediatrica" },
                        { id: 3, icone: <Iconesportiva />, nome: "Nutrição Esportiva", link: "/especialidade/esportiva" },
                        { id: 4, icone: <Iconemagrecer />, nome: "Emagrecimento e Obesidade", link: "/especialidade/emagrecimento" },
                        { id: 5, icone: <Iconintolerancia />, nome: "Intolerâncias Alimentares",link: "/especialidade/intolerancia" },
                    ]}
                />

            </div>

            <div className="secao-home espacamento">
                <Titulo texto="Qual o seu objetivo?" />

                <div className="home-categorias">
                    <div className="home-linha">




                        <Link to="/especialidade/clinica" className="home-categoria">
                            <Iconclinica className="home-icone" />
                            <p>Nutrição Clínica</p>
                        </Link>

                        <Link to="/especialidade/pediatrica" className="home-categoria">
                            <Iconpediatria className="home-icone" />
                            <p>Nutrição Pediátrica</p>
                        </Link>

                        <Link to="/especialidade/esportiva" className="home-categoria">
                            <Iconesportiva className="home-icone" />
                            <p>Nutrição Esportiva</p>
                        </Link>
                    </div>


                    <div className="home-linha home-linha-menor">
                        <Link to="/especialidade/emagrecimento" className="home-categoria">
                            <Iconemagrecer className="home-icone" />
                            <p>Emagrecimento <br />e Obesidade</p>
                        </Link>

                        <Link to="/especialidade/intolerancia" className="home-categoria">
                            <Iconintolerancia className="home-icone" />
                            <p>Intolerâncias <br /> Alimentares</p>
                        </Link>
                    </div>

                </div>

            </div>

            <div className="sobre-nutri-home espacamento">
                <div className="infos-dois-home">
                    <h2 className="primeiro-text-home text-small-home">Olá, eu sou a</h2>
                    <h2 className="segundo-text-home text-medium-home">Nutricionista</h2>
                    <h2 className="segundo-text-home text-large-home">Natália Simanoviski</h2>
                    <p className="terceiro-text-home small-home">Sou nutricionista<span className="color-text"> apaixonada por transformar
                        sua alimentação em algo leve e equilibrado.</span> Além
                        de nutri, quero ser sua amiga nessa jornada.
                        Vamos juntos?</p>
                    <Botao className="btn-dois" to="/sobre" text="+Sobre Mim" >+Sobre Mim</Botao>
                </div>

                <div className="foto-nutri-home">
                    <img src={foto_nutri} alt="" />

                </div>
            </div>

            <div className="sobre-consulta-home espacamento">
                <Titulo texto="Plano Nutricional Feito Para Você!" />

                <div className="planejamento-home">

                    <div data-aos="fade-up" data-aos-delay="0" className="item-home">
                        <div className="img-wrapper-home">
                            <img src={dieta} alt="" />
                        </div>
                        <p>Dieta Personalizado</p>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="150" className="item-home">
                        <div className="img-wrapper-home">
                            <img src={acompanhamento} alt="" />
                        </div>
                        <p>Acompanhamento Contínuo</p>
                    </div>


                    <div data-aos="fade-up" data-aos-delay="300" className="item-home">
                        <div className="img-wrapper-home">
                            <img src={peso} alt="" />
                        </div>
                        <p>Controle de Peso</p>
                    </div>


                    <div data-aos="fade-up" data-aos-delay="450" className="item-home">
                        <div className="img-wrapper-home">
                            <img src={refeicao} alt="" />
                        </div>
                        <p>Planejamento de Refeições</p>
                    </div>


                </div>
            </div>

            <div className="funcionamento-home espacamento">

                <div className="topic-home">
                    <Titulo texto="Como Funciona Meu Atendimento Online?" mostrarLinha={false} />
                    <div className="topicos-home">
                        <p><IoIosCheckmarkCircleOutline className="icone-dois-home" />Anamnese Nutricional</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois-home" />Avaliação Física e Nutricional</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois-home" />Consulta Online</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois-home" />Estratégia Alimentar Individualizada</p>
                        <p><IoIosCheckmarkCircleOutline className="icone-dois-home" />Acompanhamento Contínuo</p>
                    </div>
                    <Botao text="Saiba Mais" >Saiba Mais</Botao>
                </div>
            </div>

            <div className="dicas-home espacamento" >
                <div className="imagem-container-dicas" data-aos="fade-right" data-aos-duration="2000">
                    <img src={escolhas} alt="" />

                </div>

                <div className="conteudo-dicas" data-aos="fade-right" data-aos-duration="2000">
                    <Titulo texto="Em dúvida do que escolher?" mostrarLinha={false} />
                    <div className="linha-texto-dicas" >

                        <p >
                            Saiba exatamente o que comer (e o que evitar) em qualquer lugar!
                            Descubra as melhores e piores opções em restaurantes, fast foods
                            e muito mais. Com dicassimples e práticas, você pode se alimentar
                            melhor sem abrir mão do sabor.
                        </p>
                        <h3>Faça escolhas mais saudáveis todos os dias!</h3>
                    </div>
                    <Botao className="botao-verde" to="/DicaNutri-Praia" text="Ver Dicas">
                        Ver Dicas
                    </Botao>

                </div>
            </div>


            <div className="Receitas espacamento">
                <Carrosel
                    titulo="Receitas Saudáveis e Deliciosas"
                    subtitulo="Encontre opções equilibradas e saborosas para sua rotina!"
                    dados={receitasMock}

                />
                <div className="btn-receitas-home">
                    <Botao to="/receitas/ReceitasClinicas" text="Ver Receitas">Ver Receitas</Botao></div>

            </div>

            <div className="receitas-mobile espacamento">
                <CarroselMobile
                    titulo="Receitas Saudáveis e Deliciosas"
                    subtitulo="Encontre opções equilibradas e saborosas para sua rotina!"
                    tipo="receitas"
                    dados={receitasMock}
                />

            </div>


            <div className="valor-home espacamento">
                <div className="info-valor-home">

                    <div className="lado-imagem-home">
                        <div className="imagem-gradiente-home"></div>
                    </div>

                    <div className="textos-home">
                        <h1>Consulta de Nutrição</h1>
                        <p className="text-p-home">Avaliação completa e plano personalizado</p>

                        <p className="preco-text-home"><FaUser className="preco-icons-home" /> Atendimento individualizado</p>
                        <p className="preco-text-home"><FaClipboardList className="preco-icons-home" /> Plano alimentar personalizado</p>
                        <p className="preco-text-home suporte-home"><FaCommentDots className="preco-icons-home" /> Suporte por 30 dias via WhatsApp</p>
                        <p className="preco-text-home"><FaBook className="preco-icons-home" /> Receitas e materiais de apoio</p>
                    </div>

                    <div className="box-preco-home">
                        <div className="preco-linha-home">
                            <h2>R$ 150</h2>
                            <span>consulta avulsa</span>
                        </div>
                        <Botao className="botao-verde">Agendar Consulta</Botao>
                    </div>


                </div>
            </div>

            <div className="container-section-calculadoras-home">
                <SectionCalculators />
            </div>

            <div className="form espacamento">
                <Formulario />
            </div>




        </>
    )
} export default Home;