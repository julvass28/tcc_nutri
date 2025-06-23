import React, { useState } from "react";
import { perguntasComum, perguntasEspecificas } from "../data/anamnesePerguntas";

function FormularioAnamnese({ modalidadeSelecionada }) {
    const [respostas, setRespostas] = useState({});

    const perguntas = perguntasEspecificas[modalidadeSelecionada] ?
        perguntasComum.concat(perguntasEspecificas[modalidadeSelecionada])
        : perguntasComum;
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
        <form onSubmit={handleSubmit}>
            {perguntas.map((secao, index) => (
                <div key={index}>

                    {/*verifica se titulo existe, se existir aparece o h2*/}
                    {secao.titulo && <h2>{secao.titulo}</h2>}
                    {secao.perguntas &&
                        secao.perguntas.map((perguntaObj, idx) => (
                            <div key={idx}>
                                {perguntaObj.tipo === "titulo" && <h3>{perguntaObj.texto}</h3>}
                                {perguntaObj.pergunta && (
                                    <>
                                        <label>{perguntaObj.pergunta}</label>

                                        {/*se for do tipo texto */}
                                        {perguntaObj.tipo === "texto" && (
                                            <input type="text"
                                                placeholder={perguntaObj.placeholder || ""}
                                                /*onChange: Sempre que o usuário digitar algo, o React captura o evento
                                                // e: É o evento (event), que contém informações do que o usuário digitou
                                                // e.target.value: O valor atual digitado no campo
                                                // handleChange: Função que criamos para salvar a resposta (pergunta + valor digitado) no estado*/
                                                onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)} />
                                        )}

                                        {/*Campo Radio */}
                                        {perguntaObj.tipo === "radio" && (
                                            perguntaObj.opcoes.map((opcao, i) => (
                                                <div key={i}>
                                                    <input type="radio"
                                                        name={perguntaObj.pergunta} //identificar que todas as opçoes estao dentro da mesma pergunta
                                                        value={opcao} //o valor vai ser as opções
                                                        //so vai ficar checked se o valor salvo em respostas for igual a opção
                                                        checked={respostas[perguntaObj.pergunta] === opcao}
                                                        onChange={(e) => handleChange(perguntaObj.pergunta, e.target.value)} />
                                                    {opcao}{/*aparece em texto */}


                                              
                                                    
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}

                            </div>
                        ))}
                </div>
            ))}
        </form>
    )
}

export default FormularioAnamnese;
