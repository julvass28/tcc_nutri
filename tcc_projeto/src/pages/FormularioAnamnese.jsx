import React, { useState } from "react";
import { perguntasComum, perguntasEspecificas } from "../data/anamnesePerguntas";
import '../css/Anamnese.css';
import ondaAnamnese from '../assets/img_png/ondaAnamnese.png';
import ondabaixo from '../assets/img_png/ondabaixo.png';

function FormularioAnamnese({ modalidadeSelecionada }) {
    //.charAt(0) pega a priemira letra -> toUpperCase transforma em maiuscula, depois junta
    const titulo = `Anamnese ${modalidadeSelecionada.charAt(0).toUpperCase() + modalidadeSelecionada.slice(1)}`;
    const [respostas, setRespostas] = useState({});

    let perguntas = [];

    if (modalidadeSelecionada === 'pediatrica') {
        perguntas = perguntasEspecificas.pediatrica; // só as específicas de pediatria
    } else if (perguntasEspecificas[modalidadeSelecionada]) {
        perguntas = perguntasComum.concat(perguntasEspecificas[modalidadeSelecionada]);
    } else {
        perguntas = perguntasComum;
    }

    // Se tem perguntas específicas da modalidade, junta com as comuns
    // Se não, só usa as comuns

    const handleChange = (pergunta, valor) => {
        setRespostas((prev) => ({ ...prev, [pergunta]: valor }));
        // Atualiza a resposta dessa pergunta específica
    };

    // Quando clica em um checkbox
    const handleCheckboxChange = (pergunta, opcao) => {
        setRespostas((prev) => {
            const respostasAnteriores = prev[pergunta] || [];
            // Pega as respostas anteriores (ou array vazio)

            if (respostasAnteriores.includes(opcao)) {
                // Se já tinha clicado nessa opção, desmarca (remove do array)
                return {
                    ...prev,
                    [pergunta]: respostasAnteriores.filter((item) => item !== opcao),
                };
            } else {
                // Se ainda não tinha clicado, adiciona a nova opção
                return {
                    ...prev,
                    [pergunta]: [...respostasAnteriores, opcao],
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Não deixa a página recarregar
        console.log("Respostas finais:", respostas); // Mostra tudo no console
        alert("Formulário enviado! Veja as respostas no console."); // Alerta simples
    };

    return (
        <div className="bodyAnamnese">
            <form className="formAnamnese" onSubmit={handleSubmit}>
                <div className="ondaAnamnese">
                    <img src={ondaAnamnese} alt="Onda decorativa" />
                </div>

                <div className="conteudoAnamnese">
                    <div className="tituloform">
                        <h1 className="tituloAnamnese">{titulo}</h1>
                    </div>

                    {perguntas.map((secao, index) => (
                        <div key={index}>
                            {/*verifica se titulo existe, se existir aparece o h2*/}
                            {secao.titulo && <h2 className="sessaoAnamnese">{secao.titulo}</h2>}

                            {secao.perguntas && secao.perguntas.map((perguntaObj, idx) => (
                                <div key={idx}>
                                    {perguntaObj.tipo === "titulo" ? (
                                        <h3 className="sessaoAnamnese">{perguntaObj.texto}</h3>
                                    ) : (
                                        <>
                                            {/* Se tiver "pergunta", exibe a label */}
                                            <div className="campoAnamnese">
                                                {perguntaObj.pergunta && (
                                                    <label className="labelAnamnese">{perguntaObj.pergunta}</label>
                                                )}

                                                {["texto", "email", "telefone", "number", "date"].includes(perguntaObj.tipo) && (
                                                    <div className="inputComUnidade">
                                                        <input
                                                            className={
                                                                ["texto", "email", "telefone"].includes(perguntaObj.tipo)
                                                                    ? "inputAnamnese inputGrande "
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
                                            </div>

                                            {/*Campo Radio */}
                                            <div className="grupoOpcao">
                                                {perguntaObj.tipo === "radio" && perguntaObj.opcoes.map((opcao, i) => (
                                                    <div className="linhaOpcao" key={i}>
                                                        <input
                                                            className="inputAnamnese"
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


                                            {/* Radio → usa evento (e.target.value) porque é uma resposta única.
                                            Checkbox → NÃO usa evento, porque acumula várias respostas e a opção 
                                            já está no contexto do map.*/}

                                            {/*CAMPO CHECKBOX */}
                                            <div className="grupoOpcao" >
                                                {perguntaObj.tipo === "checkbox" && perguntaObj.opcoes.map((opcao, i) => (
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
                                                ))}</div>

                                            {/* Radio com input texto condicional */}
                                            <div className="grupoOpcao" >
                                                {perguntaObj.tipo === "radio_condicional_texto" && perguntaObj.opcoes.map((opcao, i) => (
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
                                                            respostas[perguntaObj.pergunta] === opcao && (
                                                                <div >
                                                                    <input className="condicaoAnamnese"
                                                                        type="text"
                                                                        placeholder={perguntaObj.placeholder}
                                                                        onChange={(e) => handleChange(`${perguntaObj.pergunta}_condicional`, e.target.value)}
                                                                    />
                                                                </div>
                                                            )}

                                                    </div>
                                                ))}</div>

                                            {/* Radio com sub-checkbox condicional */}
                                            <div className="grupoOpcao" >
                                                {perguntaObj.tipo === "radio_condicional_checkbox" && perguntaObj.opcoes.map((opcao, i) => (
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
                                                                        onChange={() => handleCheckboxChange(`${perguntaObj.pergunta}_sub`, subOpcao)}
                                                                    />
                                                                    <label className="textoOpcao">{subOpcao}</label>

                                                                    {perguntaObj.subpergunta.tipo === "checkbox_outros" &&
                                                                        subOpcao === "Outros" &&
                                                                        respostas[`${perguntaObj.pergunta}_sub`]?.includes("Outros") && (
                                                                            <input className="condicaoAnamnese"
                                                                                type="text"
                                                                                placeholder="Especifique Outros..."
                                                                                onChange={(e) => handleChange(`${perguntaObj.pergunta}_sub_outros`, e.target.value)}
                                                                            />
                                                                        )}
                                                                </div>
                                                            ))}
                                                    </div>
                                                ))}
                                            </div>

                                            {/*CAMPO FREQUÊNCIA DE CONSUMO */}
                                            <div className="grupoOpcao" >
                                                {perguntaObj.tipo === "frequencia_consumo" && perguntaObj.itens?.map((item, i) => (
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

                                                                <label className="textoOpcao">{opcao}</label></div>

                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="botaoAnamnese">
                    <button className="submitAnamnese" type="submit">Enviar</button></div>
                </div>
                <div className="ondaAnamnesebaixo">
                    <img src={ondabaixo} alt="Onda decorativa" />
                </div>
            </form>
        </div>
    );
}

export default FormularioAnamnese;
