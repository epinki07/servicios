'use client';

import { useEffect, useMemo, useState } from 'react';
import { whatsapp } from '@/lib/contenido';

type Servicio = { id: string; nombre: string; min: number; precio: number; desc: string; online?: boolean };
type Cita = { codigo: string; servicio: string; fecha: string; hora: string; nombre: string; tel: string; motivo: string; estado: 'confirmada' | 'atendida' | 'cancelada' };

const SERVICIOS: Servicio[] = [
  { id: 'inicial', nombre: 'Consulta inicial', min: 60, precio: 700, desc: 'Historia clínica, mediciones y plan de alimentación personalizado.' },
  { id: 'seguimiento', nombre: 'Seguimiento', min: 40, precio: 450, desc: 'Revisión de avances y ajuste del plan cada 2 a 4 semanas.' },
  { id: 'deportiva', nombre: 'Nutrición deportiva', min: 60, precio: 850, desc: 'Plan para rendimiento, composición corporal y competencias.' },
  { id: 'online', nombre: 'Consulta en línea', min: 45, precio: 600, desc: 'Por videollamada, con el plan enviado a tu correo.', online: true },
];
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const pesos = (n: number) => '$' + n.toLocaleString('es-MX');
const iso = (d: Date) => d.toISOString().slice(0, 10);
const leer = (): Cita[] => { try { return JSON.parse(localStorage.getItem('raiz-citas') || '[]'); } catch { return []; } };
const guardar = (c: Cita[]) => { try { localStorage.setItem('raiz-citas', JSON.stringify(c)); } catch { /* sin almacenamiento */ } };

// Horarios: lunes a viernes 9:00–14:00 y 16:00–19:00, sábado 9:00–13:00.
function horarios(fecha: Date, min: number) {
  const bloques = fecha.getDay() === 6 ? [[9, 13]] : [[9, 14], [16, 19]];
  const out: string[] = [];
  for (const [a, b] of bloques) for (let t = a * 60; t + min <= b * 60; t += min >= 60 ? 60 : 45) out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  return out;
}
// Ocupación simulada estable por día y hora, para que la agenda se vea real.
const ocupadoSimulado = (f: string, h: string) => [...(f + h)].reduce((s, c) => s + c.charCodeAt(0), 0) % 3 === 0;

export default function Consultorio() {
  const [vista, setVista] = useState<'paciente' | 'panel'>('paciente');
  const [paso, setPaso] = useState(1);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState('');
  const [datos, setDatos] = useState({ nombre: '', tel: '', motivo: '' });
  const [citas, setCitas] = useState<Cita[]>([]);
  const [hecha, setHecha] = useState<Cita | null>(null);

  useEffect(() => setCitas(leer()), []);

  const dias = useMemo(() => {
    const out: Date[] = [];
    const d = new Date(); d.setHours(12, 0, 0, 0);
    while (out.length < 12) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)); }
    return out;
  }, []);
  const ocupado = (f: string, h: string) => ocupadoSimulado(f, h) || citas.some((c) => c.fecha === f && c.hora === h && c.estado !== 'cancelada');

  const reservar = () => {
    if (!servicio) return;
    const cita: Cita = { codigo: 'RZ-' + Math.random().toString(36).slice(2, 7).toUpperCase(), servicio: servicio.nombre, fecha, hora, ...datos, estado: 'confirmada' };
    const nuevas = [...citas, cita];
    setCitas(nuevas); guardar(nuevas); setHecha(cita); setPaso(5);
  };
  const reiniciar = () => { setPaso(1); setServicio(null); setFecha(''); setHora(''); setDatos({ nombre: '', tel: '', motivo: '' }); setHecha(null); };
  const actualizar = (codigo: string, estado: Cita['estado']) => { const n = citas.map((c) => (c.codigo === codigo ? { ...c, estado } : c)); setCitas(n); guardar(n); };

  const fechaLarga = (f: string) => {
    const s = new Date(f + 'T12:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const calendario = (c: Cita) => {
    const ini = c.fecha.replace(/-/g, '') + 'T' + c.hora.replace(':', '') + '00';
    const s = SERVICIOS.find((x) => x.nombre === c.servicio)!;
    const finD = new Date(`${c.fecha}T${c.hora}:00`); finD.setMinutes(finD.getMinutes() + s.min);
    const fin = c.fecha.replace(/-/g, '') + 'T' + `${String(finD.getHours()).padStart(2, '0')}${String(finD.getMinutes()).padStart(2, '0')}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.servicio + ' · Consultorio Raíz')}&dates=${ini}/${fin}&ctz=America/Merida&details=${encodeURIComponent('Código ' + c.codigo)}`;
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#14231c]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-[#14231c] px-4 py-2 text-center text-xs text-[#cfe3d6]">
        Demo de producto · consultorio y persona ficticios. Las citas se guardan solo en este navegador. <a href="/servicios/" className="underline">Volver al sitio</a>
      </div>

      <header className="border-b border-[#dfe8e2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2f7a55] font-bold text-white">R</div>
            <div><p className="font-semibold">Consultorio Raíz</p><p className="hidden text-xs text-[#5b7266] sm:block">Nutrición clínica y deportiva · Mérida</p></div>
          </div>
          <div className="flex shrink-0 rounded-full bg-[#edf3ef] p-1 text-sm">
            <button onClick={() => setVista('paciente')} className={`rounded-full px-4 py-2 ${vista === 'paciente' ? 'bg-white font-semibold shadow' : ''}`}>Agendar</button>
            <button onClick={() => setVista('panel')} className={`rounded-full px-4 py-2 ${vista === 'panel' ? 'bg-white font-semibold shadow' : ''}`}>Panel<span className="hidden sm:inline"> del consultorio</span></button>
          </div>
        </div>
      </header>

      {vista === 'panel' ? (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight">Agenda del consultorio</h1>
          <p className="mt-2 text-[#5b7266]">Así ve la nutrióloga sus citas: confirmadas, atendidas o canceladas, sin libretas ni mensajes perdidos.</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {(['confirmada', 'atendida', 'cancelada'] as const).map((e) => (
              <div key={e} className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-2xl font-bold">{citas.filter((c) => c.estado === e).length}</p><p className="text-sm text-[#5b7266]">{e}s</p></div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {citas.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-[#5b7266]">Aún no hay citas. Agenda una de prueba en la pestaña «Agendar».</p>}
            {[...citas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)).map((c) => (
              <div key={c.codigo} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
                <div>
                  <p className="font-semibold">{c.nombre} <span className="text-xs font-normal text-[#5b7266]">· {c.codigo}</span></p>
                  <p className="text-sm text-[#5b7266]">{c.servicio} · {fechaLarga(c.fecha)} · {c.hora}</p>
                  {c.motivo && <p className="mt-1 text-sm">Motivo: {c.motivo}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.estado === 'confirmada' ? 'bg-[#e3f1e8] text-[#2f7a55]' : c.estado === 'atendida' ? 'bg-neutral-100' : 'bg-red-50 text-red-700'}`}>{c.estado}</span>
                  {c.estado === 'confirmada' && (<>
                    <button onClick={() => actualizar(c.codigo, 'atendida')} className="rounded-full border px-3 py-1">Atendida</button>
                    <button onClick={() => actualizar(c.codigo, 'cancelada')} className="rounded-full border px-3 py-1">Cancelar</button>
                    <a href={whatsapp(`[DEMO · Consultorio Raíz] Recordatorio para ${c.nombre}: tu cita de ${c.servicio} es el ${fechaLarga(c.fecha)} a las ${c.hora}.`)} target="_blank" rel="noopener" className="rounded-full bg-[#1f8f4e] px-3 py-1 text-white">Recordar</a>
                  </>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="lg:pt-6">
              <p className="text-sm font-semibold text-[#2f7a55]">Lic. en Nutrición · Cédula profesional (ejemplo)</p>
              <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">Agenda tu consulta en 1 minuto, a la hora que te quede.</h1>
              <p className="mt-5 text-lg text-[#5b7266]">Elige servicio, día y hora con disponibilidad real. Recibes tu confirmación al momento y un recordatorio antes de tu cita.</p>
              <ul className="mt-8 space-y-3 text-sm">
                {['Planes personalizados, sin dietas genéricas', 'Seguimiento por WhatsApp entre consultas', 'Consultas presenciales y en línea'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e3f1e8] text-[#2f7a55]">✓</span>{t}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex gap-2">
                {[1, 2, 3, 4].map((n) => <div key={n} className={`h-1.5 flex-1 rounded-full ${paso >= n ? 'bg-[#2f7a55]' : 'bg-[#e6ede8]'}`} />)}
              </div>

              {paso === 1 && (<>
                <h2 className="text-xl font-semibold">1. ¿Qué necesitas?</h2>
                <div className="mt-4 space-y-3">
                  {SERVICIOS.map((s) => (
                    <button key={s.id} onClick={() => { setServicio(s); setPaso(2); }} className="flex w-full items-start justify-between gap-4 rounded-2xl border border-[#e2ebe5] p-4 text-left transition hover:border-[#2f7a55]">
                      <div><p className="font-semibold">{s.nombre}</p><p className="text-sm text-[#5b7266]">{s.desc}</p></div>
                      <div className="shrink-0 text-right"><p className="font-semibold">{pesos(s.precio)}</p><p className="text-xs text-[#5b7266]">{s.min} min</p></div>
                    </button>
                  ))}
                </div>
              </>)}

              {paso === 2 && servicio && (<>
                <h2 className="text-xl font-semibold">2. Elige el día</h2>
                <p className="text-sm text-[#5b7266]">{servicio.nombre} · {servicio.min} min</p>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {dias.map((d) => {
                    const f = iso(d), libres = horarios(d, servicio.min).filter((h) => !ocupado(f, h)).length;
                    return (
                      <button key={f} disabled={!libres} onClick={() => { setFecha(f); setPaso(3); }} className={`rounded-xl border p-2 text-center ${libres ? 'border-[#e2ebe5] hover:border-[#2f7a55]' : 'opacity-40'}`}>
                        <p className="text-xs text-[#5b7266]">{DIAS[d.getDay()]}</p><p className="text-lg font-semibold">{d.getDate()}</p><p className="text-[10px] text-[#2f7a55]">{libres ? `${libres} libres` : 'lleno'}</p>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPaso(1)} className="mt-5 text-sm text-[#5b7266] underline">Cambiar servicio</button>
              </>)}

              {paso === 3 && servicio && (<>
                <h2 className="text-xl font-semibold">3. Elige la hora</h2>
                <p className="text-sm text-[#5b7266]">{fechaLarga(fecha)}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {horarios(new Date(fecha + 'T12:00'), servicio.min).map((h) => (
                    <button key={h} disabled={ocupado(fecha, h)} onClick={() => { setHora(h); setPaso(4); }}
                      className={`rounded-xl border py-3 text-sm font-medium ${ocupado(fecha, h) ? 'border-transparent bg-[#f1f4f2] text-[#a7b5ad] line-through' : 'border-[#e2ebe5] hover:border-[#2f7a55]'}`}>{h}</button>
                  ))}
                </div>
                <button onClick={() => setPaso(2)} className="mt-5 text-sm text-[#5b7266] underline">Cambiar día</button>
              </>)}

              {paso === 4 && servicio && (<>
                <h2 className="text-xl font-semibold">4. Tus datos</h2>
                <p className="text-sm text-[#5b7266]">{servicio.nombre} · {fechaLarga(fecha)} · {hora}</p>
                <div className="mt-4 space-y-3">
                  <input placeholder="Nombre completo" value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
                  <input placeholder="WhatsApp (10 dígitos)" inputMode="numeric" value={datos.tel} onChange={(e) => setDatos({ ...datos, tel: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="w-full rounded-xl border px-4 py-3" />
                  <textarea placeholder="Motivo de consulta (opcional)" value={datos.motivo} onChange={(e) => setDatos({ ...datos, motivo: e.target.value })} rows={2} className="w-full rounded-xl border px-4 py-3" />
                </div>
                <button disabled={!datos.nombre.trim() || datos.tel.length !== 10} onClick={reservar} className="mt-5 w-full rounded-full bg-[#2f7a55] py-4 font-semibold text-white disabled:bg-neutral-300">Confirmar cita · {pesos(servicio.precio)}</button>
                <p className="mt-2 text-center text-xs text-[#5b7266]">Pagas en consultorio. Puedes cancelar sin costo con 24 h de anticipación.</p>
                <button onClick={() => setPaso(3)} className="mt-3 text-sm text-[#5b7266] underline">Cambiar hora</button>
              </>)}

              {paso === 5 && hecha && (
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e3f1e8] text-2xl text-[#2f7a55]">✓</div>
                  <h2 className="mt-4 text-2xl font-semibold">¡Cita confirmada!</h2>
                  <p className="mt-2 text-[#5b7266]">{hecha.servicio} · {fechaLarga(hecha.fecha)} · {hecha.hora}</p>
                  <p className="mt-1 text-sm">Código: <b>{hecha.codigo}</b></p>
                  <div className="mt-6 grid gap-2">
                    <a href={calendario(hecha)} target="_blank" rel="noopener" className="rounded-full border border-[#2f7a55] py-3 font-semibold text-[#2f7a55]">Agregar a Google Calendar</a>
                    <a href={whatsapp(`[DEMO · Consultorio Raíz] Hola, soy ${hecha.nombre}. Confirmo mi cita de ${hecha.servicio} el ${fechaLarga(hecha.fecha)} a las ${hecha.hora}. Código ${hecha.codigo}.`)} target="_blank" rel="noopener" className="rounded-full bg-[#1f8f4e] py-3 font-semibold text-white">Enviar confirmación por WhatsApp</a>
                    <button onClick={reiniciar} className="py-2 text-sm text-[#5b7266] underline">Agendar otra cita</button>
                  </div>
                  <p className="mt-4 text-xs text-[#5b7266]">Tip de la demo: abre «Panel del consultorio» para ver cómo le llega esta cita al consultorio.</p>
                </div>
              )}
            </div>
          </section>

          <section className="border-t border-[#dfe8e2] bg-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
              <div><h3 className="font-semibold">Horario</h3><p className="mt-2 text-sm text-[#5b7266]">Lunes a viernes 9:00–14:00 y 16:00–19:00<br />Sábado 9:00–13:00</p></div>
              <div><h3 className="font-semibold">Ubicación</h3><p className="mt-2 text-sm text-[#5b7266]">Mérida, Yucatán (dirección de ejemplo)<br />Consultas en línea para todo México</p></div>
              <div><h3 className="font-semibold">Antes de tu consulta</h3><p className="mt-2 text-sm text-[#5b7266]">Llega 10 minutos antes, con ropa cómoda y tus estudios de laboratorio recientes si los tienes.</p></div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
