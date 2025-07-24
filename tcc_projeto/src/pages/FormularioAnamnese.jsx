import React, { useState, useMemo } from "react";
import { perguntasComum, perguntasEspecificas } from "../data/anamnesePerguntas";
import '../css/Anamnese.css';
import ondaAnamnese from '../assets/img_png/ondaAnamnese.png';
import ondabaixo from '../assets/img_png/ondabaixo.png';
import { z } from "zod";

function FormularioAnamnese({ modalidadeSelecionada }) {
    const titulo = `Anamnese ${modalidadeSelecionada.charAt(0).toUpperCase() + modalidadeSelecionada.slice(1)}`;
    const [respostas, setRespostas] = useState({});
    const [erros, setErros] = useState({});
    const [enviar, setEnviar] = useState(false);
    const [mensagem, setMensagem] = useState("");


    let perguntas = [];

    if (modalidadeSelecionada === 'pediatrica') {
        perguntas = perguntasEspecificas.pediatrica;
    } else if (perguntasEspecificas[modalidadeSelecionada]) {
        perguntas = perguntasComum.concat(perguntasEspecificas[modalidadeSelecionada]);
    } else {
        perguntas = perguntasComum;
    }

    const handleChange = (pergunta, valor) => {
        setRespostas((prev) => ({ ...prev, [pergunta]: valor }));
    };

    const handleCheckboxChange = (pergunta, opcao) => {
        setRespostas((prev) => {
            const respostasAnteriores = prev[pergunta] || [];
            if (respostasAnteriores.includes(opcao)) {
                return {
                    ...prev,
                    [pergunta]: respostasAnteriores.filter((item) => item !== opcao),
                };
            } else {
                return {
                    ...prev,
                    [pergunta]: [...respostasAnteriores, opcao],
                };
            }
        });
    };

    const validacao = useMemo(() => {
        const campos = {};
        perguntas.forEach(secao => {
            secao.perguntas?.forEach(perguntaObj => {
                const chave = perguntaObj.pergunta;
                if (!chave) return;

                switch (perguntaObj.tipo) {
                    case "checkbox":
                    case "radio_condicional_checkbox":
                        campos[chave] = z.array(z.string()).min(1, 'Selecione pelo menos uma opção');
                        break;
                    case "texto":
                        campos[chave] = z.string().min(3, "Mínimo 3 caracteres");
                        break;
                    case "email":
                        campos[chave] = z.string().email("Email inválido");
                        break;
                    case "telefone":
                        campos[chave] = z.string().min(10, "Telefone inválido");
                        break;
                    case "number":
                        campos[chave] = z.string().refine(val => !isNaN(Number(val)), {
                            message: "Insira um número válido"
                        });
                        break;
                    case "date":
                        campos[chave] = z.string().min(1, "Data obrigatória");
                        break;
                    case "radio":
                        campos[chave] = z.string().min(1, "Campo obrigatório");
                        break;
                    default:
                        campos[chave] = z.string().min(1, 'Campo obrigatório');
                        break;
                }
            });
        });
        return z.object(campos);
    }, [perguntas]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviar(true);
        setMensagem('');
        const resultado = validacao.safeParse(respostas);
        if (!resultado.success) {
            const errosFormatados = {};
            resultado.error.errors.forEach(err => {
                errosFormatados[err.path[0]] = err.message;
            });
            setErros(errosFormatados);
            setEnviar(false);
        } else {
            console.log("Respostas finais:", respostas);
            setErros({});
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMensagem("Formulário Enviado com Sucesso!");
            setEnviar(false);

        }
    };

    return (
        <div className="bodyAnamnese">
            <form noValidate className="formAnamnese" onSubmit={handleSubmit} >
                <div className="ondaAnamnese">
                    <img src={ondaAnamnese} alt="Onda decorativa" />
                </div>

                <div className="conteudoAnamnese">
                    <div className="tituloform">
                        <h1 className="tituloAnamnese">{titulo}</h1>
                    </div>

                    {perguntas.map((secao, index) => (
                        <div key={index}>
                            {secao.titulo && <h2 className="sessaoAnamnese">{secao.titulo}</h2>}

                            {secao.perguntas && secao.perguntas.map((perguntaObj, idx) => (
                                <div key={idx}>
                                    {perguntaObj.tipo === "titulo" ? (
                                        <h3 className="sessaoAnamnese">{perguntaObj.texto}</h3>
                                    ) : (
                                        <>
                                            <div className="campoAnamnese">
                                                {perguntaObj.pergunta && (
                                                    <label className="labelAnamnese">{perguntaObj.pergunta}</label>
                                                )}

                                                {["texto", "email", "telefone", "number", "date"].includes(perguntaObj.tipo) && (
                                                    <div className="inputComUnidade">
                                                        <input
                                                            className={
                                                                ["texto", "email", "telefone"].includes(perguntaObj.tipo)
                                                                    ? "inputAnamnese inputGrande"
                                                                    : "inputAnamnese inputPequeno"
                                                            }
                                                            type={
                                                                perguntaObj.tipo === "telefone"
                                                                    ? "tel"
                                                                    : perguntaObj.tipo === "texto"
                                                                        ? "text"
                                                                        : perguntaObj.tipo
                                                            }
                                                            placeholder={perguntaObj.placeholder || ""}
                                                            onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                        />
                                                        {perguntaObj.unidade && <span className="unidade">{perguntaObj.unidade}</span>}
                                                    </div>
                                                )}
                                                {erros[perguntaObj.pergunta] && <p className="erroMensagem">{erros[perguntaObj.pergunta]}</p>}
                                            </div>

                                            {/* RADIO */}
                                            {perguntaObj.tipo === "radio" && (
                                                <div className="grupoOpcao">
                                                    {perguntaObj.opcoes.map((opcao, i) => (
                                                        <div className="linhaOpcao" key={i}>
                                                            <input
                                                                type="radio"
                                                                name={perguntaObj.pergunta}
                                                                value={opcao}
                                                                checked={respostas[perguntaObj.pergunta] === opcao}
                                                                onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                            />
                                                            <label className="textoOpcao">{opcao}</label>
                                                        </div>
                                                    ))}

                                                </div>
                                            )}

                                            {/* CHECKBOX */}
                                            {perguntaObj.tipo === "checkbox" && (
                                                <div className="grupoOpcao">
                                                    {perguntaObj.opcoes.map((opcao, i) => (
                                                        <div className="linhaOpcao" key={i}>
                                                            <input
                                                                type="checkbox"
                                                                name={perguntaObj.pergunta}
                                                                value={opcao}
                                                                checked={respostas[perguntaObj.pergunta]?.includes(opcao) || false}
                                                                onChange={() => handleCheckboxChange(perguntaObj.pergunta, opcao)}
                                                            />
                                                            <label className="textoOpcao">{opcao}</label>
                                                        </div>
                                                    ))}
                                                    {erros[perguntaObj.pergunta] && <p className="erroMensagem">{erros[perguntaObj.pergunta]}</p>}
                                                </div>
                                            )}

                                            {/* RADIO CONDICIONAL COM TEXTO */}
                                            {perguntaObj.tipo === "radio_condicional_texto" && (
                                                <div className="grupoOpcao">
                                                    {perguntaObj.opcoes.map((opcao, i) => (
                                                        <div className="linhaOpcao" key={i}>
                                                            <input
                                                                type="radio"
                                                                name={perguntaObj.pergunta}
                                                                value={opcao}
                                                                checked={respostas[perguntaObj.pergunta] === opcao}
                                                                onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                            />
                                                            <label className="textoOpcao">{opcao}</label>

                                                            {opcao === perguntaObj.condicao && respostas[perguntaObj.pergunta] === opcao && (
                                                                <input
                                                                    className="condicaoAnamnese"
                                                                    type="text"
                                                                    placeholder={perguntaObj.placeholder}
                                                                    onChange={(e) =>
                                                                        handleChange(`${perguntaObj.pergunta}_condicional`, e.target.value)
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                    {erros[perguntaObj.pergunta] && <p className="erroMensagem">{erros[perguntaObj.pergunta]}</p>}
                                                </div>
                                            )}

                                            {/* RADIO COM SUB-CHECKBOX */}
                                            {perguntaObj.tipo === "radio_condicional_checkbox" && (
                                                <div className="grupoOpcao">
                                                    {perguntaObj.opcoes.map((opcao, i) => (
                                                        <div className="linhaOpcao" key={i}>
                                                            <input
                                                                type="radio"
                                                                name={perguntaObj.pergunta}
                                                                value={opcao}
                                                                checked={respostas[perguntaObj.pergunta] === opcao}
                                                                onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                            />
                                                            <label className="textoOpcao">{opcao}</label>

                                                            {opcao === perguntaObj.condicao &&
                                                                respostas[perguntaObj.pergunta] === opcao &&
                                                                perguntaObj.subpergunta &&
                                                                perguntaObj.subpergunta.opcoes.map((subOpcao, s) => (
                                                                    <div className="frequenciaAnamnese" key={s}>
                                                                        <input
                                                                            type="checkbox"
                                                                            name={`${perguntaObj.pergunta}_sub`}
                                                                            value={subOpcao}
                                                                            checked={respostas[`${perguntaObj.pergunta}_sub`]?.includes(subOpcao) || false}
                                                                            onChange={() =>
                                                                                handleCheckboxChange(`${perguntaObj.pergunta}_sub`, subOpcao)
                                                                            }
                                                                        />
                                                                        <label className="textoOpcao">{subOpcao}</label>

                                                                        {perguntaObj.subpergunta.tipo === "checkbox_outros" &&
                                                                            subOpcao === "Outros" &&
                                                                            respostas[`${perguntaObj.pergunta}_sub`]?.includes("Outros") && (
                                                                                <input
                                                                                    className="condicaoAnamnese"
                                                                                    type="text"
                                                                                    placeholder="Especifique Outros..."
                                                                                    onChange={(e) =>
                                                                                        handleChange(`${perguntaObj.pergunta}_sub_outros`, e.target.value)
                                                                                    }
                                                                                />
                                                                            )}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    ))}
                                                    {erros[perguntaObj.pergunta] && <p className="erroMensagem">{erros[perguntaObj.pergunta]}</p>}
                                                </div>
                                            )}

                                            {/* FREQUÊNCIA DE CONSUMO */}
                                            {perguntaObj.tipo === "frequencia_consumo" && (
                                                <div className="grupoOpcao">
                                                    {perguntaObj.itens?.map((item, i) => (
                                                        <div className="linhaOpcao linhaFrequencia" key={i}>
                                                            <label className="alimentoAnamnese">{item.alimento}</label>
                                                            {item.opcoes.map((opcao, j) => (
                                                                <div className="frequenciaAnamnese" key={j}>
                                                                    <input
                                                                        type="radio"
                                                                        name={item.alimento}
                                                                        value={opcao}
                                                                        checked={respostas[item.alimento] === opcao}
                                                                        onChange={(e) => handleChange(item.alimento, e.target.value)}
                                                                    />
                                                                    <label className="textoOpcao">{opcao}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                    {erros[perguntaObj.pergunta] && <p className="erroMensagem">{erros[perguntaObj.pergunta]}</p>}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="botaoAnamnese">
                        <button className="submitAnamnese" type="submit" disabled={enviar}>
                            {enviar ? "Enviando..." : "Enviar"}
                        </button>
                    </div>
                </div>
                <div className="ondaAnamnesebaixo">
                    <img src={ondabaixo} alt="Onda decorativa" />
                </div>
            </form>
        </div>
    );
}

export default FormularioAnamnese;
