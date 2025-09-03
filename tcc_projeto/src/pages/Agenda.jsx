// src/pages/Agendar.jsx
import { useEffect, useState } from "react";
import Titulo from "../components/titulo/titulo";

//CALENDARIO
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function toISODate(d) {
    return format(d, "yyyy-MM-dd");
}
// Quantos dias tem o mês (month = 0..11)
function daysInMonth(year, monthIndex0) {
    return new Date(year, monthIndex0 + 1, 0).getDate();
}
const ESPECIALIDADES = [
    "Nutrição Clínica",
    "Nutrição Esportiva",
    "Nutrição Pediátrica",
    "Emagrecimento",
    "Intolerâncias Alimentares",
];
export default function Agendar() {
    const [especialidade, setEspecialidade] = useState(
        localStorage.getItem("especialidade") || ESPECIALIDADES[0]
    );

    // calendário/seleção
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [selected, setSelected] = useState(null);          // Date | null
    const [date, setDate] = useState("");                   // "YYYY-MM-DD" (para chamar a API)

    // disponibilidade do mês: { "YYYY-MM-DD": true/false }
    const [mapDisponibilidade, setMapDisponibilidade] = useState({});
    const [loadingMes, setLoadingMes] = useState(false);

    // slots do dia
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // salva especialidade no localStorage
    useEffect(() => {
        localStorage.setItem("especialidade", especialidade);
    }, [especialidade]);

    // quando selecionar um dia no calendário, atualiza a string ISO p/ API
    useEffect(() => {
        if (!selected) {
            setDate("");
            setSlots([]);
            return;
        }
        setDate(toISODate(selected));
    }, [selected]);

    // pinta disponibilidade do mês (DEMO: 1 request por dia do mês)
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

    // busca slots do dia escolhido
    useEffect(() => {
        if (!date) {
            setSlots([]);
            return;
        }
        setLoadingSlots(true);
        (async () => {
            try {
                const r = await fetch(`${API}/agenda/slots?date=${date}`);
                const data = await r.json();
                setSlots(data.slots ?? []);
            } catch (err) {
                console.error("Erro buscando slots", err);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        })();
    }, [date]);

    // regras pra colorir dias no calendário
    const modifiers = {
        available: (day) => mapDisponibilidade[toISODate(day)] === true,
        unavailable: (day) => mapDisponibilidade[toISODate(day)] === false,
    };
    const modifiersClassNames = {
        available: "rdp-day_available",
        unavailable: "rdp-day_unavailable",
    };


    return (
        <div className="bodyAgendamento">
            <Titulo
                texto="AGENDAMENTO"
                subtitulo={`Para agendar sua consulta nutricional, por favor, escolha o dia e o horário que melhor se encaixam em sua agenda.`}
                mostrarLinha={true}
            />

            <div className="especialidadesAgenda">
                <h2 className="h2Agenda">Escolha a Especialidade:</h2>

                <div className="catAgendar" >
                    {ESPECIALIDADES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setEspecialidade(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <small> Escolhida: <b>{especialidade}</b>  </small>
            </div>

            {/* Calendário */}
            <div className="CalendarioAgenda">
                <div className="calender">
                    <DayPicker
                        mode="single"
                        month={month}
                        onMonthChange={setMonth}
                        selected={selected}
                        onSelect={setSelected}
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        disabled={modifiers.unavailable}
                        captionLayout="dropdown"
                        showOutsideDays
                    />

                    {loadingMes && <p>Carregando disponibilidade do mês…</p>}
                </div>
            </div>

            {/* Slots do dia */}
            {selected && (
                <div style={{ marginTop: 16 }}>
                    <h3>Horários em {date}</h3>
                    {loadingSlots ? (
                        <p>Carregando horários…</p>
                    ) : (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {slots.map((s) => (
                                <button key={s.time} disabled={!s.available}>
                                    {s.time}
                                </button>
                            ))}
                            {slots.length === 0 && <p>Nenhum horário para este dia.</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
