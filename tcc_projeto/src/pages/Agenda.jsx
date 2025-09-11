// src/pages/Agendar.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../components/titulo/titulo";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import "../css/Agendar.css";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";

function toISODate(d) {
  return format(d, "yyyy-MM-dd");
}
function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}
// data longa PT-BR (segunda, 8 de setembro de 2025)
function formatDateLongPT(d) {
  return format(d, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
// data curta DD/MM/YYYY
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

  // especialidade
  const [especialidade, setEspecialidade] = useState(
    localStorage.getItem("especialidade") || ESPECIALIDADES[0]
  );

  // calendário
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null);  // Date | null
  const [date, setDate] = useState("");            // "YYYY-MM-DD"

  // disponibilidade por dia do mês: {"YYYY-MM-DD": true/false}
  const [mapDisponibilidade, setMapDisponibilidade] = useState({});
  const [loadingMes, setLoadingMes] = useState(false);

  // slots do dia
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // horário escolhido
  const [selectedTime, setSelectedTime] = useState(null);

  // estados/cores (texto sempre preto)
  const modifiers = useMemo(() => ({
    available: (day) => mapDisponibilidade[toISODate(day)] === true,
    unavailable: (day) => mapDisponibilidade[toISODate(day)] === false,
  }), [mapDisponibilidade]);

  const modifiersStyles = useMemo(() => ({
    available:   { backgroundColor: "#9FA28D", color: "#000" }, // verde
    unavailable: { backgroundColor: "#cfcfcf", color: "#000" }, // cinza
    disabled:    { backgroundColor: "#cfcfcf", color: "#000", opacity: 1, cursor: "not-allowed" },
    selected:    { backgroundColor: "#d8b2ad", color: "#000" }, // rosado
  }), []);

  // guarda especialidade
  useEffect(() => {
    localStorage.setItem("especialidade", especialidade);
  }, [especialidade]);

  // quando escolher dia no calendário
  useEffect(() => {
    if (!selected) {
      setDate("");
      setSlots([]);
      setSelectedTime(null);
      return;
    }
    setDate(toISODate(selected));
    setSelectedTime(null); // reset ao trocar de dia
  }, [selected]);

  // pinta disponibilidade do mês (demo)
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

  // busca slots do dia selecionado
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

  // confirmar → vai para /confirmar com dados na URL
  function handleConfirmar() {
    if (!date || !selectedTime) return;
    const params = new URLSearchParams({
      date,
      time: selectedTime,
      esp: especialidade,
    });
    navigate(`/confirmar?${params.toString()}`);
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
          {/* Toolbar própria: setas ao redor do nome do mês */}
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
              showOutsideDays={false}   // só dias do mês
              // mata caption/nav/semana nativos (pra não duplicar nada)
              components={{
                Caption: () => null,
                Nav: () => null,
                Weekdays: () => null,
              }}
            />
          </div>

          {loadingMes && <p className="cal-loading">Carregando disponibilidade…</p>}

          {/* legenda (opcional) */}
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

          {/* Resumo fixo “lá embaixo” */}
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
              disabled={!selected || !selectedTime}
              title={!selected || !selectedTime ? "Selecione dia e horário" : "Confirmar agendamento"}
              type="button"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
