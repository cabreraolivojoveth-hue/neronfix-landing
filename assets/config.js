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
   --------------------------------------------------------------------------
   Verificadas contra los sistemas en producción el 24/08/2026. No inventar
   rutas nuevas. El sistema de celulares vive en `storephone`, no en
   `celulares`: ese subdominio contestaba 404 y dejaba el botón muerto.
   Terapias todavía no tiene subdominio propio, así que su acceso se atiende
   por WhatsApp en lugar de dejar un enlace que no abre.
   -------------------------------------------------------------------------- */
const ROUTES = {
  home: 'index.html',
  faq: 'faq.html',
  contacto: 'contacto.html',
  autos: 'https://autos.neronfix.com',
  celulares: 'https://storephone.neronfix.com',
  terapias: '',
  /* Documentos legales. Cuando existan, pon aquí su URL y aparecerán
     automáticamente en el footer. */
  terminos: '',
  privacidad: '',
};

/* --------------------------------------------------------------------------
   SISTEMAS
   --------------------------------------------------------------------------
   `price` es el precio del plan Normal de cada sistema (ver PLANS).
   Si un sistema no tiene `url`, su botón lleva a WhatsApp.
   -------------------------------------------------------------------------- */
const SYSTEMS = [
  {
    id: 'celulares',
    icon: 'i-mobile',
    cat: 'Tiendas de celulares',
    name: 'Celulares',
    desc: 'Punto de venta con IMEI, créditos con enganche, reparaciones, garantías y tu tienda en línea, en un solo sistema.',
    feats: [
      'Punto de venta, tickets y corte de caja',
      'Inventario de equipos por IMEI y accesorios',
      'Créditos con enganche, recargo y abonos',
      'Reparaciones, garantías y tienda en línea',
    ],
    price: 349,
    period: 'mes',
    priceNote: 'Desde',
    trial: 'Prueba gratis',
    cta: 'Ver sistema de Celulares',
    url: ROUTES.celulares,
    event: 'system_cellphones_click',
    mockup: 'mk-celulares',
  },
  {
    id: 'autos',
    icon: 'i-car',
    cat: 'Agencias y lotes de autos',
    name: 'Autos',
    desc: 'Controla tu inventario de unidades, genera contratos y da seguimiento a la cobranza de cada crédito.',
    feats: [
      'Inventario de autos con fotos y gastos',
      'Contratos de compraventa en PDF',
      'Ventas de contado y a crédito con pagarés',
      'Cobranza, mora y recordatorios por WhatsApp',
    ],
    price: 849,
    period: 'mes',
    priceNote: 'Desde',
    trial: 'Prueba gratis',
    cta: 'Ver sistema de Autos',
    url: ROUTES.autos,
    event: 'system_autos_click',
    mockup: 'mk-autos',
  },
  {
    id: 'terapias',
    icon: 'i-sparkles',
    cat: 'Centros de terapias y spa',
    name: 'Terapias',
    desc: 'Agenda sin empalmes, expediente de cada paciente, cursos con cupo, punto de venta y caja, para centros de terapias y masajes.',
    feats: [
      'Agenda por terapeuta, sin citas encimadas',
      'Expediente con alergias y contraindicaciones',
      'Cursos y talleres con cupo e inscripciones',
      'Punto de venta, caja y reportes',
    ],
    price: 299,
    period: 'mes',
    priceNote: 'Desde',
    trial: 'Prueba gratis',
    cta: 'Pregunta por Terapias',
    url: ROUTES.terapias,
    event: 'system_therapies_click',
    mockup: 'mk-terapias',
  },
];

/* --------------------------------------------------------------------------
   PLANES · tres por sistema, tres formas de pago
   --------------------------------------------------------------------------
   El anual siempre equivale a 10 mensualidades (dos meses gratis).
   El trimestral ronda el 10% de descuento sobre tres meses.
   Precios en pesos mexicanos, IVA incluido.

   Las funciones listadas están verificadas una por una contra el código de
   cada sistema. No agregar aquí nada que el sistema no haga todavía.
   -------------------------------------------------------------------------- */
const PLANS = {
  celulares: [
    {
      id: 'celulares_normal',
      nombre: 'Normal',
      desc: 'Vender, cobrar y saber cuánto ganaste',
      precios: { mensual: 349, trimestral: 939, anual: 3490 },
      limite: '2 usuarios · 1 sucursal',
      feats: [
        'Punto de venta con IMEI y código de barras',
        'Corte de caja con conteo de billetes',
        'Créditos con enganche, recargo y abonos',
        'Inventario con costo real y utilidad por pieza',
        'Garantías, gastos e ingresos',
        'Tablero con 11 indicadores y su desglose',
      ],
    },
    {
      id: 'celulares_premium',
      nombre: 'Premium',
      popular: true,
      desc: 'La tienda completa, dentro y fuera',
      precios: { mensual: 649, trimestral: 1749, anual: 6490 },
      limite: '5 usuarios',
      feats: [
        'Todo lo del Normal',
        'Tienda en línea con apartados y cupones',
        'Reparaciones con firmas de recepción y entrega',
        'Incidencias postventa y devoluciones',
        'Compras, proveedores y comisiones',
        'Metas por vendedor y respaldo diario',
      ],
    },
    {
      id: 'celulares_pro',
      nombre: 'Pro',
      desc: 'Varias manos, un solo control',
      precios: { mensual: 1099, trimestral: 2949, anual: 10990 },
      limite: 'Usuarios y sucursales sin límite',
      feats: [
        'Todo lo del Premium',
        'Socios y comisionistas con inventario compartido',
        'Auditoría: quién cambió qué y cuándo',
        'Agente de WhatsApp que contesta solo',
        'Dominio propio y roles a la medida',
        'Soporte prioritario',
      ],
    },
  ],

  autos: [
    {
      id: 'autos_normal',
      nombre: 'Normal',
      desc: 'El lote ordenado',
      precios: { mensual: 849, trimestral: 2290, anual: 8490 },
      limite: '1 usuario',
      feats: [
        'Inventario de unidades con fotos y gastos',
        'Clientes con aval y semáforo de cobranza',
        'Venta de contado y a crédito con enganche',
        'Pagarés automáticos o con pagos irregulares',
        'Estado de cuenta en PDF con folio',
        'Reportes de crédito y vencimientos',
      ],
    },
    {
      id: 'autos_premium',
      nombre: 'Premium',
      popular: true,
      desc: 'Cobrar sin perseguir',
      precios: { mensual: 1390, trimestral: 3749, anual: 13900 },
      limite: '3 usuarios',
      feats: [
        'Todo lo del Normal',
        'Los 8 reportes, con ganancia por unidad',
        'Contratos editables sin programar',
        'Mora automática por día de atraso',
        'Recordatorios de cobranza por WhatsApp',
        'Catálogo público compartible por auto',
      ],
    },
    {
      id: 'autos_pro',
      nombre: 'Pro',
      desc: 'Con inteligencia artificial',
      precios: { mensual: 2190, trimestral: 5890, anual: 21900 },
      limite: 'Usuarios sin límite',
      feats: [
        'Todo lo del Premium',
        'Dicta gastos y abonos por voz',
        'Escanea la INE y llena la ficha sola',
        'Escanea el documento del auto',
        'Tu logo en el sistema y en todos los PDFs',
        'Cuatro roles, pesos y dólares, soporte prioritario',
      ],
    },
  ],

  terapias: [
    {
      id: 'terapias_normal',
      nombre: 'Normal',
      desc: 'Tu agenda en orden',
      precios: { mensual: 299, trimestral: 799, anual: 2990 },
      limite: '2 profesionales',
      feats: [
        'Agenda en día, semana y mes, sin empalmes',
        'La hora de fin se calcula sola',
        'Ficha del paciente y contacto de emergencia',
        'Servicios con precio y promoción vigente',
        'Cobro de servicios y productos, pago mixto',
        'Caja con corte de efectivo',
      ],
    },
    {
      id: 'terapias_premium',
      nombre: 'Premium',
      popular: true,
      desc: 'El centro completo',
      precios: { mensual: 649, trimestral: 1749, anual: 6490 },
      limite: '6 profesionales',
      feats: [
        'Todo lo del Normal',
        'Expediente clínico con aviso de alergias',
        'Notas de cada sesión',
        'Cursos y talleres con cupo y material',
        'Productos con existencias y proveedores',
        'Reportes en nueve pestañas y cotizaciones',
      ],
    },
    {
      id: 'terapias_pro',
      nombre: 'Pro',
      desc: 'Varias terapeutas, un solo centro',
      precios: { mensual: 1290, trimestral: 3490, anual: 12900 },
      limite: 'Profesionales sin límite',
      feats: [
        'Todo lo del Premium',
        'Mensajes por paciente con plantillas',
        'Recepción no lee lo clínico',
        'Roles y permisos a la medida',
        'Bitácora de auditoría y respaldos',
        'Verificación en dos pasos, soporte prioritario',
      ],
    },
  ],
};

/* Formas de pago que ofrece la landing. `factor` sólo se usa para el texto
   de ahorro; el precio real sale de PLANS. */
const PERIODS = [
  { id: 'mensual',    label: 'Mensual',    unidad: 'mes' },
  { id: 'trimestral', label: 'Trimestral', unidad: '3 meses', nota: 'Ahorra 10%' },
  { id: 'anual',      label: 'Anual',      unidad: 'año',     nota: '2 meses gratis' },
];

/* --------------------------------------------------------------------------
   MÉTRICAS
   --------------------------------------------------------------------------
   Sólo se publican datos verificables contra el producto.
   `value` puede llevar sufijo/prefijo; `count` es el número que anima.

   PLACEHOLDERS (desactivados a propósito): cuando tengas las cifras reales
   de negocios activos o ventas procesadas, cámbialas y pon enabled:true.
   NO las publiques con números inventados.
   -------------------------------------------------------------------------- */
const STATS = [
  { enabled:true,  icon:'i-grid',   count:3,   prefix:'',  suffix:'',      label:'Sistemas: Celulares, Autos y Terapias' },
  { enabled:true,  icon:'i-cash',   count:299, prefix:'$', suffix:'',      label:'Desde, al mes, con IVA incluido' },
  { enabled:true,  icon:'i-gift',   count:3,   prefix:'',  suffix:'',      label:'Formas de pago: mensual, trimestral y anual' },
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
    a: 'Neron es una plataforma mexicana de gestión para negocios, con tres sistemas hechos cada uno para un giro: Neron Celulares para tiendas de celulares, Neron Autos para agencias y lotes de autos, y Neron Terapias para centros de terapias y masajes. Los tres manejan inventario o agenda, ventas, cobranza y reportes.',
  },
  {
    q: '¿Cuánto cuesta y qué formas de pago hay?',
    a: 'Cada sistema tiene tres planes: Normal, Premium y Pro. Puedes pagarlos al mes, cada tres meses con 10% de descuento, o al año con dos meses gratis. Los precios que ves en la sección de precios ya llevan IVA incluido y no hay permanencia forzosa.',
  },
  {
    q: '¿Puedo probarlo gratis antes de pagar?',
    a: 'Sí. Escríbenos por WhatsApp, te damos de alta con tu periodo de prueba y no necesitas tarjeta para empezar.',
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
    a: 'Si tienes tienda de celulares con equipos, accesorios, reparaciones y créditos, Neron Celulares. Si vendes autos y necesitas contratos y cobranza de créditos, Neron Autos. Si das masajes o terapias y trabajas con citas, expedientes y cursos, Neron Terapias. Si tienes dudas, escríbenos y te orientamos sin compromiso.',
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
   system_therapies_click · plan_click · plan_product_click · plan_period_click
   faq_open · login_click · nav_click · final_cta_click · mobile_bar_click      */

window.NERON_CONFIG = {
  CONTACT_CONFIG, ROUTES, SYSTEMS, PLANS, PERIODS, STATS,
  BENEFITS, TRUST, FAQS, NAV, ANALYTICS_CONFIG, waLink,
};
