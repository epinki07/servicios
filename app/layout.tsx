import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://epinki07.github.io'),
  title: 'Diego Ramírez · Páginas web y sistemas para negocios en Mérida',
  description: 'Páginas web, catálogos con pedidos por WhatsApp y sistemas a la medida para negocios de Mérida, Yucatán. Con soporte mensual.',
  openGraph: {
    title: 'Páginas web y sistemas para negocios en Mérida',
    description: 'Sitios, catálogos y sistemas a la medida, con soporte mensual.',
    locale: 'es_MX',
    type: 'website',
    url: '/servicios/',
    images: [{ url: '/servicios/og.png', width: 1200, height: 630, alt: 'Páginas web y sistemas para negocios en Mérida' }],
  },
  twitter: { card: 'summary_large_image', images: ['/servicios/og.png'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500;1,600&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
