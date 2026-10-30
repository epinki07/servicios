import datos from './paquetes.json';

// Precios e inclusiones vienen de paquetes.json (la misma fuente que usan las propuestas).
export const proveedor = datos.proveedor;
export const paquetes = Object.values(datos.paquetes);
export const condiciones = datos.condiciones;

const telefono = '52' + proveedor.whatsapp.replace(/\D/g, '');
export const whatsapp = (texto: string) => `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

export const servicios = [
  { titulo: 'Páginas para negocios', texto: 'Un sitio claro y rápido en el celular, con tus servicios, horarios, ubicación y un botón directo a WhatsApp.' },
  { titulo: 'Catálogos y menús', texto: 'Tus productos o platillos con precios que tú mismo actualizas, y pedidos que llegan a WhatsApp ya armados.' },
  { titulo: 'Sistemas a la medida', texto: 'Citas en línea, cotizadores o paneles administrativos con usuarios y base de datos, hechos para cómo trabajas.' },
];

export const trabajos = [
  { titulo: 'Atelier Galleta', tipo: 'Concepto · Sitio de marca', texto: 'Sitio editorial para una galletería: escenas animadas al hacer scroll, catálogo de sabores y armado de caja con pedido por WhatsApp.', url: '/servicios/demos/galleteria/', etiqueta: 'Recorrer el sitio' },
  { titulo: 'Molino Panadería', tipo: 'Demo · Catálogo con pedidos', texto: 'Menú en línea con carrito, entrega o recoger en tienda, pedidos por WhatsApp y modo administrador para cambiar precios.', url: '/servicios/demos/panaderia/', etiqueta: 'Probar demo' },
  { titulo: 'Consultorio Raíz', tipo: 'Demo · Sistema de citas', texto: 'Agenda con disponibilidad real, confirmación, Google Calendar, recordatorios por WhatsApp y panel del consultorio.', url: '/servicios/demos/consultorio/', etiqueta: 'Probar demo' },
  { titulo: 'Ceiba Veterinaria', tipo: 'Demo · Página para veterinaria', texto: 'Ejemplo de sitio interactivo para una clínica veterinaria: servicios, urgencias y citas por WhatsApp.', url: '/servicios/demos/veterinaria/', etiqueta: 'Ver demo' },
  { titulo: 'WebTrack 2', tipo: 'Producto propio · Sistema web', texto: 'Aplicación con usuarios, base de datos protegida, reportes y exportación a PDF. Publicada y funcionando.', url: 'https://webtrack-2.pages.dev', etiqueta: 'Abrir aplicación' },
  { titulo: 'SistemaFacturacion', tipo: 'Proyecto técnico · API', texto: 'Backend de facturación con clientes, conceptos e impuestos, documentado y con pruebas automatizadas.', url: 'https://github.com/epinki07/SistemaFacturacion', etiqueta: 'Ver código' },
];

export const pasos = [
  { n: '01', titulo: 'Platicamos', texto: '20 minutos para entender cómo vendes hoy y qué te quita tiempo.' },
  { n: '02', titulo: 'Propuesta', texto: 'En 48 horas recibes 2 opciones con precio cerrado y tiempos.' },
  { n: '03', titulo: 'Construcción', texto: 'Ves avances y tienes 2 rondas de cambios incluidas.' },
  { n: '04', titulo: 'Publicación y soporte', texto: 'Tu sitio en línea y, si quieres, mantenimiento mensual.' },
];

export const preguntas = [
  { p: '¿Necesito saber de tecnología?', r: 'No. Tú me cuentas cómo funciona tu negocio y yo me encargo de lo técnico. Si quieres editar precios o productos, te dejo un panel sencillo.' },
  { p: '¿Ya tengo Facebook e Instagram, para qué una página?', r: 'Las redes atraen gente; la página es el lugar donde tú controlas la información, los precios y los pedidos sin depender del algoritmo.' },
  { p: '¿De quién es el dominio?', r: 'Tuyo. Se registra a nombre de tu negocio desde el inicio.' },
  { p: '¿Qué pasa si después quiero cambios?', r: 'Con la mensualidad los cambios de contenido están incluidos. Las funciones nuevas se cotizan aparte, sin sorpresas.' },
  { p: '¿Cómo se paga?', r: '50% para iniciar y 50% al entregar. La mensualidad empieza cuando tu sitio ya está publicado.' },
];
