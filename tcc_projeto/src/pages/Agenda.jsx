// src/pages/Agenda.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../components/titulo/titulo";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import "../css/Agendar.css";
import { fetchAuth } from "../services/api";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";

function toISODate(d) {
  return format(d, "yyyy-MM-dd");
}
function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}
function formatDateLongPT(d) {
  return format(d, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
function formatDateShortPT(d) {
  return format(d, "dd/MM/yyyy", { locale: ptBR });
}

const ESPECIALIDADES = [
  "Nutrição Clínica",
  "Nutrição Esportiva",
  "Nutrição Pediátrica",
  "Emagrecimento",
  "Intolerâncias Alimentares",
];

export default function Agendar() {
  const navigate = useNavigate();

  const [especialidade, setEspecialidade] = useState(
    localStorage.getItem("especialidade") || ESPECIALIDADES[0]
  );

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");

  const [mapDisponibilidade, setMapDisponibilidade] = useState({});
  const [loadingMes, setLoadingMes] = useState(false);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedTime, setSelectedTime] = useState(null);

  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const modifiers = useMemo(() => ({
    available: (day) => mapDisponibilidade[toISODate(day)] === true,
    unavailable: (day) => mapDisponibilidade[toISODate(day)] === false,
  }), [mapDisponibilidade]);

  const modifiersStyles = useMemo(() => ({
    available:   { backgroundColor: "#9FA28D", color: "#000" },
    unavailable: { backgroundColor: "#cfcfcf", color: "#000" },
    disabled:    { backgroundColor: "#cfcfcf", color: "#000", opacity: 1, cursor: "not-allowed" },
    selected:    { backgroundColor: "#d8b2ad", color: "#000" },
  }), []);

  useEffect(() => {
    localStorage.setItem("especialidade", especialidade);
  }, [especialidade]);

  useEffect(() => {
    if (!selected) {
      setDate("");
      setSlots([]);
      setSelectedTime(null);
      return;
    }
    setDate(toISODate(selected));
    setSelectedTime(null);
  }, [selected]);

  // pinta disponibilidade do mês (fazendo 1 req por dia — suficiente pro demo)
  useEffect(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const total = daysInMonth(y, m);
    setLoadingMes(true);

    (async () => {
      try {
        const entries = await Promise.all(
          Array.from({ length: total }, (_, i) => {
            const d = new Date(y, m, i + 1);
            const iso = toISODate(d);
            return fetch(`${API}/agenda/slots?date=${iso}`)
              .then((r) => r.json())
              .then((data) => {
                const tem = (data?.slots || []).some((s) => s.available);
                return [iso, tem];
              })
              .catch(() => [iso, false]);
          })
        );
        setMapDisponibilidade(Object.fromEntries(entries));
      } finally {
        setLoadingMes(false);
      }
    })();
  }, [month]);

  // busca slots do dia
  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    (async () => {
      try {
        const r = await fetch(`${API}/agenda/slots?date=${date}`);
        const data = await r.json();
        setSlots(data.slots ?? []);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [date]);

  // CONFIRMAR: cria hold no backend e vai pro próximo passo
  async function handleConfirmar() {
    if (!date || !selectedTime || confirming) return;
    setErrorMsg("");
    setConfirming(true);
    try {
      const r = await fetchAuth(`${API}/agenda/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: selectedTime }),
      });
      const data = await r.json();

      if (!r.ok) {
        if (r.status === 400) throw new Error(data?.erro || "Dados inválidos.");
        if (r.status === 404) throw new Error(data?.erro || "Horário não encontrado.");
        if (r.status === 409) throw new Error(data?.erro || "Horário indisponível no momento.");
        throw new Error(data?.erro || "Falha ao reservar horário.");
      }

      const { hold_id, payment_ref, expires_at } = data;
      sessionStorage.setItem("booking.hold_id", String(hold_id));
      sessionStorage.setItem("booking.payment_ref", String(payment_ref));
      sessionStorage.setItem("booking.expires_at", String(expires_at));
      sessionStorage.setItem("booking.date", String(date));
      sessionStorage.setItem("booking.time", String(selectedTime));
      sessionStorage.setItem("booking.especialidade", String(especialidade));

      // próximo passo — troque para "/resumo" se preferir
      navigate(`/anamnese`);
    } catch (err) {
      setErrorMsg(err?.message || "Não foi possível reservar este horário.");
    } finally {
      setConfirming(false);
    }
  }

  const tituloMes = useMemo(
    () => format(month, "MMMM yyyy", { locale: ptBR }).toUpperCase(),
    [month]
  );

  return (
    <div className="bodyAgendamento">
      <Titulo
        texto="AGENDAMENTO"
        subtitulo="Escolha o dia e o horário que melhor se encaixam em sua agenda."
        mostrarLinha={true}
      />

      {/* Especialidades */}
      <div className="especialidadesAgenda">
        <div className="contAgen">
          <h2 className="h2Agenda">Escolha a Especialidade:</h2>
          <div className="catAgendar">
            {ESPECIALIDADES.map((s) => (
              <button
                key={s}
                className={`chip ${especialidade === s ? "chip--ativo" : ""}`}
                onClick={() => setEspecialidade(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
          <small className="smallAgen">
            Escolhida: <b>{especialidade}</b>
          </small>
        </div>
      </div>

      {/* Calendário */}
      <div className="CalendarioAgenda">
        <div className="cal-card">
          <div className="cal-toolbar">
            <button
              className="cal-arrow cal-arrow--prev"
              aria-label="Mês anterior"
              onClick={() => setMonth(addMonths(month, -1))}
              type="button"
            >
              ‹
            </button>

            <div className="cal-title">{tituloMes}</div>

            <button
              className="cal-arrow cal-arrow--next"
              aria-label="Próximo mês"
              onClick={() => setMonth(addMonths(month, 1))}
              type="button"
            >
              ›
            </button>
          </div>

          <div className="cal-shell">
            <DayPicker
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={setSelected}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              disabled={modifiers.unavailable}
              locale={ptBR}
              weekStartsOn={1}
              showOutsideDays={false}
              components={{
                Caption: () => null,
                Nav: () => null,
                Weekdays: () => null,
              }}
            />
          </div>

          {loadingMes && <p className="cal-loading">Carregando disponibilidade…</p>}

          <ul className="cal-legend">
            <li><span className="dot dot--ok" /> Disponíveis</li>
            <li><span className="dot dot--no" /> Não Disponíveis</li>
            <li><span className="dot dot--sel" /> Dia Selecionado</li>
          </ul>
        </div>
      </div>

      {/* Slots do dia + Resumo/Confirmação */}
      {date && (
        <div style={{ marginTop: 70 }}>
          <h3>Horários em {date}</h3>

          {loadingSlots ? (
            <p>Carregando horários…</p>
          ) : slots.length === 0 ? (
            <p>Nenhum horário para este dia.</p>
          ) : (
            <div className="slots-grid">
              {slots.map((s) => (
                <button
                  key={s.time}
                  className={[
                    "slot",
                    s.available ? "livre" : "ocupado",
                    selectedTime === s.time ? "selecionado" : "",
                  ].join(" ")}
                  disabled={!s.available}
                  onClick={() => s.available && setSelectedTime(s.time)}
                  type="button"
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}

          <div className="resumo-box">
            <div className="resumo-col">
              <span>Dia:</span>
              <b>{selected ? formatDateLongPT(selected) : "— selecione um dia —"}</b>
            </div>
            <div className="resumo-col">
              <span>Hora:</span>
              <b>{selectedTime ?? "— selecione um horário —"}</b>
            </div>
            <button
              className="btn-primary"
              onClick={handleConfirmar}
              disabled={!selected || !selectedTime || confirming}
              title={
                !selected || !selectedTime
                  ? "Selecione dia e horário"
                  : confirming
                  ? "Reservando..."
                  : "Confirmar agendamento"
              }
              type="button"
            >
              {confirming ? "Reservando..." : "Confirmar"}
            </button>
          </div>

          {errorMsg && (
            <p style={{ marginTop: 8, color: "#a55", textAlign: "right" }}>
              {errorMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
