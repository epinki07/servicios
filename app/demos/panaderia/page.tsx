import type { Metadata } from 'next';
import Panaderia from './Panaderia';

export const metadata: Metadata = {
  title: 'Molino · Panadería de barrio (demo)',
  description: 'Demo de producto: menú en línea, carrito, pedidos por WhatsApp y modo administrador para una panadería.',
};

export default function Pagina() {
  return <Panaderia />;
}
