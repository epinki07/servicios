'use client';

import { useEffect, useRef, useState } from 'react';

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
// Progreso de 0 a 1 entre dos puntos de p (para encadenar animaciones en una misma escena).
export const tramo = (p: number, desde: number, hasta: number) => clamp((p - desde) / (hasta - desde));

/** Progreso de scroll (0 a 1) mientras una sección alta pasa por la pantalla. */
export function useProgreso<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const medir = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setP(clamp(-r.top / Math.max(1, r.height - window.innerHeight)));
      });
    };
    medir();
    window.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => { window.removeEventListener('scroll', medir); window.removeEventListener('resize', medir); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

/** Se activa una vez cuando el elemento entra en pantalla. */
export function useVisible<T extends HTMLElement>(margen = '0px 0px -15% 0px') {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: margen });
    io.observe(el);
    return () => io.disconnect();
  }, [margen]);
  return [ref, visible] as const;
}

export function Aparece({ children, retraso = 0, className = '' }: { children: React.ReactNode; retraso?: number; className?: string }) {
  const [ref, visible] = useVisible<HTMLDivElement>();
  return (
    <div ref={ref} className={`aparece ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${retraso}ms` }}>
      {children}
    </div>
  );
}

/** Frases que se iluminan una por una al pasar por el centro de la pantalla. */
export function Frases({ frases }: { frases: string[] }) {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [activa, setActiva] = useState(-1);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActiva(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="space-y-[18vh] py-[30vh]">
      {frases.map((f, i) => (
        <p key={f} data-i={i} ref={(el) => { refs.current[i] = el; }}
          className={`frase text-4xl leading-tight font-bold tracking-tight sm:text-6xl ${i <= activa ? 'text-[#F6F3EC]' : 'text-[#2c241f]'}`}>
          {f}
        </p>
      ))}
    </div>
  );
}

/** Pantalla que muestra una demo real dentro de un marco (laptop o teléfono). */
function Pantalla({ src, ancho }: { src: string; ancho: number }) {
  // El iframe se dibuja más grande y se escala, para que la demo se vea en su diseño de escritorio o celular.
  const escala = 1 / ancho;
  return (
    <iframe src={src} title="Demo" loading="lazy" tabIndex={-1} aria-hidden
      className="pointer-events-none absolute top-0 left-0 origin-top-left border-0 bg-white"
      style={{ width: `${ancho * 100}%`, height: `${ancho * 100}%`, transform: `scale(${escala})` }} />
  );
}

export function Laptop({ src, video, poster }: { src?: string; video?: string; poster?: string }) {
  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-t-[1.4rem] border-[10px] border-b-[14px] border-[#1d1d1f] bg-black shadow-2xl">
        {video
          ? <video src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover object-top" />
          : src && <Pantalla src={src} ancho={2} />}
      </div>
      <div className="relative mx-auto h-4 w-[112%] -translate-x-[5.4%] rounded-b-2xl bg-gradient-to-b from-[#d5d5d7] to-[#9a9a9e]">
        <div className="mx-auto h-1.5 w-1/6 rounded-b-lg bg-[#7d7d82]" />
      </div>
    </div>
  );
}

export function Telefono({ src }: { src: string }) {
  return (
    <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.6rem] border-[10px] border-[#1d1d1f] bg-black shadow-2xl">
      <div className="absolute top-2 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <Pantalla src={src} ancho={1.25} />
    </div>
  );
}

/** Escena fija: la laptop se endereza y crece mientras cambian los textos. */
export function EscenaLaptop({ src, video, poster, enlace, textos }: { src?: string; video?: string; poster?: string; enlace?: string; textos: string[] }) {
  const [ref, p] = useProgreso<HTMLElement>();
  const entrada = tramo(p, 0, 0.35);
  return (
    <section ref={ref} className="relative h-[320vh] bg-[#110D0B] text-[#F6F3EC]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 pt-14">
        <div className="relative mb-6 h-20 w-full max-w-3xl text-center sm:h-28">
          {textos.map((t, i) => {
            const n = textos.length, centro = (i + 0.5) / n;
            const o = 1 - Math.min(1, Math.abs(p - centro) * n * 2.4);
            return (
              <h2 key={t} className="absolute inset-x-0 text-2xl font-bold tracking-tight sm:text-5xl"
                style={{ opacity: Math.max(0, o), transform: `translateY(${(p - centro) * -120}px)` }}>{t}</h2>
            );
          })}
        </div>
        <div className="w-full" style={{ perspective: '1600px', maxWidth: 'min(56rem, 105vh)' }}>
          <div style={{ transform: `rotateX(${(1 - entrada) * 38}deg) scale(${0.72 + entrada * 0.28}) translateY(${(1 - entrada) * 60}px)`, transformOrigin: 'center bottom' }}>
            <Laptop src={src} video={video} poster={poster} />
          </div>
        </div>
        {enlace && (
          <a href={enlace} target="_blank" rel="noopener" style={{ opacity: tramo(p, 0.3, 0.45) }}
            className="mt-6 rounded-full border border-[#C89D66]/50 px-6 py-2.5 text-sm text-[#E9CFA6] transition hover:bg-[#C89D66]/10">
            Recorrer este sitio →
          </a>
        )}
      </div>
    </section>
  );
}

/** Panel de estadísticas animado (datos ilustrativos). */
export function Estadisticas() {
  const [ref, visible] = useVisible<HTMLDivElement>('0px 0px -25% 0px');
  const metricas = [
    { etiqueta: 'Visitas este mes', valor: 1284 },
    { etiqueta: 'Clics a WhatsApp', valor: 312 },
    { etiqueta: 'Pedidos y citas', valor: 96 },
  ];
  const barras = [38, 52, 45, 70, 64, 88, 57];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let raf = 0; const t0 = performance.now();
    const paso = (t: number) => { const k = Math.min(1, (t - t0) / 1600); setN(1 - Math.pow(1 - k, 3)); if (k < 1) raf = requestAnimationFrame(paso); };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [visible]);
  return (
    <div ref={ref} className="rounded-3xl border border-[#C89D66]/20 bg-gradient-to-b from-[#1d1612] to-[#110D0B] p-6 text-[#F6F3EC] sm:p-10">
      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>Panel de tu negocio</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs">Datos de ejemplo</span>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        {metricas.map((m) => (
          <div key={m.etiqueta}>
            <p className="text-2xl font-extrabold tabular-nums sm:text-4xl">{Math.round(m.valor * n).toLocaleString('es-MX')}</p>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">{m.etiqueta}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex h-40 items-end gap-3">
        {barras.map((b, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="w-full rounded-t-lg bg-gradient-to-t from-[#6b4a2a] to-[#E9CFA6] transition-[height] duration-1000 ease-out"
              style={{ height: visible ? `${b}%` : '4%', transitionDelay: `${i * 90}ms` }} />
            <span className="text-[10px] text-neutral-500">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-neutral-400">Hora con más visitas: <b className="text-[#E9CFA6]">1 a 3 pm</b> · Producto más visto: <b className="text-[#E9CFA6]">Galleta de chispas</b></p>
    </div>
  );
}

/** Escena fija: el teléfono sube mientras aparecen las funciones a los lados. */
export function EscenaTelefono({ src, puntos }: { src: string; puntos: string[] }) {
  const [ref, p] = useProgreso<HTMLElement>();
  const sube = tramo(p, 0, 0.3);
  return (
    <section ref={ref} className="relative h-[260vh] bg-[#EDE6D8] text-[#110D0B]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-12">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div className="order-2 space-y-3 md:order-1 md:space-y-5">
            {puntos.map((t, i) => {
              const o = tramo(p, 0.2 + i * 0.15, 0.32 + i * 0.15);
              return (
                <p key={t} className="text-xl font-bold tracking-tight sm:text-4xl" style={{ opacity: 0.12 + o * 0.88, transform: `translateX(${(1 - o) * -24}px)` }}>{t}</p>
              );
            })}
          </div>
          <div className="order-1 mx-auto md:order-2" style={{ width: 'min(300px, 34vh, 56vw)', transform: `translateY(${(1 - sube) * 45}vh) rotate(${(1 - sube) * -8}deg)` }}>
            <Telefono src={src} />
          </div>
        </div>
      </div>
    </section>
  );
}
