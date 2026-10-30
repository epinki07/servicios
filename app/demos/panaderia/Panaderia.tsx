'use client';

import { useEffect, useMemo, useState } from 'react';
import { whatsapp } from '@/lib/contenido';

type Producto = { id: string; nombre: string; desc: string; precio: number; cat: string; img: string; agotado?: boolean };

const CATEGORIAS = ['Todo', 'Pan dulce', 'Salado', 'Pasteles', 'Café'];
const foto = (id: string, w = 480) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
const BASE: Producto[] = [
  { id: 'cuerno', nombre: 'Cuerno de mantequilla', desc: 'Hojaldre con mantequilla, 27 capas, dorado al momento.', precio: 22, cat: 'Pan dulce', img: foto('1623334044303-241021148842') },
  { id: 'rosca', nombre: 'Rosca de canela', desc: 'Enrollada a mano con glaseado de vainilla.', precio: 28, cat: 'Pan dulce', img: foto('1764281469526-e1c378515e6f') },
  { id: 'galleta', nombre: 'Galleta de chispas', desc: 'Orilla crujiente, centro suave, chocolate belga.', precio: 18, cat: 'Pan dulce', img: foto('1598839950984-034f6dc7b495') },
  { id: 'baguette', nombre: 'Baguette clásica', desc: 'Corteza crujiente y miga abierta, sale cada 2 horas.', precio: 32, cat: 'Salado', img: foto('1768203631935-da182455aa6d') },
  { id: 'hogaza', nombre: 'Hogaza de masa madre', desc: '24 h de fermentación natural, 700 g.', precio: 85, cat: 'Salado', img: foto('1767065888377-e5ffb4e39645') },
  { id: 'jamon', nombre: 'Cuernito de jamón y queso', desc: 'Relleno al momento, sale caliente.', precio: 48, cat: 'Salado', img: foto('1695304777030-167556e5ecf3') },
  { id: 'fresas', nombre: 'Pastel de fresas (rebanada)', desc: 'Bizcocho de vainilla, crema y fresa fresca.', precio: 62, cat: 'Pasteles', img: foto('1551879400-111a9087cd86') },
  { id: 'choco', nombre: 'Pastel de chocolate entero', desc: '12 porciones. Pídelo con 24 h de anticipación.', precio: 480, cat: 'Pasteles', img: foto('1605807646983-377bc5a76493') },
  { id: 'americano', nombre: 'Café americano', desc: 'Grano de Chiapas, tostado medio.', precio: 35, cat: 'Café', img: foto('1785760329828-183a0b481be2') },
  { id: 'capuchino', nombre: 'Capuchino', desc: 'Leche espumada con arte latte; pide leche de avena.', precio: 52, cat: 'Café', img: foto('1760175445000-0e01e193d1cd') },
  { id: 'chocolate', nombre: 'Chocolate caliente', desc: 'Chocolate de mesa yucateco con canela.', precio: 45, cat: 'Café', img: foto('1762411238451-b90dd1c74238') },
];
const ENVIO = 35;
const pesos = (n: number) => '$' + n.toLocaleString('es-MX');
const leer = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const guardar = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

function abiertoAhora() {
  const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Merida' }));
  const h = ahora.getHours() + ahora.getMinutes() / 60, d = ahora.getDay();
  const [a, c] = d === 0 ? [7, 14] : [6.5, 21];
  return { abierto: h >= a && h < c, texto: d === 0 ? 'Domingo 7:00 a 14:00' : 'Hoy 6:30 a 21:00' };
}

export default function Panaderia() {
  const [productos, setProductos] = useState<Producto[]>(BASE);
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [cat, setCat] = useState('Todo');
  const [abierto, setAbierto] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [entrega, setEntrega] = useState<'recoger' | 'domicilio'>('recoger');
  const [datos, setDatos] = useState({ nombre: '', hora: '08:00', direccion: '', notas: '' });
  const [estado, setEstado] = useState<{ abierto: boolean; texto: string } | null>(null);

  useEffect(() => {
    setProductos(BASE.map((p) => ({ ...p, ...leer<Record<string, Partial<Producto>>>('molino-admin', {})[p.id] })));
    setCarrito(leer('molino-carrito', {}));
    setEstado(abiertoAhora());
  }, []);
  useEffect(() => guardar('molino-carrito', carrito), [carrito]);

  const cambiarProducto = (id: string, cambio: Partial<Producto>) => {
    setProductos((ps) => ps.map((p) => (p.id === id ? { ...p, ...cambio } : p)));
    const extra = leer<Record<string, Partial<Producto>>>('molino-admin', {});
    guardar('molino-admin', { ...extra, [id]: { ...extra[id], ...cambio } });
  };
  const agregar = (id: string, n = 1) => setCarrito((c) => {
    const q = Math.max(0, (c[id] || 0) + n);
    const { [id]: _, ...resto } = c;
    return q ? { ...resto, [id]: q } : resto;
  });

  const lineas = useMemo(() => Object.entries(carrito).map(([id, q]) => ({ p: productos.find((x) => x.id === id)!, q })).filter((l) => l.p && !l.p.agotado), [carrito, productos]);
  const subtotal = lineas.reduce((s, l) => s + l.p.precio * l.q, 0);
  const total = subtotal + (entrega === 'domicilio' && subtotal > 0 ? ENVIO : 0);
  const piezas = lineas.reduce((s, l) => s + l.q, 0);
  const visibles = productos.filter((p) => cat === 'Todo' || p.cat === cat);
  const listo = piezas > 0 && datos.nombre.trim() && (entrega === 'recoger' || datos.direccion.trim());

  const mensaje = [
    '[DEMO · Panadería Molino] Nuevo pedido',
    ...lineas.map((l) => `• ${l.q} × ${l.p.nombre} — ${pesos(l.p.precio * l.q)}`),
    entrega === 'domicilio' ? `• Envío — ${pesos(ENVIO)}` : '',
    `Total: ${pesos(total)}`,
    `Nombre: ${datos.nombre}`,
    entrega === 'recoger' ? `Recoge en tienda a las ${datos.hora}` : `Entrega a domicilio: ${datos.direccion}`,
    datos.notas ? `Notas: ${datos.notas}` : '',
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#2b1d12]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-[#2b1d12] px-4 py-2 text-center text-xs text-[#f3e3c7]">
        Demo de producto · negocio ficticio. Los pedidos de prueba llegan al WhatsApp de Diego Ramírez. <a href="/servicios/" className="underline">Volver al sitio</a>
      </div>

      <header className="sticky top-0 z-20 border-b border-[#ead9bd] bg-[#fbf6ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <p className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Fraunces, serif' }}>Molino</p>
            <p className="-mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8a6a4a]">Panadería de barrio</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAdmin(!admin)} className={`rounded-full border px-3 py-2 text-xs font-medium ${admin ? 'border-[#2b1d12] bg-[#2b1d12] text-white' : 'border-[#d8c19c]'}`}>
              {admin ? 'Salir' : <>Admin<span className="hidden sm:inline">istrador</span></>}
            </button>
            <button onClick={() => setAbierto(true)} className="relative rounded-full bg-[#b5561c] px-4 py-2 text-sm font-semibold text-white">
              Pedido {piezas > 0 && <span className="ml-1 rounded-full bg-white px-2 text-xs text-[#b5561c]">{piezas}</span>}
            </button>
          </div>
        </div>
      </header>

      {admin && (
        <div className="border-b border-[#ead9bd] bg-[#fff4df] px-4 py-3 text-center text-sm">
          <b>Modo administrador:</b> cambia precios o marca productos como agotados. Así lo haría el dueño desde su celular, sin llamar a nadie.
          <button onClick={() => { localStorage.removeItem('molino-admin'); setProductos(BASE); }} className="ml-3 underline">Restablecer</button>
        </div>
      )}

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div>
          {estado && (
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${estado.abierto ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-700'}`}>
              <span className={`h-2 w-2 rounded-full ${estado.abierto ? 'bg-green-600' : 'bg-neutral-500'}`} />
              {estado.abierto ? 'Abierto ahora' : 'Cerrado ahora'} · {estado.texto}
            </span>
          )}
          <h1 className="mt-5 text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl" style={{ fontFamily: 'Fraunces, serif' }}>
            Pan recién horneado, apartado desde tu celular.
          </h1>
          <p className="mt-5 max-w-md text-lg text-[#6d5440]">Arma tu pedido, elige si pasas por él o te lo llevamos, y llega listo a nuestro WhatsApp. Sin esperar respuesta para saber qué hay.</p>
          <a href="#menu" className="mt-8 inline-block rounded-full bg-[#2b1d12] px-6 py-3 text-sm font-semibold text-white">Ver el menú de hoy</a>
        </div>
        <div className="relative aspect-[4/5] sm:aspect-square">
          <img src={foto('1644015272264-2d70518c2046', 1100)} alt="Vitrina de la panadería con pan recién horneado" className="h-full w-full rounded-[2rem] object-cover shadow-xl" />
          <img src={foto('1623334044303-241021148842', 400)} alt="" aria-hidden className="absolute -top-5 -right-3 hidden h-32 w-32 rounded-2xl border-4 border-[#fbf6ee] object-cover shadow-lg sm:block" />
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-white px-5 py-4 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-[#8a6a4a]">Promo de la semana</p>
            <p className="font-semibold">3 cuernos por $60</p>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>Menú de hoy</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm ${cat === c ? 'bg-[#2b1d12] text-white' : 'bg-white text-[#6d5440]'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p) => (
            <article key={p.id} className={`flex gap-4 rounded-2xl bg-white p-4 shadow-sm ${p.agotado && !admin ? 'opacity-50' : ''}`}>
              <img src={p.img} alt={p.nombre} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <h3 className="font-semibold">{p.nombre}</h3>
                <p className="mt-1 text-sm text-[#7d6450]">{p.desc}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  {admin ? (
                    <div className="flex items-center gap-2 text-sm">
                      $<input type="number" value={p.precio} min={1} onChange={(e) => cambiarProducto(p.id, { precio: Number(e.target.value) || 0 })} className="w-20 rounded border border-[#d8c19c] px-2 py-1" />
                      <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.agotado} onChange={(e) => cambiarProducto(p.id, { agotado: e.target.checked })} />Agotado</label>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold">{pesos(p.precio)}</span>
                      {p.agotado ? <span className="text-xs font-semibold uppercase text-[#b5561c]">Agotado hoy</span> : carrito[p.id] ? (
                        <div className="flex items-center gap-3 rounded-full bg-[#f3e6d0] px-2 py-1">
                          <button onClick={() => agregar(p.id, -1)} className="h-7 w-7 rounded-full bg-white" aria-label="Quitar uno">−</button>
                          <span className="w-4 text-center text-sm font-semibold">{carrito[p.id]}</span>
                          <button onClick={() => agregar(p.id)} className="h-7 w-7 rounded-full bg-white" aria-label="Agregar uno">+</button>
                        </div>
                      ) : (
                        <button onClick={() => agregar(p.id)} className="rounded-full bg-[#b5561c] px-4 py-1.5 text-sm font-semibold text-white">Agregar</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#2b1d12] text-[#f3e3c7]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div><h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Fraunces, serif' }}>Horario</h3><p className="mt-3 text-sm">Lunes a sábado 6:30 a 21:00<br />Domingo 7:00 a 14:00</p></div>
          <div><h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Fraunces, serif' }}>Entregas</h3><p className="mt-3 text-sm">A domicilio en colonias cercanas por {pesos(ENVIO)}. Pedidos de pastel entero con 24 h de anticipación.</p></div>
          <div><h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Fraunces, serif' }}>Visítanos</h3><p className="mt-3 text-sm">Mérida, Yucatán (dirección de ejemplo)<br />Estacionamiento en la calle</p></div>
        </div>
      </section>

      {piezas > 0 && !abierto && (
        <button onClick={() => setAbierto(true)} className="fixed inset-x-4 bottom-4 z-20 rounded-full bg-[#b5561c] py-4 text-center font-semibold text-white shadow-xl sm:hidden">
          Ver pedido · {piezas} · {pesos(subtotal)}
        </button>
      )}

      {abierto && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/40" onClick={() => setAbierto(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>Tu pedido</h2>
              <button onClick={() => setAbierto(false)} className="text-2xl leading-none" aria-label="Cerrar">×</button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {lineas.length === 0 ? <p className="text-[#7d6450]">Aún no agregas nada. Elige del menú.</p> : lineas.map((l) => (
                <div key={l.p.id} className="flex items-center justify-between gap-3">
                  <div><p className="font-medium">{l.p.nombre}</p><p className="text-sm text-[#7d6450]">{pesos(l.p.precio)} c/u</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => agregar(l.p.id, -1)} className="h-7 w-7 rounded-full bg-[#f3e6d0]">−</button>
                    <span className="w-5 text-center">{l.q}</span>
                    <button onClick={() => agregar(l.p.id)} className="h-7 w-7 rounded-full bg-[#f3e6d0]">+</button>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 rounded-full bg-[#f3e6d0] p-1 text-sm">
                {(['recoger', 'domicilio'] as const).map((e) => (
                  <button key={e} onClick={() => setEntrega(e)} className={`rounded-full py-2 ${entrega === e ? 'bg-white font-semibold shadow' : ''}`}>{e === 'recoger' ? 'Paso por él' : 'A domicilio'}</button>
                ))}
              </div>
              <input placeholder="Tu nombre" value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
              {entrega === 'recoger' ? (
                <label className="block text-sm">Hora para recoger
                  <select value={datos.hora} onChange={(e) => setDatos({ ...datos, hora: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-3">
                    {['07:00', '08:00', '09:00', '10:00', '12:00', '14:00', '17:00', '19:00'].map((h) => <option key={h}>{h}</option>)}
                  </select>
                </label>
              ) : (
                <input placeholder="Dirección y colonia" value={datos.direccion} onChange={(e) => setDatos({ ...datos, direccion: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
              )}
              <textarea placeholder="Notas (opcional): sin azúcar, para regalo…" value={datos.notas} onChange={(e) => setDatos({ ...datos, notas: e.target.value })} className="w-full rounded-xl border px-4 py-3" rows={2} />
            </div>
            <div className="space-y-2 border-t p-5">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{pesos(subtotal)}</span></div>
              {entrega === 'domicilio' && <div className="flex justify-between text-sm"><span>Envío</span><span>{pesos(ENVIO)}</span></div>}
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{pesos(total)}</span></div>
              <a href={listo ? whatsapp(mensaje) : undefined} target="_blank" rel="noopener" aria-disabled={!listo}
                className={`mt-2 block rounded-full py-4 text-center font-semibold text-white ${listo ? 'bg-[#1f8f4e]' : 'pointer-events-none bg-neutral-300'}`}>
                Enviar pedido por WhatsApp
              </a>
              {!listo && piezas > 0 && <p className="text-center text-xs text-[#7d6450]">Escribe tu nombre{entrega === 'domicilio' ? ' y dirección' : ''} para continuar.</p>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
