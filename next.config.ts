import type { NextConfig } from 'next';

// Sitio estático publicado en GitHub Pages: epinki07.github.io/servicios
const config: NextConfig = {
  output: 'export',
  basePath: '/servicios',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
