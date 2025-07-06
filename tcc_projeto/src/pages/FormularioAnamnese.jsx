import React, { useState } from "react";
import { perguntasComum, perguntasEspecificas } from "../data/anamnesePerguntas";
import '../css/Anamnese.css';
import ondaAnamnese from '../assets/img_png/ondaAnamnese.png'



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
                      <h1 className="tituloAnamnese">{titulo}</h1> </div>
                    {perguntas.map((secao, index) => (
                        <div key={index}>
                            {/*verifica se titulo existe, se existir aparece o h2*/}
                            {secao.titulo && <h2>{secao.titulo}</h2>}

                            {secao.perguntas && secao.perguntas.map((perguntaObj, idx) => (
                                <div key={idx}>
                                    {perguntaObj.tipo === "titulo" && <h3>{perguntaObj.texto}</h3>}

                                    <>
                                        {/* Se tiver "pergunta", exibe a label */}
                                        {perguntaObj.pergunta && <label>{perguntaObj.pergunta}</label>}

                                        {/*se for do tipo texto */}
                                        {perguntaObj.tipo === "texto" && (
                                            <input
                                                type="text"
                                                placeholder={perguntaObj.placeholder || ""}
                                                /*onChange: Sempre que o usuário digitar algo, o React captura o evento
                                                // e: É o evento (event), que contém informações do que o usuário digitou
                                                // e.target.value: O valor atual digitado no campo
                                                // handleChange: Função que criamos para salvar a resposta (pergunta + valor digitado) no estado*/
                                                onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                            />
                                        )}

                                        {/*Campo Radio */}
                                        {perguntaObj.tipo === "radio" && perguntaObj.opcoes.map((opcao, i) => (
                                            <div key={i}>
                                                <input
                                                    type="radio"
                                                    name={perguntaObj.pergunta} //identificar que todas as opçoes estao dentro da mesma pergunta
                                                    value={opcao} //o valor vai ser as opções
                                                    //so vai ficar checked se o valor salvo em respostas for igual a opção
                                                    checked={respostas[perguntaObj.pergunta] === opcao}
                                                    onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                />
                                                {opcao}{/*aparece em texto */}
                                            </div>
                                        ))}

                                        {/* Radio → usa evento (e.target.value) porque é uma resposta única.
                                Checkbox → NÃO usa evento, porque acumula várias respostas e a opção 
                                já está no contexto do map.*/}

                                        {/*CAMPO CHECKBOX */}
                                        {perguntaObj.tipo === "checkbox" && perguntaObj.opcoes.map((opcao, i) => (
                                            <div key={i}>
                                                <input
                                                    type="checkbox"
                                                    name={perguntaObj.pergunta}
                                                    value={opcao}
                                                    // Checkbox: permite múltiplas seleções, então usamos includes para saber se a opção foi marcada
                                                    checked={respostas[perguntaObj.pergunta]?.includes(opcao) || false}
                                                    onChange={() => handleCheckboxChange(perguntaObj.pergunta, opcao)}
                                                />
                                                {opcao}
                                            </div>
                                        ))}

                                        {/* Radio com input texto condicional */}
                                        {perguntaObj.tipo === "radio_condicional_texto" && perguntaObj.opcoes.map((opcao, i) => (
                                            <div key={i}>
                                                <input
                                                    type="radio"
                                                    name={perguntaObj.pergunta}
                                                    value={opcao}
                                                    checked={respostas[perguntaObj.pergunta] === opcao}
                                                    onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                />
                                                {opcao}

                                                {/*se a opçao atual for igual a condiçao definida na pergunta*/}
                                                {opcao === perguntaObj.condicao &&
                                                    respostas[perguntaObj.pergunta] === opcao && (
                                                        <input
                                                            type="text"
                                                            placeholder={perguntaObj.placeholder}
                                                            onChange={(e) => handleChange(`${perguntaObj.pergunta}_condicional`, e.target.value)}
                                                        />
                                                    )}
                                            </div>
                                        ))}

                                        {/* Radio com sub-checkbox condicional */}
                                        {perguntaObj.tipo === "radio_condicional_checkbox" && perguntaObj.opcoes.map((opcao, i) => (
                                            <div key={i}>
                                                <input
                                                    type="radio"
                                                    name={perguntaObj.pergunta}
                                                    value={opcao}
                                                    checked={respostas[perguntaObj.pergunta] === opcao}
                                                    onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)}
                                                />
                                                {opcao}

                                                {opcao === perguntaObj.condicao &&
                                                    respostas[perguntaObj.pergunta] === opcao &&
                                                    perguntaObj.subpergunta &&
                                                    perguntaObj.subpergunta.opcoes.map((subOpcao, s) => (
                                                        <div key={s}>
                                                            <input
                                                                type="checkbox"
                                                                name={`${perguntaObj.pergunta}_sub`}
                                                                value={subOpcao}
                                                                checked={respostas[`${perguntaObj.pergunta}_sub`]?.includes(subOpcao) || false}
                                                                onChange={() => handleCheckboxChange(`${perguntaObj.pergunta}_sub`, subOpcao)}
                                                            />
                                                            {subOpcao}

                                                            {perguntaObj.subpergunta.tipo === "checkbox_outros" &&
                                                                subOpcao === "Outros" &&
                                                                respostas[`${perguntaObj.pergunta}_sub`]?.includes("Outros") && (
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Especifique Outros..."
                                                                        onChange={(e) => handleChange(`${perguntaObj.pergunta}_sub_outros`, e.target.value)}
                                                                    />
                                                                )}
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}

                                        {/*CAMPO FREQUÊNCIA DE CONSUMO */}
                                        {perguntaObj.tipo === "frequencia_consumo" && perguntaObj.itens?.map((item, i) => (
                                            <div key={i}>
                                                <label>{item.alimento}</label>
                                                {item.opcoes.map((opcao, j) => (
                                                    <div key={j}>
                                                        <input
                                                            type="radio"
                                                            name={item.alimento}
                                                            value={opcao}
                                                            checked={respostas[item.alimento] === opcao}
                                                            onChange={(e) => handleChange(item.alimento, e.target.value)}
                                                        />
                                                        {opcao}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default FormularioAnamnese;
