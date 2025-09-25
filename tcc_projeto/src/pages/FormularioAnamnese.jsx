import React, { useState, useMemo } from "react";
import {
  perguntasComum,
  perguntasEspecificas,
} from "../data/anamnesePerguntas";
import "../css/Anamnese.css";
import ondaAnamnese from "../assets/img_png/ondaAnamnese.png";
import ondabaixo from "../assets/img_png/ondabaixo.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function FormularioAnamnese({ modalidadeSelecionada }) {
  // helpers para normalizar a especialidade que vem do agendamento
  const semAcento = (s = "") =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const mapEspecialidadeParaModalidade = (esp = "") => {
    const s = semAcento(esp);
    if (s.includes("pediatr")) return "pediatrica";
    if (s.includes("esport")) return "esportiva";
    if (s.includes("intoler")) return "intolerancias";
    if (s.includes("emagrec")) return "emagrecimento";
    // padrão
    return "clinica";
  };

  // 1) origem da info:
  //   - prop (se vier via outro fluxo)
  //   - sessionStorage (setado na Agenda.jsx)
  //   - fallback "clinica"
  const rawEsp =
    modalidadeSelecionada ??
    sessionStorage.getItem("booking.especialidade") ??
    "Nutrição Clínica";

  const modalidade = mapEspecialidadeParaModalidade(rawEsp);

  // título bonitinho
  const titulo =
    "Anamnese " +
    (rawEsp?.charAt
      ? rawEsp.charAt(0).toUpperCase() + rawEsp.slice(1)
      : "Clínica");

  const [enviar, setEnviar] = useState(false);
  const [mensagem, setMensagem] = useState("");

  let perguntas = [];

  if (modalidade === "pediatrica") {
    perguntas = perguntasEspecificas.pediatrica;
  } else if (perguntasEspecificas[modalidade]) {
    perguntas = perguntasComum.concat(perguntasEspecificas[modalidade]);
  } else {
    perguntas = perguntasComum;
  }
  /**
   * RESUMO DOS HOOKS:
   * - register: conecta o input com o React Hook Form
   * - watch: observa o valor atual de um campo
   * - setValue: altera programaticamente o valor de um campo
   * - handleSubmit: lida com o envio do formulário
   * - errors: contém os erros de validação
   */

  //Validação
  //useMemo = memorização, nao atualiza caso perguntas nao mude
  const validacao = useMemo(() => {
    const campos = {}; //começa vazio, e depois fica com as regras de validação que defini
    perguntas.forEach((secao) => {
      secao.perguntas?.forEach((perguntaObj) => {
        const chave = perguntaObj.pergunta;
        if (!chave) return;

        switch (perguntaObj.tipo) {
          case "checkbox":
          case "radio_condicional_checkbox":
            campos[chave] = z
              .array(z.string(), {
                required_error: "*Selecione pelo menos uma opção",
              })
              .min(1, "*Selecione pelo menos uma opção");
            break;

          case "radio_condicional_texto":
            //cria um objeto ja que condicional depende da validaçao de radio
            //defini resposta e condicional no ...register de cada input
            //refine= validaçoes perzonalizadas do zod
            //trim remove espaços em branco

            campos[chave] = z
              .object({
                resposta: z
                  .string({ required_error: "*Selecione uma opção" })
                  .min(1, "*Selecione uma opção"),
                condicional: z.string().optional(),
              })
              .refine(
                (val) => {
                  if (val.resposta === perguntaObj.condicao) {
                    return val.condicional && val.condicional.trim().length > 0;
                  }
                  return true;
                },
                {
                  message: "*Campo obrigatório quando selecionado",
                  path: ["condicional"], // isso indica que o erro é do campo condicional
                }
              );

            break;

          case "frequencia_consumo":
            const frequenciaShape = {};
            perguntaObj.itens?.forEach((item) => {
              frequenciaShape[item.alimento] = z
                .string({
                  required_error: `Selecione uma opção `,
                })
                .nonempty(`Selecione uma opção`);
            });
            campos[chave] = z.object(frequenciaShape);
            break;

          case "texto":
            campos[chave] = z.string().min(3, "*Mínimo 3 caracteres");
            break;

          case "email":
            campos[chave] = z.string().email("*Email inválido");
            break;

          case "telefone":
            campos[chave] = z.string().min(10, "*Telefone inválido");
            break;

          case "number":
            campos[chave] = z
              .string()
              .min(1, "*Campo obrigatória")
              .max(3)
              .refine((val) => !isNaN(Number(val)), {
                message: "*Insira um número válido",
              });
            break;

          case "date":
            campos[chave] = z.string().min(1, "*Data obrigatória");
            break;

          case "radio":
            campos[chave] = z
              .string({ required_error: "*Selecione uma opção" })
              .min(1, "*Selecione uma opção");
            break;
          default:
            campos[chave] = z.string().min(1, "*Campo obrigatório");
            break;
        }
      });
    });
    return z.object(campos);
  }, [perguntas]);

  const {
    register,
    handleSubmit,
    reset,
    setValue, // Ele é usado quando você quer alterar o valor de um campo sem a interação direta do usuário.
    //  Neste código, usado com checkbox e radio condicional.
    watch, // observa em tempo real o valor de um campo do formulário. Muito útil para campos condicionais,
    // como radio ou checkbox com subcampos.
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validacao),
    // mode: define quando a validação vai acontecer no formulário.
    // Ex: "onSubmit" valida apenas ao enviar. Outros modos: "onChange", "onBlur", etc.
    mode: "onSubmit",

    // defaultValues: define os valores iniciais esperados para cada campo do formulário.
    // Isso é importante para evitar erros de "undefined", especialmente com checkboxes ou radios.
    // Ex: checkbox espera array ([]), texto espera string (""), etc.
    // Usamos reduce para montar esse objeto de forma dinâmica.
    // acc = acumulador que vai guardando os valores padrão de cada pergunta
    defaultValues: perguntas.reduce((acc, secao) => {
      secao.perguntas?.forEach((p) => {
        if (!p.pergunta) return;

        if (p.tipo === "checkbox" || p.tipo === "radio_condicional_checkbox") {
          acc[p.pergunta] = [];
          if (p.tipo === "radio_condicional_checkbox") {
            acc[`${p.pergunta}_sub`] = [];
          }
        } else if (p.tipo === "radio_condicional_texto") {
          acc[p.pergunta] = {
            resposta: "",
            condicional: "",
          };
        } else if (p.tipo === "frequencia_consumo") {
          acc[p.pergunta] = {};
          p.itens?.forEach((item) => {
            acc[p.pergunta][item.alimento] = "";
          });
        } else {
          acc[p.pergunta] = "";
        }
      });
      return acc;
    }, {}),
  });

  const onSubmit = async (data) => {
    console.log("Respostas finais:", data);
    setMensagem("Formulário Enviado com Sucesso!");
    reset();
  };

  return (
    <div className="bodyAnamnese">
      <form
        noValidate
        className="formAnamnese"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="ondaAnamnese">
          <img src={ondaAnamnese} alt="Onda decorativa" />
        </div>

        <div className="conteudoAnamnese">
          <div className="tituloform">
            <h1 className="tituloAnamnese">{titulo}</h1>
          </div>

          {perguntas.map((secao, index) => (
            <div key={index}>
              {secao.titulo && (
                <h2 className="sessaoAnamnese">{secao.titulo}</h2>
              )}

              {secao.perguntas &&
                secao.perguntas.map((perguntaObj, idx) => (
                  <div key={idx}>
                    {perguntaObj.tipo === "titulo" ? (
                      <h3 className="sessaoAnamnese">{perguntaObj.texto}</h3>
                    ) : (
                      <>
                        {perguntaObj.tipo !== "radio_condicional_texto" &&
                          typeof errors[perguntaObj.pergunta]?.message ===
                            "string" && (
                            <p className="erroMensagem">
                              {errors[perguntaObj.pergunta].message}
                            </p>
                          )}

                        <div className="campoAnamnese">
                          {perguntaObj.pergunta &&
                            !perguntaObj.ocultarLabel && (
                              <label className="labelAnamnese">
                                {perguntaObj.pergunta}
                              </label>
                            )}

                          {[
                            "texto",
                            "email",
                            "telefone",
                            "number",
                            "date",
                          ].includes(perguntaObj.tipo) && (
                            <div className="inputComUnidade">
                              <input
                                className={
                                  ["texto", "email", "telefone"].includes(
                                    perguntaObj.tipo
                                  )
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
                                {...register(perguntaObj.pergunta)}
                              />
                              {perguntaObj.unidade && (
                                <span className="unidade">
                                  {perguntaObj.unidade}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* RADIO */}
                        {perguntaObj.tipo === "radio" && (
                          <div className="grupoOpcao">
                            {perguntaObj.opcoes.map((opcao, i) => (
                              <div className="linhaOpcao" key={i}>
                                <input
                                  type="radio"
                                  {...register(perguntaObj.pergunta)}
                                  value={opcao}
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
                                  onChange={() => {
                                    //verfica o que o usuario ja marcou, se nao marcou nada []
                                    const current =
                                      watch(perguntaObj.pergunta) || [];
                                    //pega o que o usario marcou e verifica se a opçao ja esta marcad, se sim= remove, se nao= adiciona
                                    const updated = current.includes(opcao)
                                      ? //v significa cada opçao do array de opçoes
                                        current.filter((v) => v !== opcao)
                                      : [...current, opcao];

                                    setValue(perguntaObj.pergunta, updated, {
                                      shouldValidate: true,
                                    }); //shoul= reforça validação
                                  }}
                                  value={opcao}
                                />

                                <label className="textoOpcao">{opcao}</label>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* RADIO CONDICIONAL COM TEXTO */}
                        {perguntaObj.tipo === "radio_condicional_texto" && (
                          <div className="grupoOpcao">
                            {errors[perguntaObj.pergunta]?.condicional
                              ?.message && (
                              <p className="erroMensagem">
                                {
                                  errors[perguntaObj.pergunta].condicional
                                    .message
                                }
                              </p>
                            )}

                            {perguntaObj.opcoes.map((opcao, i) => (
                              <div className="linhaOpcao" key={i}>
                                <input
                                  type="radio"
                                  {...register(
                                    `${perguntaObj.pergunta}.resposta`
                                  )}
                                  value={opcao}
                                />

                                <label className="textoOpcao">{opcao}</label>

                                {opcao === perguntaObj.condicao &&
                                  watch(`${perguntaObj.pergunta}.resposta`) ===
                                    opcao && (
                                    <div className="condicionalerro">
                                      <input
                                        className="condicaoAnamnese"
                                        type="text"
                                        placeholder={perguntaObj.placeholder}
                                        {...register(
                                          `${perguntaObj.pergunta}.condicional`
                                        )}
                                      />
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* RADIO COM SUB-CHECKBOX */}
                        {perguntaObj.tipo === "radio_condicional_checkbox" && (
                          <div className="grupoOpcao">
                            {perguntaObj.opcoes.map((opcao, i) => (
                              <div className="linhaOpcao" key={i}>
                                <input
                                  type="radio"
                                  value={opcao}
                                  checked={
                                    watch(perguntaObj.pergunta) === opcao
                                  }
                                  onChange={() => {
                                    setValue(perguntaObj.pergunta, opcao, {
                                      shouldValidate: true,
                                    });
                                  }}
                                />
                                <label className="textoOpcao">{opcao}</label>

                                {opcao === perguntaObj.condicao &&
                                  watch(perguntaObj.pergunta) === opcao &&
                                  perguntaObj.subpergunta &&
                                  perguntaObj.subpergunta.opcoes.map(
                                    (subOpcao, s) => (
                                      <div
                                        className="frequenciaAnamnese"
                                        key={s}
                                      >
                                        <input
                                          type="checkbox"
                                          {...register(
                                            `${perguntaObj.pergunta}_sub`
                                          )}
                                          checked={(
                                            watch(
                                              `${perguntaObj.pergunta}_sub`
                                            ) || []
                                          ).includes(subOpcao)}
                                          onChange={() => {
                                            const current =
                                              watch(
                                                `${perguntaObj.pergunta}_sub`
                                              ) || [];
                                            const updated = current.includes(
                                              subOpcao
                                            )
                                              ? current.filter(
                                                  (v) => v !== subOpcao
                                                )
                                              : [...current, subOpcao];

                                            setValue(
                                              `${perguntaObj.pergunta}_sub`,
                                              updated,
                                              {
                                                shouldValidate: true,
                                              }
                                            );
                                          }}
                                          value={subOpcao}
                                        />
                                        <label className="textoOpcao">
                                          {subOpcao}
                                        </label>

                                        {perguntaObj.subpergunta.tipo ===
                                          "checkbox_outros" &&
                                          subOpcao === "Outros" &&
                                          watch(
                                            `${perguntaObj.pergunta}_sub`
                                          )?.includes("Outros") && (
                                            <input
                                              className="condicaoAnamnese"
                                              type="text"
                                              placeholder="Especifique Outros..."
                                              {...register(
                                                `${perguntaObj.pergunta}_sub_outros`
                                              )}
                                            />
                                          )}
                                      </div>
                                    )
                                  )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* FREQUÊNCIA DE CONSUMO */}
                        {perguntaObj.tipo === "frequencia_consumo" && (
                          <div className="grupoOpcao">
                            {perguntaObj.itens?.map((item, i) => (
                              <div
                                className="linhaOpcao linhaFrequencia"
                                key={i}
                              >
                                <label className="alimentoAnamnese">
                                  {item.alimento}
                                </label>
                                {item.opcoes.map((opcao, j) => (
                                  <div className="frequenciaAnamnese" key={j}>
                                    <input
                                      type="radio"
                                      value={opcao}
                                      {...register(
                                        `${perguntaObj.pergunta}.${item.alimento}`
                                      )}
                                    />
                                    <label className="textoOpcao">
                                      {opcao}
                                    </label>
                                  </div>
                                ))}

                                {errors[perguntaObj.pergunta]?.[item.alimento]
                                  ?.message && (
                                  <p className="erroMensagem">
                                    {
                                      errors[perguntaObj.pergunta][
                                        item.alimento
                                      ].message
                                    }
                                  </p>
                                )}
                              </div>
                            ))}
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
          {mensagem && <p className="mensagemSucesso">{mensagem}</p>}
        </div>
        <div className="ondaAnamnesebaixo">
          <img src={ondabaixo} alt="Onda decorativa" />
        </div>
      </form>
    </div>
  );
}

export default FormularioAnamnese;
