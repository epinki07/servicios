import { condiciones, paquetes, pasos, preguntas, proveedor, servicios, trabajos, whatsapp } from '@/lib/contenido';
import { Aparece, EscenaLaptop, EscenaTelefono, Estadisticas, Frases } from '@/components/animacion';

const msgInicial = 'Hola Diego, vi tu página y me interesa una página o sistema para mi negocio.';
const pesos = (n: number) => '$' + n.toLocaleString('es-MX');
const titular = ['Tus', 'clientes', 'ya', 'te', 'buscan', 'en', 'internet.'];

function Etiqueta({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${claro ? 'text-oro' : 'text-[#9a6f3c]'}`}>{children}</p>;
}

export default function Inicio() {
  return (
    <main className="overflow-x-clip">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#110D0B]/70 text-[#F6F3EC] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#" className="font-semibold tracking-tight">Diego Ramírez<span className="text-neutral-500"> · web</span></a>
          <div className="hidden gap-7 text-xs text-neutral-300 md:flex">
            <a href="#servicios" className="hover:text-[#F6F3EC]">Servicios</a>
            <a href="#trabajo" className="hover:text-[#F6F3EC]">Demos</a>
            <a href="#precios" className="hover:text-[#F6F3EC]">Precios</a>
            <a href="#preguntas" className="hover:text-[#F6F3EC]">Preguntas</a>
          </div>
          <a href={whatsapp(msgInicial)} target="_blank" rel="noopener" className="rounded-full bg-[#F6F3EC] px-4 py-1.5 text-xs font-semibold text-[#110D0B]">Hablemos</a>
        </nav>
      </header>

      {/* Portada */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#110D0B] px-4 text-center text-[#F6F3EC]">
        <div className="brillo pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="relative">
          <p className="entra text-sm text-neutral-400" style={{ animationDelay: '0ms' }}>Páginas web y sistemas · {proveedor.ciudad}</p>
          <h1 className="mt-6 text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-7xl md:text-8xl">
            {titular.map((p, i) => (
              <span key={i} className="entra inline-block" style={{ animationDelay: `${150 + i * 110}ms` }}>{p}&nbsp;</span>
            ))}
            <br />
            <span className="entra inline-block" style={{ animationDelay: '1050ms' }}><span className="texto-degradado font-serif font-medium italic">¿Qué encuentran?</span></span>
          </h1>
          <p className="entra mx-auto mt-8 max-w-xl text-lg text-neutral-400" style={{ animationDelay: '1350ms' }}>
            Hago que tu negocio se vea, venda y se organice mejor en internet. A tu medida, con soporte cada mes.
          </p>
          <div className="entra mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: '1550ms' }}>
            <a href={whatsapp(msgInicial)} target="_blank" rel="noopener" className="rounded-full bg-[#F6F3EC] px-7 py-3 text-sm font-semibold text-[#110D0B] transition hover:scale-105">Platiquemos</a>
            <a href="#trabajo" className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold transition hover:bg-[#F6F3EC]/10">Ver demos</a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-neutral-500"><span className="rebote inline-block">↓</span> Desliza</div>
      </section>

      {/* Escena 1: la laptop con la demo real de la panadería */}
      <EscenaLaptop video="/servicios/video/concepto.mp4" poster="/servicios/video/concepto.jpg" enlace="/servicios/demos/galleteria/" textos={['Una página que se siente como tu marca.', 'Que cuenta la historia de tu producto.', 'Y recibe pedidos a cualquier hora.']} />

      {/* Frases que crean la necesidad */}
      <section className="bg-[#110D0B] px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Frases frases={[
            'Cada mensaje sin contestar es un cliente que se va con otro.',
            'Deja de responder «¿qué precio tiene?» cincuenta veces al día.',
            'Tu negocio abierto 24/7, aunque tú estés cerrado.',
            'Te devuelvo las estadísticas de tu negocio.',
            'Y el tiempo para lo que de verdad importa.',
          ]} />
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-[#110D0B] px-4 pb-32 text-[#F6F3EC] sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Aparece>
            <Etiqueta claro>Datos, no corazonadas</Etiqueta>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Sabe qué funciona.<br /><span className="font-serif font-medium italic text-oro">y qué no.</span></h2>
            <p className="mt-6 max-w-md text-lg text-neutral-400">Cuántas personas te visitan, qué ven, a qué hora y cuántas te escriben. Todo en un panel claro, para decidir con números y no a ciegas.</p>
          </Aparece>
          <Aparece retraso={150}><Estadisticas /></Aparece>
        </div>
      </section>

      {/* Escena 2: el teléfono con la agenda del consultorio */}
      <EscenaTelefono src="/servicios/demos/consultorio/" puntos={[
        'Tu agenda se llena sola.',
        'Confirmaciones automáticas.',
        'Recordatorios por WhatsApp.',
        'Y un panel para verlo todo.',
      ]} />

      {/* Servicios */}
      <section id="servicios" className="bg-[#F6F3EC] px-4 py-28 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Aparece>
            <Etiqueta>Servicios</Etiqueta>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Hecho a la medida <span className="font-serif font-medium italic text-[#9a6f3c]">de cómo trabajas.</span></h2>
          </Aparece>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {servicios.map((s, i) => (
              <Aparece key={s.titulo} retraso={i * 120}>
                <div className="tarjeta h-full rounded-3xl bg-[#EDE6D8] p-8">
                  <span className="text-sm font-semibold text-gris">0{i + 1}</span>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight">{s.titulo}</h3>
                  <p className="mt-3 text-gris">{s.texto}</p>
                </div>
              </Aparece>
            ))}
          </div>
        </div>
      </section>

      {/* Demos y proyectos */}
      <section id="trabajo" className="bg-[#EDE6D8] px-4 py-28 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Aparece>
            <Etiqueta>Pruébalo tú</Etiqueta>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">No te lo cuento.<br /><span className="font-serif font-medium italic text-[#9a6f3c]">te lo enseño funcionando.</span></h2>
          </Aparece>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trabajos.map((t, i) => (
              <Aparece key={t.titulo} retraso={(i % 3) * 120}>
                <a href={t.url} target="_blank" rel="noopener" className="tarjeta group flex h-full flex-col rounded-3xl bg-[#F6F3EC] p-7">
                  <p className="text-xs font-medium uppercase tracking-wider text-gris">{t.tipo}</p>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight">{t.titulo}</h3>
                  <p className="mt-2 flex-1 text-gris">{t.texto}</p>
                  <span className="mt-6 text-sm font-semibold">{t.etiqueta} <span className="inline-block transition group-hover:translate-x-1">→</span></span>
                </a>
              </Aparece>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-[#F6F3EC] px-4 py-28 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Aparece>
            <Etiqueta>Proceso</Etiqueta>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">De la idea a tu página, en 4 pasos.</h2>
          </Aparece>
          <ol className="mt-14 grid gap-10 md:grid-cols-4">
            {pasos.map((p, i) => (
              <Aparece key={p.n} retraso={i * 120}>
                <li className="border-t-2 border-[#110D0B] pt-6">
                  <span className="text-5xl font-extrabold text-neutral-200">{p.n}</span>
                  <h3 className="mt-3 text-lg font-bold">{p.titulo}</h3>
                  <p className="mt-2 text-sm text-gris">{p.texto}</p>
                </li>
              </Aparece>
            ))}
          </ol>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="bg-[#110D0B] px-4 py-28 text-[#F6F3EC] sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Aparece>
            <Etiqueta claro>Precios</Etiqueta>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Claros. <span className="font-serif font-medium italic text-oro">sin letras chiquitas.</span></h2>
            <p className="mt-4 text-neutral-400">Precios de referencia en pesos. Cada proyecto se cotiza a tu medida.</p>
          </Aparece>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {paquetes.map((q, i) => (
              <Aparece key={q.nombre} retraso={i * 120}>
                <div className={`tarjeta flex h-full flex-col rounded-3xl p-8 ${i === 1 ? 'bg-[#F6F3EC] text-[#110D0B]' : 'border border-white/15 bg-[#1a1411]'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{q.nombre}</h3>
                    {i === 1 && <span className="rounded-full bg-[#110D0B] px-3 py-1 text-xs font-semibold text-[#F6F3EC]">El más pedido</span>}
                  </div>
                  <p className="mt-6 text-5xl font-extrabold tracking-tight">{i === 2 && <span className="text-2xl font-bold">desde </span>}{pesos(q.precio)}</p>
                  <p className={`mt-2 text-sm ${i === 1 ? 'text-gris' : 'text-neutral-400'}`}>+ {pesos(q.mensual)} al mes · {q.dias}</p>
                  <ul className="mt-8 flex-1 space-y-3 text-sm">
                    {q.incluye.map((x) => <li key={x} className="flex gap-3"><span>✓</span>{x}</li>)}
                  </ul>
                  <a href={whatsapp(`Hola Diego, me interesa el paquete ${q.nombre}.`)} target="_blank" rel="noopener"
                    className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition hover:scale-[1.02] ${i === 1 ? 'bg-[#110D0B] text-[#F6F3EC]' : 'bg-[#F6F3EC] text-[#110D0B]'}`}>
                    Quiero este
                  </a>
                </div>
              </Aparece>
            ))}
          </div>
          <ul className="mt-10 grid gap-2 text-sm text-neutral-500 sm:grid-cols-2">
            {condiciones.filter((c) => !c.includes('propuesta')).map((c) => <li key={c}>· {c}</li>)}
          </ul>
        </div>
      </section>

      {/* Preguntas */}
      <section id="preguntas" className="bg-[#F6F3EC] px-4 py-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Aparece>
            <Etiqueta>Preguntas</Etiqueta>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Lo que todos preguntan.</h2>
          </Aparece>
          <div className="mt-12 divide-y divide-linea border-y border-linea">
            {preguntas.map((f) => (
              <details key={f.p} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
                  {f.p}<span className="text-2xl text-gris transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-gris">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="relative overflow-hidden bg-[#110D0B] px-4 py-36 text-center text-[#F6F3EC] sm:px-6">
        <div className="brillo pointer-events-none absolute top-1/2 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <Aparece className="relative">
          <h2 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">Tu competencia ya está en internet.<br /><span className="texto-degradado font-serif font-medium italic">¿y tú?</span></h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-neutral-400">Cuéntame qué vendes y cómo te llegan los clientes. Te respondo con una idea concreta, sin compromiso.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={whatsapp(msgInicial)} target="_blank" rel="noopener" className="rounded-full bg-[#F6F3EC] px-7 py-3 text-sm font-semibold text-[#110D0B] transition hover:scale-105">WhatsApp {proveedor.whatsapp}</a>
            <a href={`mailto:${proveedor.correo}`} className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold transition hover:bg-[#F6F3EC]/10">{proveedor.correo}</a>
          </div>
        </Aparece>
      </section>

      <footer className="border-t border-white/10 bg-[#110D0B] text-neutral-500">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs sm:px-6">
          <p>© {new Date().getFullYear()} {proveedor.nombre} · {proveedor.ciudad}</p>
          <div className="flex gap-5">
            <a href="https://www.linkedin.com/in/diego-ramirez-magana-backend/" target="_blank" rel="noopener" className="hover:text-[#F6F3EC]">LinkedIn</a>
            <a href="https://github.com/epinki07" target="_blank" rel="noopener" className="hover:text-[#F6F3EC]">GitHub</a>
            <a href="https://epinki07.github.io/portfolio/" target="_blank" rel="noopener" className="hover:text-[#F6F3EC]">Portafolio</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
