/* ==========================================================================
   NERON · Configuración central
   --------------------------------------------------------------------------
   TODO el contenido editable de la landing vive aquí. Para cambiar precios,
   textos, enlaces, métricas o preguntas frecuentes NO hay que tocar el HTML.

   Regla del proyecto: no se publican datos que no sean reales. Cualquier
   métrica sin respaldo debe quedar marcada como PLACEHOLDER y desactivada.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONTACTO
   --------------------------------------------------------------------------
   WhatsApp es el ÚNICO canal de atención y servicio de Neron.
   No se publican correo, formularios ni teléfono fijo como vía de soporte.
   -------------------------------------------------------------------------- */
const CONTACT_CONFIG = {
  /* Número en formato internacional, sólo dígitos (52 + 1 + 10 dígitos).
     Número visible: 663 542 7493 */
  whatsappNumber: '5216635427493',
  whatsappMessage: 'Hola, quiero conocer más sobre Neron',
  /* Cómo se muestra el número en pantalla. */
  whatsappDisplay: '663 542 7493',
  /* Redes sociales: son perfiles de marca, NO canales de atención.
     Deja '' para ocultar el enlace correspondiente. */
  instagram: 'https://www.instagram.com/neron_fix',
  youtube: 'https://www.youtube.com/@neronfix',
};

/* Construye el enlace de WhatsApp desde la configuración de arriba. */
function waLink(message) {
  const n = String(CONTACT_CONFIG.whatsappNumber || '').replace(/\D/g, '');
  const t = encodeURIComponent(message || CONTACT_CONFIG.whatsappMessage || '');
  return 'https://wa.me/' + n + (t ? '?text=' + t : '');
}

/* --------------------------------------------------------------------------
   RUTAS REALES
   Verificadas contra los sistemas en producción. No inventar rutas nuevas.
   -------------------------------------------------------------------------- */
const ROUTES = {
  home: 'index.html',
  faq: 'faq.html',
  contacto: 'contacto.html',
  autos: 'https://autos.neronfix.com',
  celulares: 'https://celulares.neronfix.com',
  caja: 'https://caja.neronfix.com',
  /* API real de planes de Neron Caja (fuente única de precios de Caja). */
  planesApi: 'https://caja.neronfix.com/api/planes',
  /* Documentos legales. Cuando existan, pon aquí su URL y aparecerán
     automáticamente en el footer. */
  terminos: '',
  privacidad: '',
};

/* --------------------------------------------------------------------------
   SISTEMAS
   -------------------------------------------------------------------------- */
const SYSTEMS = [
  {
    id: 'autos',
    icon: 'i-car',
    cat: 'Agencias y lotes de autos',
    name: 'Autos',
    desc: 'Controla tu inventario de unidades, genera contratos y da seguimiento a la cobranza de cada crédito.',
    feats: [
      'Inventario de autos con fotos',
      'Contratos de compraventa en PDF',
      'Ventas de contado y a crédito',
      'Cobranza y recordatorios por WhatsApp',
    ],
    price: 850,
    period: 'mes',
    priceNote: 'Desde',
    trial: '14 días gratis',
    cta: 'Ver sistema de Autos',
    url: ROUTES.autos,
    event: 'system_autos_click',
    mockup: 'mk-autos',
  },
  {
    id: 'celulares',
    icon: 'i-mobile',
    cat: 'Tiendas de celulares',
    name: 'Celulares',
    desc: 'Punto de venta, inventario de equipos y créditos con contrato y pagaré, en un solo sistema.',
    feats: [
      'Punto de venta y tickets',
      'Inventario de equipos y accesorios',
      'Créditos con contrato y pagaré',
      'Corte de caja y reportes',
    ],
    price: 360,
    period: 'mes',
    priceNote: 'Desde',
    trial: 'Prueba gratis',
    cta: 'Ver sistema de Celulares',
    url: ROUTES.celulares,
    event: 'system_cellphones_click',
    mockup: 'mk-celulares',
  },
  {
    id: 'caja',
    icon: 'i-cart',
    cat: 'Cualquier negocio',
    name: 'Caja',
    desc: 'El punto de venta para tiendas, ferreterías, abarrotes y cualquier giro. Empieza en minutos.',
    feats: [
      'Punto de venta y tickets',
      'Inventario y control de stock',
      'Corte de caja, gastos y clientes',
      'Créditos, apartados y garantías',
    ],
    /* El precio de Caja se sincroniza con la API real; este valor es el
       respaldo que se muestra mientras carga o si la API no responde. */
    price: 220,
    period: 'mes',
    priceNote: 'Desde',
    trial: '14 días gratis',
    cta: 'Empezar gratis',
    url: ROUTES.caja,
    event: 'system_pos_click',
    mockup: 'mk-caja',
    livePricing: true,
  },
];

/* --------------------------------------------------------------------------
   PLANES DE NERON CAJA — respaldo local
   La sección de precios consulta ROUTES.planesApi y, si responde, reemplaza
   estos valores. Si la API falla, se muestra este respaldo.
   -------------------------------------------------------------------------- */
const PLANS_FALLBACK = [
  { id:'basico',        periodo:'mensual', nombre:'Básico',   precio:220,  prueba:true,  desc:'Lo esencial para operar',
    feats:['Punto de venta y tickets','Inventario','Corte de caja','Gastos y clientes','1 usuario'] },
  { id:'normal',        periodo:'mensual', nombre:'Normal',   precio:350,  prueba:true,  popular:true, desc:'El más completo',
    feats:['Todo lo del Básico','Tu logo en tickets','Créditos y apartados','Cajeros y garantías','Compras + catálogo en línea'] },
  { id:'avanzado',      periodo:'mensual', nombre:'Avanzado', precio:580,  prueba:false, desc:'Para negocios grandes',
    feats:['Todo lo del Normal','Multisucursal','Almacenes','Reportes avanzados','Listas de precios por cliente'] },
  { id:'normal_anual',  periodo:'anual',   nombre:'Normal',   precio:3500, prueba:false, popular:true, ahorro:700,  desc:'El más completo · 2 meses gratis',
    feats:['Todo lo del plan Normal','Pagas 10 meses, usas 12','Ahorras $700 al año'] },
  { id:'avanzado_anual',periodo:'anual',   nombre:'Avanzado', precio:5800, prueba:false, ahorro:1160, desc:'Para negocios grandes · 2 meses gratis',
    feats:['Todo lo del plan Avanzado','Pagas 10 meses, usas 12','Ahorras $1,160 al año'] },
];

/* --------------------------------------------------------------------------
   MÉTRICAS
   --------------------------------------------------------------------------
   Sólo se publican datos verificables contra el producto o la API.
   `value` puede llevar sufijo/prefijo; `count` es el número que anima.

   PLACEHOLDERS (desactivados a propósito): cuando tengas las cifras reales
   de negocios activos o ventas procesadas, cámbialas y pon enabled:true.
   NO las publiques con números inventados.
   -------------------------------------------------------------------------- */
const STATS = [
  { enabled:true,  icon:'i-grid',   count:3,   prefix:'',  suffix:'',      label:'Sistemas: Autos, Celulares y Caja' },
  { enabled:true,  icon:'i-gift',   count:14,  prefix:'',  suffix:' días', label:'De prueba gratis para empezar' },
  { enabled:true,  icon:'i-cash',   count:220, prefix:'$', suffix:'',      label:'Desde, al mes, con Neron Caja', live:'caja' },
  { enabled:true,  icon:'i-cloud',  count:0,   text:'24/7', label:'Tu negocio en la nube, siempre disponible' },

  /* --- PLACEHOLDERS · requieren datos reales antes de activarse --- */
  { enabled:false, icon:'i-store',  count:0, prefix:'+', suffix:'',  label:'PLACEHOLDER · Negocios activos' },
  { enabled:false, icon:'i-chart',  count:0, prefix:'+', suffix:'',  label:'PLACEHOLDER · Ventas procesadas al mes' },
  { enabled:false, icon:'i-shield', count:0, prefix:'',  suffix:'%', label:'PLACEHOLDER · Tiempo activo garantizado (requiere SLA medido)' },
];

/* --------------------------------------------------------------------------
   BENEFICIOS
   -------------------------------------------------------------------------- */
const BENEFITS = [
  { icon:'i-sparkles', title:'Fácil y elegante',      text:'Creado para usarse sin complicaciones desde el primer día, sin capacitación.' },
  { icon:'i-device',   title:'En cualquier dispositivo', text:'Computadora, tablet o celular. Tu negocio siempre contigo, sin instalar nada.' },
  { icon:'i-lock',     title:'Seguro y privado',      text:'Cada negocio mantiene sus datos protegidos y respaldados en la nube.' },
  { icon:'i-flag',     title:'Hecho en México',       text:'Pensado para las necesidades de los negocios mexicanos. Soporte por WhatsApp.' },
];

/* --------------------------------------------------------------------------
   BARRA DE CONFIANZA (bajo el hero)
   -------------------------------------------------------------------------- */
const TRUST = [
  { icon:'i-shield', title:'Seguro y confiable', text:'Tus datos siempre protegidos' },
  { icon:'i-cloud',  title:'Acceso en la nube',  text:'Desde cualquier dispositivo' },
  { icon:'i-support',title:'Soporte especializado', text:'Estamos contigo siempre' },
];

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES
   Añade o quita objetos y la sección + los datos estructurados de SEO
   se regeneran solos.
   -------------------------------------------------------------------------- */
const FAQS = [
  {
    q: '¿Qué es Neron exactamente?',
    a: 'Neron es una plataforma mexicana de gestión para negocios. Incluye Neron Caja, un punto de venta para cualquier giro (tiendas, ferreterías, abarrotes), y dos sistemas especializados: Neron Autos para agencias y lotes de autos, y Neron Celulares para tiendas de celulares. Todos manejan inventario, ventas, cobranza y reportes.',
  },
  {
    q: '¿Puedo probarlo gratis antes de pagar?',
    a: 'Sí. Los planes Básico y Normal de Neron Caja incluyen 14 días gratis, y Neron Autos también cuenta con periodo de prueba. No necesitas tarjeta para empezar: escríbenos por WhatsApp y te damos de alta.',
  },
  {
    q: '¿Necesito instalar algún programa?',
    a: 'No. Neron funciona en la nube desde el navegador, así que puedes usarlo en computadora, tablet o celular sin instalar nada. Sólo necesitas tu usuario y conexión a internet.',
  },
  {
    q: '¿Mis datos y los de mis clientes están seguros?',
    a: 'Sí. Cada negocio ve únicamente su propia información y todos los datos quedan respaldados en la nube, de modo que no dependes de una sola computadora en tu local.',
  },
  {
    q: '¿Qué sistema me conviene para mi negocio?',
    a: 'Si vendes productos en mostrador de cualquier giro, Neron Caja es la opción. Si vendes autos y necesitas contratos y cobranza de créditos, Neron Autos. Si tienes tienda de celulares con equipos, accesorios y créditos con pagaré, Neron Celulares. Si tienes dudas, escríbenos y te orientamos sin compromiso.',
  },
  {
    q: '¿Puedo cambiar de plan más adelante?',
    a: 'Sí. Escríbenos por WhatsApp y te ayudamos a mover tu cuenta al plan que necesites conforme crezca tu negocio.',
  },
  {
    q: '¿Cómo recibo soporte si tengo un problema?',
    a: 'El soporte es directo por WhatsApp, con personas que conocen el sistema. También tienes el Centro de ayuda con guías por tema: facturación, inventario, ventas, configuración y más.',
  },
  {
    q: '¿Neron funciona en todo México?',
    a: 'Sí. Al ser un sistema en la nube puedes usarlo desde cualquier parte del país, y está pensado para la forma de operar y las leyes de aquí.',
  },
];

/* --------------------------------------------------------------------------
   NAVEGACIÓN
   -------------------------------------------------------------------------- */
const NAV = [
  { label:'Inicio',               href:'#inicio' },
  { label:'Sistemas',             href:'#sistemas' },
  { label:'Beneficios',           href:'#beneficios' },
  { label:'Precios',              href:'#precios' },
  { label:'Contacto',             href:'#contacto' },
  { label:'Preguntas frecuentes', href:'#faq' },
];

/* --------------------------------------------------------------------------
   ANALÍTICA
   --------------------------------------------------------------------------
   El proyecto NO tiene ninguna plataforma de analítica instalada todavía.
   Aquí sólo queda el puente: los eventos se emiten a window.dataLayer y, si
   algún día se carga gtag, fbq o similar, se reenvían automáticamente.

   Para conectar Google Tag Manager: pega su script en el <head> del HTML.
   Para conectar Meta Pixel: igual. No hace falta tocar el resto del código.
   -------------------------------------------------------------------------- */
const ANALYTICS_CONFIG = {
  enabled: true,
  /* Ponlo en true para ver cada evento en la consola durante pruebas. */
  debug: false,
  /* Nombre del arreglo global donde se acumulan los eventos. */
  dataLayerName: 'dataLayer',
};

/* Eventos que emite la landing (referencia para quien conecte la analítica):
   hero_cta_click · whatsapp_click · system_autos_click · system_cellphones_click
   system_pos_click · plan_click · faq_open · login_click · nav_click
   final_cta_click · mobile_bar_click                                        */

window.NERON_CONFIG = {
  CONTACT_CONFIG, ROUTES, SYSTEMS, PLANS_FALLBACK, STATS,
  BENEFITS, TRUST, FAQS, NAV, ANALYTICS_CONFIG, waLink,
};
