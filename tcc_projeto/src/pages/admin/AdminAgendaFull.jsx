// src/pages/admin/AdminAgendaFull.jsx
import { useState, useEffect, useMemo } from "react";
import { addMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchAuth, API } from "../../services/api";
import "../../css/admin-agenda-full.css";

function toISO(d) {
  return format(d, "yyyy-MM-dd");
}
function dayKey(d) {
  return format(d, "yyyy-MM-dd");
}
function hhmm(dateObj) {
  const h = String(dateObj.getHours()).padStart(2, "0");
  const m = String(dateObj.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
function fmt(dt) {
  const d = new Date(dt);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

// range com alinhamento (segunda=0)
function buildMonthGrid(viewDate) {
  const first = startOfMonth(viewDate);
  const last = endOfMonth(viewDate);
  const cells = [];
  const js = first.getDay(); // 0=Dom..6=Sáb
  const mon0 = (js + 6) % 7; // 0=Seg..6=Dom
  for (let i = 0; i < mon0; i++) cells.push(null);
  let cur = new Date(first);
  while (cur <= last) {
    cells.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// adicione no topo (já tem imports): (se quiser usar dayjs aqui, pode importar; mas mantive sem mais libs)
function startOfLocalDayISO(dateObjOrIso) {
  // retorna "YYYY-MM-DDT00:00:00" em ISO local (string) para comparação simples
  const d = new Date(dateObjOrIso);
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}T00:00:00`;
}
function endOfLocalDayISO(dateObjOrIso) {
  const d = new Date(dateObjOrIso);
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}T23:59:59`;
}

// substitua isFullDayBlock por isso:
function isFullDayBlock(listBloqs, d) {
  if (!listBloqs || listBloqs.length === 0) return false;
  const startDayIso = startOfLocalDayISO(d);
  const endDayIso = endOfLocalDayISO(d);
  return listBloqs.some((b) => {
    if (!b || !b.inicio || !b.fim) return false;
    // compara strings ISO (novo backend retorna ISO) convertendo pra Date só quando necessário
    const bi = new Date(b.inicio);
    const bf = new Date(b.fim);
    const startDay = new Date(startDayIso);
    const endDay = new Date(endDayIso);
    return bi <= startDay && bf >= endDay;
  });
}

export default function AdminAgendaFull() {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [bloqueiosMap, setBloqueiosMap] = useState({});
  const [agendamentosRaw, setAgendamentosRaw] = useState([]);
  const [dispMap, setDispMap] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [actionMsg, setActionMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // controle do menu de 3 pontinhos (por payment_ref)
  const [openMenu, setOpenMenu] = useState(null); // string | null

  const todayKey = toISO(new Date());

  useEffect(() => {
    const de = format(startOfMonth(viewDate), "yyyy-MM-dd");
    const ate = format(endOfMonth(viewDate), "yyyy-MM-dd");

    setLoading(true);
    setActionMsg("");
    Promise.all([
      fetchAuth(`${API}/admin/agenda/slots?de=${de}&ate=${ate}`),
      fetchAuth(`${API}/admin/agenda/bloqueios?de=${de}&ate=${ate}`),
      fetchAuth(`${API}/admin/agenda/disponibilidade?de=${de}&ate=${ate}`),
    ])
      .then(async ([r1, r2, r3]) => {
        const data1 = await r1.json();
        const data2 = await r2.json();
        const data3 = await r3.json();
        setAgendamentosRaw(Array.isArray(data1) ? data1 : []);
        setBloqueiosMap(data2 || {});
        setDispMap(data3 || {});
      })
      .catch((err) => {
        console.error("Erro carregando agenda admin full:", err);
        setActionMsg("Falha ao carregar dados da agenda.");
      })
      .finally(() => setLoading(false));
  }, [viewDate]);

  const agendaByDay = useMemo(() => {
    const map = {};
    agendamentosRaw.forEach((item) => {
      const key = toISO(new Date(item.inicio));
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [agendamentosRaw]);

  const dayStatusMap = useMemo(() => {
    const result = {};
    const days = buildMonthGrid(viewDate).filter(Boolean);
    days.forEach((d) => {
      const key = dayKey(d);
      const isPast = key < todayKey;
      const bloqueiosDia = bloqueiosMap[key] || [];
      const listaAg = agendaByDay[key] || [];
      const disp = dispMap[key] || { temAlgumSlotDisponivel: false };

      const temFullBlock = isFullDayBlock(bloqueiosDia, d);
      const temConfirmada = listaAg.some(
        (a) => a.tipo === "confirmado" && a.status === "confirmada"
      );
      const temPendenteOuHold = listaAg.some(
        (a) => a.tipo !== "confirmado" || a.status === "pendente"
      );
      const temLivre =
        !temFullBlock && !!disp.temAlgumSlotDisponivel && !isPast;

      result[key] = {
        isPast,
        temFullBlock,
        temConfirmada,
        temPendenteOuHold,
        temLivre,
      };
    });
    return result;
  }, [viewDate, bloqueiosMap, agendaByDay, dispMap, todayKey]);

  const painelDiaInfo = useMemo(() => {
    if (!selectedDay) return null;
    const key = dayKey(selectedDay);
    return {
      key,
      bloqueios: bloqueiosMap[key] || [],
      ags: (agendaByDay[key] || []).sort(
        (a, b) => new Date(a.inicio) - new Date(b.inicio)
      ),
    };
  }, [selectedDay, bloqueiosMap, agendaByDay]);

  async function bloquearDiaInteiro(d) {
    if (!d) return;
    const key = dayKey(d);
    if (key < todayKey) {
      setActionMsg("Não é possível mexer em dias passados.");
      return;
    }

    try {
      const r = await fetchAuth(`${API}/admin/agenda/bloquear-dia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: key, motivo: "dia bloqueado" }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.erro || "Falha ao bloquear dia.");

      const safeRow = {
        id: data.id,
        inicio: data.inicio && String(data.inicio),
        fim: data.fim && String(data.fim),
        motivo: data.motivo || null,
      };
      setBloqueiosMap((prev) => {
        const list = prev[key] || [];
        return { ...prev, [key]: [...list, safeRow] };
      });
      setActionMsg("Dia bloqueado com sucesso.");
    } catch (err) {
      setActionMsg(err.message || "Erro ao bloquear dia.");
    }
  }

  async function desbloquearDiaInteiro(d) {
    if (!d) return;
    const key = dayKey(d);
    if (key < todayKey) {
      setActionMsg("Não é possível mexer em dias passados.");
      return;
    }

    const bloqs = bloqueiosMap[key] || [];
    const y = d.getFullYear(),
      m = d.getMonth(),
      dd = d.getDate();
    const startDay = new Date(y, m, dd, 0, 0, 0),
      endDay = new Date(y, m, dd, 23, 59, 59);
    const fullDayBloqs = bloqs.filter(
      (b) => new Date(b.inicio) <= startDay && new Date(b.fim) >= endDay
    );

    if (!fullDayBloqs.length) {
      setActionMsg("Nenhum bloqueio total para remover.");
      return;
    }

    try {
      for (const b of fullDayBloqs) {
        await fetchAuth(`${API}/admin/agenda/bloqueio/${b.id}`, {
          method: "DELETE",
        });
      }
      setBloqueiosMap((prev) => {
        const restantes = (prev[key] || []).filter(
          (b) => !fullDayBloqs.find((fb) => fb.id === b.id)
        );
        return { ...prev, [key]: restantes };
      });
      setActionMsg("Dia desbloqueado.");
    } catch {
      setActionMsg("Erro ao desbloquear dia.");
    }
  }

  const [faixaInicio, setFaixaInicio] = useState("");
  const [faixaFim, setFaixaFim] = useState("");
  const [faixaMotivo, setFaixaMotivo] = useState("");

  async function bloquearFaixa(d) {
    if (!d || !faixaInicio || !faixaFim) {
      setActionMsg("Preencha início e fim.");
      return;
    }
    const key = dayKey(d);
    if (key < todayKey) {
      setActionMsg("Não é possível mexer em dias passados.");
      return;
    }

    try {
      const r = await fetchAuth(`${API}/admin/agenda/bloquear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: key,
          horaInicio: faixaInicio,
          horaFim: faixaFim,
          motivo: faixaMotivo,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.erro || "Falha ao bloquear faixa.");

      const safeRow = {
        id: data.id,
        inicio: data.inicio && String(data.inicio),
        fim: data.fim && String(data.fim),
        motivo: data.motivo || null,
      };
      setBloqueiosMap((prev) => {
        const list = prev[key] || [];
        return { ...prev, [key]: [...list, safeRow] };
      });
      setFaixaInicio("");
      setFaixaFim("");
      setFaixaMotivo("");
      setActionMsg("Faixa bloqueada.");
    } catch (err) {
      setActionMsg(err.message || "Erro ao bloquear faixa.");
    }
  }

  function renderCell(d) {
    if (!d)
      return (
        <div
          className="admin-agenda-full__day admin-agenda-full__day--empty"
          key={Math.random()}
        />
      );

    const key = dayKey(d);
    const st = dayStatusMap[key] || {};
    let bgClass = "admin-agenda-full__day--empty";
    if (st.isPast) bgClass = "admin-agenda-full__day--past";
    else if (st.temFullBlock) bgClass = "admin-agenda-full__day--blocked";
    else if (st.temPendenteOuHold) bgClass = "admin-agenda-full__day--pending";
    else if (st.temConfirmada) bgClass = "admin-agenda-full__day--confirmed";
    else if (st.temLivre) bgClass = "admin-agenda-full__day--free";

    return (
      <button
        key={key}
        type="button"
        className={`admin-agenda-full__day ${bgClass}`}
        onClick={() => {
          if (key >= todayKey) {
            setSelectedDay(d);
            setActionMsg("");
          }
        }}
        disabled={key < todayKey}
        title={key < todayKey ? "Dia passado" : ""}
      >
        <div className="admin-agenda-full__day-num">
          {format(d, "d", { locale: ptBR })}
        </div>
        <div className="admin-agenda-full__badges">
          {st.isPast && (
            <span className="admin-agenda-full__badge admin-agenda-full__badge--past">
              PASSADO
            </span>
          )}
          {st.temFullBlock && (
            <span className="admin-agenda-full__badge admin-agenda-full__badge--blocked">
              BLOQ
            </span>
          )}
          {st.temPendenteOuHold && (
            <span className="admin-agenda-full__badge admin-agenda-full__badge--pending">
              PEND
            </span>
          )}
          {st.temConfirmada && (
            <span className="admin-agenda-full__badge admin-agenda-full__badge--confirmed">
              CONF
            </span>
          )}
          {!st.temFullBlock && st.temLivre && (
            <span className="admin-agenda-full__badge admin-agenda-full__badge--free">
              LIVRE
            </span>
          )}
        </div>
      </button>
    );
  }

  const cells = buildMonthGrid(viewDate);
  const tituloMes = format(viewDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="admin-agenda-full__wrapper">
      <div className="admin-agenda-full__topbar">
        <div className="admin-agenda-full__month-nav">
          <button
            type="button"
            className="admin-agenda-full__nav-btn"
            onClick={() => setViewDate(addMonths(viewDate, -1))}
          >
            ‹
          </button>
          <div className="admin-agenda-full__month-title">{tituloMes}</div>
          <button
            type="button"
            className="admin-agenda-full__nav-btn"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
          >
            ›
          </button>
        </div>
        {loading ? (
          <div className="admin-agenda-full__status-loading">
            Carregando agenda…
          </div>
        ) : (
          actionMsg && (
            <div className="admin-agenda-full__status-msg">{actionMsg}</div>
          )
        )}
      </div>

      <div className="admin-agenda-full__layout">
        <div className="admin-agenda-full__calendar-card">
          <div className="admin-agenda-full__weekday-row">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((wd) => (
              <div key={wd} className="admin-agenda-full__weekday-cell">
                {wd}
              </div>
            ))}
          </div>

          <div className="admin-agenda-full__days-grid">
            {cells.map(renderCell)}
          </div>

          <div className="admin-agenda-full__legend">
            <div className="admin-agenda-full__legend-item">
              <span className="admin-agenda-full__legend-dot admin-agenda-full__legend-dot--blocked" />{" "}
              Dia bloqueado
            </div>
            <div className="admin-agenda-full__legend-item">
              <span className="admin-agenda-full__legend-dot admin-agenda-full__legend-dot--pending" />{" "}
              Pendente / aguardando pagamento
            </div>
            <div className="admin-agenda-full__legend-item">
              <span className="admin-agenda-full__legend-dot admin-agenda-full__legend-dot--confirmed" />{" "}
              Consulta confirmada
            </div>
            <div className="admin-agenda-full__legend-item">
              <span className="admin-agenda-full__legend-dot admin-agenda-full__legend-dot--free" />{" "}
              Disponível
            </div>
          </div>
        </div>

        <div className="admin-agenda-full__details-card">
          {selectedDay ? (
            <>
              <div className="admin-agenda-full__details-header">
                <div className="admin-agenda-full__details-date">
                  {format(selectedDay, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="admin-agenda-full__details-actions">
                  <button
                    type="button"
                    className="admin-agenda-full__primary-btn"
                    onClick={() => bloquearDiaInteiro(selectedDay)}
                  >
                    Bloquear Dia
                  </button>
                  <button
                    type="button"
                    className="admin-agenda-full__danger-btn"
                    onClick={() => desbloquearDiaInteiro(selectedDay)}
                  >
                    Desbloquear Dia
                  </button>
                </div>

                <div className="admin-agenda-full__faixa-form">
                  <div className="admin-agenda-full__field-group">
                    <label className="admin-agenda-full__label">Início</label>
                    <input
                      className="admin-agenda-full__input"
                      type="time"
                      value={faixaInicio}
                      onChange={(e) => setFaixaInicio(e.target.value)}
                    />
                  </div>
                  <div className="admin-agenda-full__field-group">
                    <label className="admin-agenda-full__label">Fim</label>
                    <input
                      className="admin-agenda-full__input"
                      type="time"
                      value={faixaFim}
                      onChange={(e) => setFaixaFim(e.target.value)}
                    />
                  </div>
                  <div className="admin-agenda-full__field-group admin-agenda-full__field-group--full">
                    <label className="admin-agenda-full__label">
                      Motivo (opcional)
                    </label>
                    <input
                      className="admin-agenda-full__input"
                      type="text"
                      placeholder="ex: Exame médico, Reunião, Viagem..."
                      value={faixaMotivo}
                      onChange={(e) => setFaixaMotivo(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="admin-agenda-full__primary-btn"
                    onClick={() => bloquearFaixa(selectedDay)}
                  >
                    Bloquear Faixa
                  </button>
                </div>
              </div>

              <div className="admin-agenda-full__details-section">
                <h4 className="admin-agenda-full__details-subtitle">
                  Agendamentos
                </h4>
                {painelDiaInfo.ags.length === 0 ? (
                  <p className="admin-agenda-full__muted">
                    Nenhum agendamento.
                  </p>
                ) : (
                  <ul className="admin-agenda-full__list">
                    {painelDiaInfo.ags.map((a, idx) => (
                      <li key={idx} className="admin-agenda-full__list-item">
                        <div className="admin-agenda-full__list-hora">
                          {hhmm(new Date(a.inicio))} - {hhmm(new Date(a.fim))}
                        </div>
                        <div className="admin-agenda-full__list-nome">
                          {a.paciente
                            ? `${a.paciente.nome || ""} ${
                                a.paciente.sobrenome || ""
                              }`
                            : "—"}
                        </div>
                        <div className="admin-agenda-full__list-status">
                          {a.tipo === "hold"
                            ? "Pendente Pag."
                            : a.status || a.tipo}
                        </div>

                        {/* menu (apenas para pendentes/hold) */}
                        {a.tipo !== "confirmado" && (
                          <div
                            style={{ justifySelf: "end", position: "relative" }}
                          >
                            <button
                              type="button"
                              className="admin-agenda-full__primary-btn"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === a.payment_ref
                                    ? null
                                    : a.payment_ref
                                )
                              }
                              title="Mais ações"
                            >
                              ⋯
                            </button>

                            {openMenu === a.payment_ref && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "110%",
                                  background: "#fff",
                                  border: "1px solid #ccc",
                                  borderRadius: 8,
                                  padding: 10,
                                  zIndex: 10,
                                  minWidth: 260,
                                }}
                              >
                                <div
                                  style={{ fontWeight: 700, marginBottom: 6 }}
                                >
                                  Reserva temporária
                                </div>
                                <div
                                  style={{
                                    fontSize: ".85rem",
                                    marginBottom: 4,
                                  }}
                                >
                                  <b>Paciente:</b>{" "}
                                  {a.paciente
                                    ? `${a.paciente.nome || ""} ${
                                        a.paciente.sobrenome || ""
                                      }`
                                    : "—"}
                                </div>
                                <div
                                  style={{
                                    fontSize: ".85rem",
                                    marginBottom: 4,
                                  }}
                                >
                                  <b>E-mail:</b> {a.paciente?.email || "—"}
                                </div>
                                <div
                                  style={{
                                    fontSize: ".85rem",
                                    marginBottom: 4,
                                  }}
                                >
                                  <b>Reservado em:</b>{" "}
                                  {a.reserved_at ? fmt(a.reserved_at) : "—"}
                                </div>
                                <div
                                  style={{
                                    fontSize: ".85rem",
                                    marginBottom: 4,
                                  }}
                                >
                                  <b>Janela:</b> {hhmm(new Date(a.inicio))} -{" "}
                                  {hhmm(new Date(a.fim))}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 8,
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="admin-agenda-full__danger-btn"
                                    onClick={async () => {
                                      try {
                                        await fetchAuth(
                                          `${API}/admin/agenda/hold/${a.payment_ref}`,
                                          { method: "DELETE" }
                                        );
                                        // remove da lista geral e do painel do dia
                                        setAgendamentosRaw((prev) =>
                                          prev.filter(
                                            (x) =>
                                              x.payment_ref !== a.payment_ref
                                          )
                                        );
                                        setOpenMenu(null);
                                        setActionMsg(
                                          "Reserva temporária liberada."
                                        );
                                      } catch {
                                        setActionMsg(
                                          "Erro ao liberar reserva."
                                        );
                                      }
                                    }}
                                  >
                                    Liberar
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-agenda-full__primary-btn"
                                    onClick={() => setOpenMenu(null)}
                                  >
                                    Fechar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="admin-agenda-full__details-section">
                <h4 className="admin-agenda-full__details-subtitle">
                  Bloqueios neste dia
                </h4>
                {(painelDiaInfo.bloqueios || []).length === 0 ? (
                  <p className="admin-agenda-full__muted">
                    Nenhum bloqueio parcial ou total.
                  </p>
                ) : (
                  <ul className="admin-agenda-full__list">
                    {painelDiaInfo.bloqueios.map((b) => (
                      <li key={b.id} className="admin-agenda-full__list-item">
                        <div className="admin-agenda-full__list-hora">
                          {hhmm(new Date(b.inicio))} - {hhmm(new Date(b.fim))}
                        </div>
                        <div className="admin-agenda-full__list-nome">
                          {b.motivo || "bloqueado"}
                        </div>
                        <button
                          type="button"
                          className="admin-agenda-full__danger-btn admin-agenda-full__danger-btn--small"
                          onClick={async () => {
                            setActionMsg("");
                            try {
                              await fetchAuth(
                                `${API}/admin/agenda/bloqueio/${b.id}`,
                                { method: "DELETE" }
                              );
                              setBloqueiosMap((prev) => {
                                const lista = prev[painelDiaInfo.key] || [];
                                return {
                                  ...prev,
                                  [painelDiaInfo.key]: lista.filter(
                                    (x) => x.id !== b.id
                                  ),
                                };
                              });
                              setActionMsg("Bloqueio removido.");
                            } catch {
                              setActionMsg("Erro ao remover bloqueio.");
                            }
                          }}
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="admin-agenda-full__muted">
              Selecione um dia no calendário.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
