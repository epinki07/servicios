# Servicios · Diego Ramírez

Sitio de servicios para negocios de Mérida: páginas web, catálogos con pedidos por WhatsApp y sistemas a la medida.

**En línea:** https://epinki07.github.io/servicios/

## Stack
Next.js 15 (App Router, exportación estática) · React 19 · TypeScript · Tailwind CSS 4 · GitHub Pages

## Estructura
- `app/page.tsx`: la página completa (servicios, trabajo, proceso, precios, preguntas y contacto).
- `lib/contenido.ts`: textos, proyectos y enlaces de WhatsApp.
- `lib/paquetes.json`: precios y condiciones. Es la misma fuente que usa el generador de propuestas; se sincroniza con `npm run sync`.
- `public/demos/`: demos por giro (por ejemplo, veterinaria).

## Uso
```bash
npm install
npm run dev      # desarrollo local
npm run deploy   # compila y publica en GitHub Pages
```
