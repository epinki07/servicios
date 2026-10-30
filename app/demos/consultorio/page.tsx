import type { Metadata } from 'next';
import Consultorio from './Consultorio';

export const metadata: Metadata = {
  title: 'Consultorio Raíz · Agenda en línea (demo)',
  description: 'Demo de producto: agenda de citas con disponibilidad, confirmación, Google Calendar, recordatorios por WhatsApp y panel del consultorio.',
};

export default function Pagina() {
  return <Consultorio />;
}
