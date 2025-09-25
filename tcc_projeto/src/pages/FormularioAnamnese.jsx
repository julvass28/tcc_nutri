import React, { useState, useMemo, useEffect } from "react"; // [NOVO] adicionei useEffect
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
import { useNavigate } from "react-router-dom";
import { fetchAuth, API } from "../services/api";

function FormularioAnamnese({ modalidadeSelecionada }) {
  // helpers para normalizar a especialidade
  const semAcento = (s = "") =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const mapEspecialidadeParaModalidade = (esp = "") => {
    const s = semAcento(esp);
    if (s.includes("pediatr")) return "pediatrica";
    if (s.includes("esport")) return "esportiva";
    if (s.includes("intoler")) return "intolerancias";
    if (s.includes("emagrec")) return "emagrecimento";
    return "clinica";
  };

  const rawEsp =
    modalidadeSelecionada ??
    sessionStorage.getItem("booking.especialidade") ??
    "Nutrição Clínica";

  const modalidade = mapEspecialidadeParaModalidade(rawEsp);

  const titulo =
    "Anamnese " +
    (rawEsp?.charAt
      ? rawEsp.charAt(0).toUpperCase() + rawEsp.slice(1)
      : "Clínica");

  const [enviar, setEnviar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagemInfo, setMensagemInfo] = useState(""); // [NOVO]
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [goingToPay, setGoingToPay] = useState(false);

  let perguntas = [];
  if (modalidade === "pediatrica") {
    perguntas = perguntasEspecificas.pediatrica;
  } else if (perguntasEspecificas[modalidade]) {
    perguntas = perguntasComum.concat(perguntasEspecificas[modalidade]);
  } else {
    perguntas = perguntasComum;
  }

  const validacao = useMemo(() => {
    const campos = {};
    perguntas.forEach((secao) => {
      secao.perguntas?.forEach((perguntaObj) => {
        const chave = perguntaObj.pergunta;
        if (!chave) return;
        switch (perguntaObj.tipo) {
          case "checkbox":
          case "radio_condicional_checkbox":
            campos[chave] = z
              .array(z.string(), { required_error: "*Selecione pelo menos uma opção" })
              .min(1, "*Selecione pelo menos uma opção");
            break;
          case "radio_condicional_texto":
            campos[chave] = z
              .object({
                resposta: z.string({ required_error: "*Selecione uma opção" }).min(1, "*Selecione uma opção"),
                condicional: z.string().optional(),
              })
              .refine(
                (val) => {
                  if (val.resposta === perguntaObj.condicao) {
                    return val.condicional && val.condicional.trim().length > 0;
                  }
                  return true;
                },
                { message: "*Campo obrigatório quando selecionado", path: ["condicional"] }
              );
            break;
          default:
            campos[chave] = z.string().optional();
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
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validacao),
    mode: "onSubmit",
    defaultValues: perguntas.reduce((acc, secao) => {
      secao.perguntas?.forEach((p) => {
        if (!p.pergunta) return;
        if (p.tipo === "checkbox" || p.tipo === "radio_condicional_checkbox") {
          acc[p.pergunta] = [];
        } else if (p.tipo === "radio_condicional_texto") {
          acc[p.pergunta] = { resposta: "", condicional: "" };
        } else {
          acc[p.pergunta] = "";
        }
      });
      return acc;
    }, {}),
  });

  // [NOVO] Restaurar dados salvos no sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("anamnese.temp");
    if (saved) {
      reset(JSON.parse(saved));
      setMensagemInfo("Seus dados anteriores foram restaurados.");
    }
  }, [reset]);

  // dados do agendamento
  const holdId = sessionStorage.getItem("booking.hold_id");
  const paymentRef = sessionStorage.getItem("booking.payment_ref");
  const bookingDate = sessionStorage.getItem("booking.date");
  const bookingTime = sessionStorage.getItem("booking.time");

  if (!holdId || !paymentRef) {
    navigate("/agendar", { replace: true });
  }

  const onSubmit = async (data) => {
    try {
      setMensagem("");
      setSending(true);

      const payload = {
        booking_hold_id: Number(holdId),
        payment_ref: String(paymentRef),
        data: String(bookingDate || ""),
        hora: String(bookingTime || ""),
        modalidade: String(modalidade),
        respostas: data,
      };

      const r = await fetchAuth(`${API}/pacientes/anamnese`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error("Falha ao salvar anamnese.");

      setMensagem("Formulário enviado com sucesso!");
      setSending(false);
      setGoingToPay(true);

      setTimeout(() => {
        navigate("/pagamento");
      }, 1200);
    } catch (err) {
      setSending(false);
      setGoingToPay(false);
      setMensagem(err?.message || "Erro ao enviar anamnese.");
    }
  };

  // [NOVO] Função Voltar
  function handleBack() {
    const currentData = watch();
    sessionStorage.setItem("anamnese.temp", JSON.stringify(currentData));
    setMensagemInfo("Você voltou para a etapa anterior, seus dados foram mantidos.");
    navigate(-1); // volta pra agenda
  }

  return (
    <div className="bodyAnamnese">
      <div className="anamnese-topbar">
        <button
          type="button"
          className="anamnese-btn-voltar"
          onClick={handleBack}
        >
          ← Voltar
        </button>
        <div className="anamnese-resumo">
          <span>
            Consulta em <b>{bookingDate || "—"}</b> às <b>{bookingTime || "—"}</b>
            {rawEsp ? <> • <b>{rawEsp}</b></> : null}
          </span>
        </div>
      </div>

      {mensagemInfo && <p className="mensagemInfo">{mensagemInfo}</p>} {/* [NOVO] */}
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
        {/* Overlay de envio */}
        {sending && (
          <div className="anamnese-overlay">
            <div className="anamnese-overlay__box">
              <div className="anamnese-spinner" />
              <p>Enviando anamnese…</p>
            </div>
          </div>
        )}

        {/* Overlay indo para pagamento */}
        {goingToPay && (
          <div className="anamnese-overlay">
            <div className="anamnese-overlay__box">
              <div className="anamnese-spinner" />
              <p>Prosseguindo para pagamento…</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default FormularioAnamnese;
