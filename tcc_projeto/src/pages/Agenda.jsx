// src/pages/Agenda.jsx
import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../components/titulo/titulo";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addMonths, format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "../css/Agendar.css";
import { fetchAuth } from "../services/api";
import usePrecoConsulta from "../hooks/usePrecoConsulta";
import { formatBRLFromCents } from "../services/config";
import { AuthContext } from "../context/AuthContext";

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

const ESPECIALIDADES = [
  "Nutrição Clínica",
  "Nutrição Esportiva",
  "Nutrição Pediátrica",
  "Emagrecimento",
  "Intolerâncias Alimentares",
];
const ESPECIALIDADE_SLUGS = {
  "Nutrição Clínica": "clinica",
  "Nutrição Esportiva": "esportiva",
  "Nutrição Pediátrica": "pediatrica",
  Emagrecimento: "emagrecimento",
  "Intolerâncias Alimentares": "intolerancias",
};

const PRESETS = {
  duracaoMin: 50,
  modalidade: "Online",
  politica: "Cancelamento gratuito até 24h antes.",
};

// Overlay de carregamento ao confirmar o agendamento
function AgendaLoadingOverlay({ show, text = "Reservando horário..." }) {
  if (!show) return null;

  return (
    <div className="agenda-loading-overlay" role="status" aria-live="polite">
      <div className="agenda-loading-card">
        <div className="agenda-spinner" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export default function Agendar() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { cents: precoCents } = usePrecoConsulta();

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

  const [slots, setSlots] = useState([]); // normalized slots (hora em 'HH:00')
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedTime, setSelectedTime] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const todayStart = startOfDay(new Date());

  const modifiers = useMemo(
    () => ({
      available: (day) =>
        !isBefore(startOfDay(day), todayStart) &&
        mapDisponibilidade[toISODate(day)] === true,
      unavailable: (day) =>
        isBefore(startOfDay(day), todayStart) ||
        mapDisponibilidade[toISODate(day)] === false,
    }),
    [mapDisponibilidade, todayStart]
  );

  const modifiersStyles = useMemo(
    () => ({
      available: { backgroundColor: "#9FA28D", color: "#000" },
      unavailable: {
        backgroundColor: "#cfcfcf",
        color: "#000",
      },
      disabled: {
        backgroundColor: "#cfcfcf",
        color: "#000",
        opacity: 1,
        cursor: "not-allowed",
      },
      selected: { backgroundColor: "#d8b2ad", color: "#000" },
    }),
    []
  );

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

  // carrega disponibilidade do mês
  useEffect(() => {
    const y = month.getFullYear(),
      m = month.getMonth();
    const total = daysInMonth(y, m);
    setLoadingMes(true);

    // optimista: tenta endpoint que retorne disponibilidade do mês (um fetch).
    // se backend não suportar, fallback para chamadas por dia.
    (async () => {
      const de = toISODate(new Date(y, m, 1));
      const ate = toISODate(new Date(y, m, total));
      try {
        const r = await fetch(`${API}/agenda/slots?de=${de}&ate=${ate}`);
        if (r.ok) {
          const data = await r.json();
          // O backend pode devolver:
          // - { slotsByDate: { "2025-11-01": true, ... } }
          // - um array [{ date: "2025-11-01", slots: [...] }, ...]
          const map = {};
          if (data && data.slotsByDate && typeof data.slotsByDate === "object") {
            Object.assign(map, data.slotsByDate);
          } else if (Array.isArray(data)) {
            data.forEach((item) => {
              map[item.date] = (item.slots || []).some((s) => s.available);
            });
          } else {
            // se formato inesperado, fallback para per-day
            throw new Error("Formato inesperado - fallback");
          }
          setMapDisponibilidade(map);
        } else {
          // fallback para per-day requests (mantém compatibilidade)
          throw new Error("Single-month endpoint não disponível");
        }
      } catch (err) {
        // fallback: muitas requisições por dia (behavior original, mas só aqui)
        try {
          const entries = await Promise.all(
            Array.from({ length: total }, (_, i) => {
              const d = new Date(y, m, i + 1);
              const iso = toISODate(d);
              return fetch(`${API}/agenda/slots?date=${iso}`)
                .then((r) => r.json())
                .then((data) => [iso, (data?.slots || []).some((s) => s.available)])
                .catch(() => [iso, false]);
            })
          );
          setMapDisponibilidade(Object.fromEntries(entries));
        } catch (e) {
          console.error("Erro fallback disponibilidade mês:", e);
          setMapDisponibilidade({});
        }
      } finally {
        setLoadingMes(false);
      }
    })();
  }, [month]);

  // carrega slots do dia (e normaliza para passos de 1h)
  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    (async () => {
      try {
        const r = await fetch(`${API}/agenda/slots?date=${date}`);
        if (!r.ok) {
          setSlots([]);
          return;
        }
        const data = await r.json();
        const rawSlots = data.slots ?? [];

        // Normalização para passo de 1 em 1 hora:
        // Para cada slot retornado, agrupa por HORA (0-23) e marca a hora como disponível
        // se existir pelo menos um slot disponível naquele horário.
        const hourMap = rawSlots.reduce((acc, s) => {
          if (!s || typeof s.time !== "string") return acc;
          const [hh, mm] = s.time.split(":").map((x) => Number(x));
          if (isNaN(hh)) return acc;
          const hourKey = String(hh).padStart(2, "0") + ":00";
          acc[hourKey] = acc[hourKey] || { time: hourKey, available: false };
          if (s.available) acc[hourKey].available = true;
          return acc;
        }, {});

        // Se hourMap ficou vazio (backend retornou horários apenas em meia hora),
        // faça fallback: arredonda os slots para a hora mais próxima **por cima**
        if (Object.keys(hourMap).length === 0 && rawSlots.length > 0) {
          rawSlots.forEach((s) => {
            if (!s || typeof s.time !== "string") return;
            const [hh, mm] = s.time.split(":").map((x) => Number(x));
            if (isNaN(hh)) return;
            // se mm > 0, mantemos a HORA (não meia hora) -> para 1h steps escolhemos hh (ignore minutos)
            const hourKey = String(hh).padStart(2, "0") + ":00";
            hourMap[hourKey] = hourMap[hourKey] || { time: hourKey, available: false };
            if (s.available) hourMap[hourKey].available = true;
          });
        }

        // transformar em array ordenado
        const normalized = Object.values(hourMap).sort((a, b) =>
          a.time.localeCompare(b.time)
        );

        setSlots(normalized);

        // se o selectedTime atual não existe mais nos slots normalizados, limpa seleção
        if (selectedTime) {
          const exists = normalized.some((s) => s.time === selectedTime && s.available);
          if (!exists) setSelectedTime(null);
        }
      } catch (e) {
        console.error("Erro ao carregar slots do dia:", e);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [date]); // eslint-disable-line

  async function handleConfirmar() {
    if (!date || !selectedTime || confirming) return;
    setErrorMsg("");

    // se não estiver logado, manda pro login
    if (!token) {
      navigate("/login", {
        state: {
          from: "/agendar",
          loginMessage: "Faça o login para continuar o agendamento.",
        },
      });
      return;
    }

    // valida novamente que o horário está presente e disponível
    const chosenSlot = slots.find((s) => s.time === selectedTime);
    if (!chosenSlot || !chosenSlot.available) {
      setErrorMsg("Horário inválido — escolha um horário disponível.");
      return;
    }

    setConfirming(true);
    try {
      // slug pra mandar pro backend
      const espSlug = ESPECIALIDADE_SLUGS[especialidade] || "clinica";

      const r = await fetchAuth(`${API}/agenda/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time: selectedTime,
          especialidade: espSlug, // 👈 VAI PRO BACKEND
        }),
      });
      const data = await r.json();

      if (!r.ok) {
        throw new Error(
          data?.erro || "Não foi possível reservar este horário."
        );
      }

      const { hold_id, payment_ref, expires_at } = data;
      sessionStorage.setItem("booking.hold_id", String(hold_id));
      sessionStorage.setItem("booking.payment_ref", String(payment_ref));
      sessionStorage.setItem("booking.expires_at", String(expires_at));
      sessionStorage.setItem("booking.date", String(date));
      sessionStorage.setItem("booking.time", String(selectedTime));

      // label bonitinho (pra telas de resumo)
      sessionStorage.setItem("booking.especialidade", String(especialidade));
      // slug (pra backend / lógica interna)
      sessionStorage.setItem("booking.especialidade_slug", String(espSlug));

      // vai pra PAGAMENTO
      navigate("/pagamento");
    } catch (err) {
      setErrorMsg(err?.message || "Não foi possível reservar este horário.");
      setConfirming(false);
    }
  }

  const tituloMes = useMemo(
    () => format(month, "MMMM yyyy", { locale: ptBR }).toUpperCase(),
    [month]
  );

  return (
    <div className="bodyAgendamento">
      {/* overlay de carregamento enquanto confirma */}
      <AgendaLoadingOverlay show={confirming} />

      <Titulo
        texto="AGENDAMENTO"
        subtitulo="Escolha o dia e o horário que melhor se encaixam em sua agenda."
        mostrarLinha={true}
        className="titulo-agenda-decima"
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

          {/* Barra de dias da semana (agora com classes pra responsividade) */}
          <div className="cal-weekdays-row">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
              <div key={d} className="cal-weekday-cell">
                {d}
              </div>
            ))}
          </div>

          <div className="cal-shell">
            <DayPicker
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={(day) => {
                if (!day) return;
                if (isBefore(startOfDay(day), todayStart)) return;
                setSelected(day);
              }}
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

          {loadingMes && (
            <p className="cal-loading">Carregando disponibilidade…</p>
          )}

          <ul className="cal-legend">
            <li>
              <span className="dot dot--ok" /> Disponíveis
            </li>
            <li>
              <span className="dot dot--no" /> Não Disponíveis
            </li>
            <li>
              <span className="dot dot--sel" /> Dia Selecionado
            </li>
          </ul>
        </div>
      </div>

      {/* Slots + Resumo */}
      {date && (
        <div style={{ marginTop: 70, width: "100%", maxWidth: 1100 }}>
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
                  title={s.available ? "Disponível" : "Indisponível"}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}

          <div className="resumo-box">
            <div className="resumo-col">
              <span>Dia</span>
              <b>
                {selected ? formatDateLongPT(selected) : "— selecione um dia —"}
              </b>
            </div>
            <div className="resumo-col">
              <span>Hora</span>
              <b>{selectedTime ?? "— selecione um horário —"}</b>
            </div>
            <div className="resumo-col">
              <span>Especialidade</span>
              <b>{especialidade}</b>
            </div>
            <div className="resumo-col">
              <span>Modalidade</span>
              <b>{PRESETS.modalidade}</b>
            </div>
            <div className="resumo-col">
              <span>Duração Estimada</span>
              <b>≈ {PRESETS.duracaoMin} min</b>
            </div>
            <div className="resumo-col">
              <span>Preço</span>
              <b>
                {Number.isFinite(precoCents)
                  ? formatBRLFromCents(precoCents)
                  : "—"}
              </b>
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
                  : "Confirmar"
              }
              type="button"
            >
              {confirming ? "Reservando..." : "Confirmar"}
            </button>
          </div>

          <p
            style={{
              marginTop: 6,
              color: "#666",
              fontSize: ".85rem",
              textAlign: "right",
            }}
          >
            {PRESETS.politica}
          </p>

          {errorMsg && (
            <p
              style={{
                marginTop: 8,
                color: "#a55",
                textAlign: "right",
              }}
            >
              {errorMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
