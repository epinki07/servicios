// Graba un recorrido con scroll suave de una página HTML y lo guarda como cuadros JPG.
// Uso: node grabar.mjs <archivo.html> <ancho> <alto> <segundos>
// Luego: ffmpeg arma el video (ver LEEME del sitio).
import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const [archivo = 'concepto.html', ancho = '1280', alto = '800', segundos = '32'] = process.argv.slice(2);
const FPS = 25, total = Number(segundos) * FPS, pausaInicio = 2 * FPS, pausaFinal = FPS;
rmSync('frames', { recursive: true, force: true });
mkdirSync('frames');

const navegador = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});
const pagina = await navegador.newPage();
await pagina.setViewport({ width: Number(ancho), height: Number(alto) });
await pagina.goto('file://' + resolve(archivo), { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise((r) => setTimeout(r, 2500));

const altura = await pagina.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const recorrido = total - pausaInicio - pausaFinal;
const suave = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2) * 0.15 + k * 0.85;

for (let i = 0; i < total; i++) {
  const k = Math.min(1, Math.max(0, (i - pausaInicio) / recorrido));
  await pagina.evaluate((y) => window.scrollTo(0, y), Math.round(suave(k) * altura));
  await new Promise((r) => setTimeout(r, 45));
  await pagina.screenshot({ path: `frames/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 82 });
}
await navegador.close();
console.log(`cuadros: ${total} · altura recorrida: ${altura}px`);
