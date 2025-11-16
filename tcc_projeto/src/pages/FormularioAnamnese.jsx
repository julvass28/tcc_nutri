// tcc_projeto/src/pages/FormularioAnamnese.jsx
import React, { useState, useMemo, useEffect } from "react";
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
  // 🔁 helpers p/ normalizar especialidade
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
    return "clinica";
  };

  // 🔁 helpers p/ normalizar opções
  const getOptionValue = (op) => {
    if (typeof op === "string") return op;
    if (op && typeof op === "object") {
      return op.value ?? op.label ?? "";
    }
    return "";
  };

  const getOptionLabel = (op) => {
    if (typeof op === "string") return op;
    if (op && typeof op === "object") {
      return op.label ?? op.value ?? "";
    }
    return "";
  };

  const rawEsp =
    modalidadeSelecionada ??
    sessionStorage.getItem("booking.especialidade") ?? // label bonito, se existir
    sessionStorage.getItem("booking.especialidade_slug") ?? // slug, se não tiver label
    "Nutrição Clínica";

  const modalidade = mapEspecialidadeParaModalidade(rawEsp);

  const titulo =
    "Anamnese " +
    (rawEsp?.charAt
      ? rawEsp.charAt(0).toUpperCase() + rawEsp.slice(1)
      : "Clínica");

  const [enviar, setEnviar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagemInfo, setMensagemInfo] = useState("");
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [goingToPay, setGoingToPay] = useState(false);

  // montar perguntas
  let perguntas = [];
  if (modalidade === "pediatrica") {
    perguntas = perguntasEspecificas.pediatrica;
  } else if (perguntasEspecificas[modalidade]) {
    perguntas = perguntasComum.concat(perguntasEspecificas[modalidade]);
  } else {
    perguntas = perguntasComum;
  }

  // ------------------ VALIDAÇÃO ------------------
  const validacao = useMemo(() => {
    const campos = {};
    // guardo aqui pra validar depois no superRefine do objeto inteiro
    const radioCondCheckboxMetas = [];

    perguntas.forEach((secao) => {
      secao.perguntas?.forEach((perguntaObj) => {
        const chave = perguntaObj.pergunta;
        if (!chave) return;

        const ehOpcional =
          perguntaObj.obrigatorio === false || perguntaObj.opcional === true;

        switch (perguntaObj.tipo) {
          // ✅ CHECKBOX
          case "checkbox": {
            if (ehOpcional) {
              campos[chave] = z.array(z.string()).optional().default([]);
            } else {
              campos[chave] = z
                .array(z.string(), {
                  required_error: "*Selecione pelo menos uma opção",
                })
                .min(1, "*Selecione pelo menos uma opção");
            }
            break;
          }

          // ✅ RADIO COM SUB-CHECKBOX
          case "radio_condicional_checkbox": {
            campos[chave] = z
              .string({
                required_error: "*Selecione uma opção",
              })
              .min(1, "*Selecione uma opção");

            if (perguntaObj.subpergunta && perguntaObj.condicao) {
              const subKey = `${chave}_sub`;
              campos[subKey] = z.array(z.string()).optional();

              radioCondCheckboxMetas.push({
                chave,
                subKey,
                condValue: getOptionValue(perguntaObj.condicao),
              });
            }
            break;
          }

          // ✅ RADIO QUE ABRE TEXTO
          case "radio_condicional_texto": {
            const objSchema = z
              .object({
                resposta: z
                  .string({ required_error: "*Selecione uma opção" })
                  .min(1, "*Selecione uma opção"),
                condicional: z.string().optional(),
              })
              .refine(
                (val) => {
                  const cond = getOptionValue(perguntaObj.condicao);
                  if (val.resposta === cond) {
                    return (val.condicional || "").trim().length > 0;
                  }
                  return true;
                },
                {
                  message: "*Campo obrigatório quando selecionado",
                  path: ["condicional"],
                }
              );

            // aceita também string (sessionStorage velho / RHF)
            const union = z.union([objSchema, z.string()]);
            campos[chave] = ehOpcional ? union.optional() : union;
            break;
          }

          // ✅ FREQUÊNCIA DE CONSUMO
          case "frequencia_consumo": {
            const innerShape = {};
            (perguntaObj.itens || []).forEach((item) => {
              if (!item.alimento) return;
              innerShape[item.alimento] = z
                .string({ required_error: "*Selecione uma opção" })
                .min(1, "*Selecione uma opção");
            });

            let schema = z.object(innerShape);
            if (ehOpcional) {
              schema = schema.partial();
            }

            campos[chave] = schema;
            break;
          }

          // ✅ DEFAULT (texto, number, date...)
          default:
            campos[chave] = z.string().optional();
            break;
        }
      });
    });

    const baseSchema = z.object(campos);

    // validações que dependem de mais de um campo (ex.: radio + sub-checkbox)
    return baseSchema.superRefine((values, ctx) => {
      radioCondCheckboxMetas.forEach(({ chave, subKey, condValue }) => {
        const principal = values[chave];
        const sub = values[subKey];

        if (principal === condValue) {
          if (!sub || !Array.isArray(sub) || sub.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "*Selecione pelo menos uma opção",
              path: [subKey],
            });
          }
        }
      });
    });
  }, [perguntas]);

  // ------------------ FORM ------------------
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

        if (p.tipo === "checkbox") {
          acc[p.pergunta] = [];
        } else if (p.tipo === "radio_condicional_checkbox") {
          acc[p.pergunta] = "";
          // campos das opções extras
          if (p.subpergunta && p.condicao) {
            acc[`${p.pergunta}_sub`] = [];
            acc[`${p.pergunta}_sub_outros`] = "";
          }
        } else if (p.tipo === "radio_condicional_texto") {
          acc[p.pergunta] = { resposta: "", condicional: "" };
        } else if (p.tipo === "frequencia_consumo") {
          acc[p.pergunta] = {};
        } else {
          acc[p.pergunta] = "";
        }
      });
      return acc;
    }, {}),
  });

  // restaurar do sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("anamnese.temp");
    if (saved) {
      reset(JSON.parse(saved));
      setMensagemInfo("Seus dados anteriores foram restaurados.");
    }
  }, [reset]);

  // pré-preencher com /me
  useEffect(() => {
    (async () => {
      try {
        const r = await fetchAuth(`${API}/me`);
        if (!r.ok) return;
        const u = await r.json();

        const nomePossiveis = ["Nome", "Nome completo", "Seu nome", "Paciente"];
        const emailPossiveis = ["E-mail", "Email", "Seu e-mail"];
        const alturaPossiveis = ["Altura", "Altura (m)", "Altura em metros"];
        const pesoPossiveis = ["Peso", "Peso (kg)", "Peso atual"];
        const idadePossiveis = ["Idade", "Sua idade"];

        const calcIdade = (data_nascimento) => {
          if (!data_nascimento) return "";
          const d = new Date(data_nascimento);
          if (Number.isNaN(d.getTime())) return "";
          const hoje = new Date();
          let idade = hoje.getFullYear() - d.getFullYear();
          const m = hoje.getMonth() - d.getMonth();
          if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) {
            idade--;
          }
          return String(idade);
        };

        perguntas.forEach((secao) => {
          secao.perguntas?.forEach((p) => {
            if (!p.pergunta) return;
            const label = p.pergunta.trim();

            if (nomePossiveis.includes(label) && u.nome) {
              const nomeCompleto = u.sobrenome
                ? `${u.nome} ${u.sobrenome}`
                : u.nome;
              setValue(label, nomeCompleto, { shouldValidate: true });
            }

            if (emailPossiveis.includes(label) && u.email) {
              setValue(label, u.email, { shouldValidate: true });
            }

            if (alturaPossiveis.includes(label) && u.altura) {
              setValue(label, String(u.altura), { shouldValidate: true });
            }

            if (pesoPossiveis.includes(label) && u.peso) {
              setValue(label, String(u.peso), { shouldValidate: true });
            }

            if (idadePossiveis.includes(label)) {
              const idade = calcIdade(u.data_nascimento);
              if (idade) {
                setValue(label, idade, { shouldValidate: true });
              }
            }
          });
        });
      } catch {
        // ignora
      }
    })();
  }, [perguntas, setValue]);

  // dados do agendamento
  const holdId = sessionStorage.getItem("booking.hold_id");
  const paymentRef = sessionStorage.getItem("booking.payment_ref");
  const bookingDate = sessionStorage.getItem("booking.date");
  const bookingTime = sessionStorage.getItem("booking.time");

  let bookingLast = null;
  try {
    bookingLast = JSON.parse(sessionStorage.getItem("booking.last"));
  } catch {
    bookingLast = null;
  }

  const finalPaymentRef = paymentRef || bookingLast?.payment_ref || "";
  const finalDate = bookingDate || bookingLast?.date || "";
  const finalTime = bookingTime || bookingLast?.time || "";

  if (!holdId && !finalPaymentRef) {
    navigate("/perfil", { replace: true });
  }

  // ------------------ SUBMIT ------------------
  const onSubmit = async (data) => {
    try {
      setMensagem("");
      setSending(true);

      // 🔁 NORMALIZAR radio_condicional_texto -> string
      const respostasNormalizadas = {};
      for (const [campo, valor] of Object.entries(data)) {
        if (
          valor &&
          typeof valor === "object" &&
          Object.prototype.hasOwnProperty.call(valor, "resposta")
        ) {
          const base = valor.resposta || "";
          const extra =
            valor.condicional && valor.condicional.trim().length > 0
              ? `: ${valor.condicional.trim()}`
              : "";
          respostasNormalizadas[campo] = base + extra;
        } else {
          respostasNormalizadas[campo] = valor;
        }
      }

      const payload = {
        booking_hold_id: holdId ? Number(holdId) : null,
        payment_ref: String(finalPaymentRef || ""),
        data: String(finalDate || ""),
        hora: String(finalTime || ""),
        modalidade: String(modalidade),
        respostas: respostasNormalizadas,
      };

      const r = await fetchAuth(`${API}/pacientes/anamnese`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error("Falha ao salvar anamnese.");

      setMensagem("Formulário enviado com sucesso!");
      setSending(false);
      setGoingToPay(false);

      // marcar localmente
      try {
        const lastRaw = sessionStorage.getItem("booking.last");
        if (lastRaw) {
          const lastObj = JSON.parse(lastRaw);
          lastObj.anamneseRespondida = true;
          sessionStorage.setItem("booking.last", JSON.stringify(lastObj));
        }

        const listRaw = sessionStorage.getItem("booking.list");
        if (listRaw) {
          const list = JSON.parse(listRaw);
          const updated = list.map((item) => {
            if (item.payment_ref === (finalPaymentRef || paymentRef)) {
              return { ...item, anamneseRespondida: true };
            }
            return item;
          });
          sessionStorage.setItem("booking.list", JSON.stringify(updated));
        }

        sessionStorage.removeItem("anamnese.pendente");
      } catch {
        // ignora
      }

      setTimeout(() => {
        navigate("/perfil");
      }, 900);
    } catch (err) {
      setSending(false);
      setGoingToPay(false);
      setMensagem(err?.message || "Erro ao enviar anamnese.");
    }
  };

  // voltar
  function handleBack() {
    const currentData = watch();
    sessionStorage.setItem("anamnese.temp", JSON.stringify(currentData));
    setMensagemInfo(
      "Você voltou para a etapa anterior, seus dados foram mantidos."
    );
    navigate(-1);
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
            Consulta em <b>{finalDate || "—"}</b> às <b>{finalTime || "—"}</b>
            {rawEsp ? (
              <>
                {" "}
                • <b>{rawEsp}</b>
              </>
            ) : null}
          </span>
        </div>
      </div>

      {mensagemInfo && <p className="mensagemInfo">{mensagemInfo}</p>}
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
                            {perguntaObj.opcoes.map((opcao, i) => {
                              const val = getOptionValue(opcao);
                              const label = getOptionLabel(opcao);
                              return (
                                <div className="linhaOpcao" key={i}>
                                  <input
                                    type="radio"
                                    {...register(perguntaObj.pergunta)}
                                    value={val}
                                  />
                                  <label className="textoOpcao">{label}</label>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* CHECKBOX */}
                        {perguntaObj.tipo === "checkbox" && (
                          <div className="grupoOpcao">
                            {perguntaObj.opcoes.map((opcao, i) => {
                              const val = getOptionValue(opcao);
                              const label = getOptionLabel(opcao);
                              return (
                                <div className="linhaOpcao" key={i}>
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      const current =
                                        watch(perguntaObj.pergunta) || [];
                                      const updated = current.includes(val)
                                        ? current.filter((v) => v !== val)
                                        : [...current, val];

                                      setValue(perguntaObj.pergunta, updated, {
                                        shouldValidate: true,
                                      });
                                    }}
                                    value={val}
                                  />
                                  <label className="textoOpcao">{label}</label>
                                </div>
                              );
                            })}
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

                            {perguntaObj.opcoes.map((opcao, i) => {
                              const val = getOptionValue(opcao);
                              const label = getOptionLabel(opcao);
                              const selected = watch(
                                `${perguntaObj.pergunta}.resposta`
                              );
                              const isCond =
                                val === getOptionValue(perguntaObj.condicao);
                              return (
                                <div className="linhaOpcao" key={i}>
                                  <input
                                    type="radio"
                                    {...register(
                                      `${perguntaObj.pergunta}.resposta`
                                    )}
                                    value={val}
                                  />

                                  <label className="textoOpcao">{label}</label>

                                  {isCond && selected === val && (
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
                              );
                            })}
                          </div>
                        )}

                        {/* RADIO COM SUB-CHECKBOX */}
                        {perguntaObj.tipo === "radio_condicional_checkbox" && (
                          <div className="grupoOpcao">
                            {errors[`${perguntaObj.pergunta}_sub`]?.message && (
                              <p className="erroMensagem">
                                {errors[`${perguntaObj.pergunta}_sub`].message}
                              </p>
                            )}

                            {perguntaObj.opcoes.map((opcao, i) => {
                              const val = getOptionValue(opcao);
                              const label = getOptionLabel(opcao);
                              const condVal = getOptionValue(
                                perguntaObj.condicao
                              );
                              return (
                                <div className="linhaOpcao" key={i}>
                                  <input
                                    type="radio"
                                    value={val}
                                    checked={
                                      watch(perguntaObj.pergunta) === val
                                    }
                                    onChange={() => {
                                      setValue(perguntaObj.pergunta, val, {
                                        shouldValidate: true,
                                      });
                                    }}
                                  />
                                  <label className="textoOpcao">{label}</label>

                                  {val === condVal &&
                                    watch(perguntaObj.pergunta) === val &&
                                    perguntaObj.subpergunta &&
                                    perguntaObj.subpergunta.opcoes.map(
                                      (subOpcao, s) => {
                                        const subVal = getOptionValue(subOpcao);
                                        const subLabel =
                                          getOptionLabel(subOpcao);
                                        const currentSubs =
                                          watch(
                                            `${perguntaObj.pergunta}_sub`
                                          ) || [];
                                        const checked =
                                          currentSubs.includes(subVal);

                                        return (
                                          <div
                                            className="frequenciaAnamnese"
                                            key={s}
                                          >
                                            <input
                                              type="checkbox"
                                              {...register(
                                                `${perguntaObj.pergunta}_sub`
                                              )}
                                              checked={checked}
                                              onChange={() => {
                                                const updated = checked
                                                  ? currentSubs.filter(
                                                      (v) => v !== subVal
                                                    )
                                                  : [...currentSubs, subVal];

                                                setValue(
                                                  `${perguntaObj.pergunta}_sub`,
                                                  updated,
                                                  {
                                                    shouldValidate: true,
                                                  }
                                                );
                                              }}
                                              value={subVal}
                                            />
                                            <label className="textoOpcao">
                                              {subLabel}
                                            </label>

                                            {perguntaObj.subpergunta.tipo ===
                                              "checkbox_outros" &&
                                              subVal === "Outros" &&
                                              (
                                                watch(
                                                  `${perguntaObj.pergunta}_sub`
                                                ) || []
                                              ).includes("Outros") && (
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
                                        );
                                      }
                                    )}
                                </div>
                              );
                            })}
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
                                {item.opcoes.map((opcao, j) => {
                                  const val = getOptionValue(opcao);
                                  const label = getOptionLabel(opcao);
                                  return (
                                    <div className="frequenciaAnamnese" key={j}>
                                      <input
                                        type="radio"
                                        value={val}
                                        {...register(
                                          `${perguntaObj.pergunta}.${item.alimento}`
                                        )}
                                      />
                                      <label className="textoOpcao">
                                        {label}
                                      </label>
                                    </div>
                                  );
                                })}

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

        {sending && (
          <div className="anamnese-overlay">
            <div className="anamnese-overlay__box">
              <div className="anamnese-spinner" />
              <p>Enviando anamnese…</p>
            </div>
          </div>
        )}

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
