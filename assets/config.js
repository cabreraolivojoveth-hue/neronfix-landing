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
     Número visible: 646 287 5283 */
  whatsappNumber: '5216462875283',
  whatsappMessage: 'Hola, quiero conocer más sobre Neron',
  /* Cómo se muestra el número en pantalla. */
  whatsappDisplay: '646 287 5283',
  /* Redes sociales: son perfiles de marca, NO canales de atención.
     Deja '' para ocultar el enlace correspondiente. */
  instagram: 'https://www.instagram.com/neron_fix',
  /* El canal @neronfix contestaba 404 (comprobado el 25/09/2026): no existe.
     Cuando haya canal, pon aquí su dirección y vuelve a poner sus enlaces. */
  youtube: '',
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
   Neron One no tiene página pública propia (one.neronfix.com es la cuenta
   privada de su dueño, con el alta cerrada), así que su botón lleva a su
   sección dentro de esta misma página: `#neron-one`.
   Neron Terapias salió de la oferta pública el 25/09/2026 (ver ARCHIVO).
   -------------------------------------------------------------------------- */
const ROUTES = {
  home: 'index.html',
  faq: 'faq.html',
  contacto: 'contacto.html',
  autos: 'https://autos.neronfix.com',
  celulares: 'https://storephone.neronfix.com',
  /* Crear cuenta en Neron POS: la misma entrada del sistema. No existe una
     dirección que abra directo el registro (verificado el 25/09/2026): la
     cuenta se crea escribiendo un correo nuevo en esa pantalla. */
  celularesAlta: 'https://storephone.neronfix.com',
  one: '#neron-one',
  /* Documentos legales. Cuando existan, pon aquí su URL y aparecerán
     automáticamente en el footer. */
  terminos: '',
  privacidad: '',
};

/* --------------------------------------------------------------------------
   SISTEMAS
   --------------------------------------------------------------------------
   El "Tres planes desde $X al mes" de cada tarjeta sale SOLO del plan Normal
   de PLANS: aquí ya no se escribe ningún precio, para que no puedan quedar
   dos números distintos del mismo plan.
   Si un sistema no tiene `url`, su botón lleva a WhatsApp.
   `tipo: 'app'` es un producto del ecosistema que NO es un sistema para un
   giro (Neron One): su tarjeta no habla de planes, no sale en las pestañas de
   precios ni en «Iniciar sesión».
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
    /* AUN NO ESTÁ LISTO: la tarjeta no lleva a ningún sitio, abre la pantalla
       «Disponible próximamente» (PROXIMAMENTE.autos). No sale en «Iniciar
       sesión» ni en las pestañas de precios. Cuando abra, pon `proximamente`
       en false (o bórralo), reactiva `url: ROUTES.autos` y cambia `cta`. */
    proximamente: true,
    cta: 'Disponible próximamente',
    url: '',
    event: 'system_autos_click',
    mockup: 'mk-autos',
  },
  {
    id: 'one',
    tipo: 'app',
    icon: 'i-chart',
    cat: 'Finanzas y organización',
    name: 'Neron One',
    desc: 'Tu información financiera, organizada en un solo lugar. Cada producto Neron hace su trabajo; Neron One reúne el panorama.',
    feats: [
      'Capital disponible y proyectado de tus cuentas',
      'Ingresos, gastos y pagos programados',
      'Pendientes y calendario en el mismo lugar',
      'Reportes del mes y por categoría',
    ],
    cta: 'Conocer Neron One',
    url: ROUTES.one,
    event: 'system_one_click',
    mockup: 'mk-one',
  },
];

/* --------------------------------------------------------------------------
   PLANES · tres por sistema, tres formas de pago
   --------------------------------------------------------------------------
   Desde el 02/10/2026 solo se cobra mes con mes (ver PERIODS): el trimestral
   y el anual de `escalera` ya no se enseñan.
   Precios en pesos mexicanos, IVA incluido.

   Autos usa `escalera(mensual)`. Celulares conserva sus tres cifras escritas
   a mano A PROPÓSITO: son sus precios publicados (el trimestral quedó
   redondeado a números cerrados, $939 y no $942.30) y no se cambian sin que
   el dueño lo decida.

   Las funciones listadas están verificadas una por una contra el código de
   cada sistema. No agregar aquí nada que el sistema no haga todavía.
   -------------------------------------------------------------------------- */
const DESCUENTO_TRIMESTRAL = 0.10;   // 10% sobre tres meses
const MESES_GRATIS_ANUAL = 2;        // el anual son 12 meses pagando 10

/* La escalera de un plan, a partir de SU precio mensual. Cambias el mensual y
   el trimestral y el anual se recalculan solos: no hay tres números
   independientes que puedan quedar distintos. Centavos exactos, sin
   redondear hacia arriba ni hacia abajo. */
function escalera(mensual) {
  const trimestral = Math.round(mensual * 3 * (1 - DESCUENTO_TRIMESTRAL) * 100) / 100;
  const anual = mensual * (12 - MESES_GRATIS_ANUAL);
  return { mensual, trimestral, anual };
}

/* Cifras que se repiten en varios textos: se escriben UNA vez. */
const SUCURSAL_EXTRA = 280;                                  // Pro de Celulares: cada sucursal después de las 2 incluidas
function mxn(n) { return '$' + Number(n).toLocaleString('es-MX'); }

const PLANS = {
  celulares: [
    {
      id: 'celulares_normal',
      nombre: 'Normal',
      desc: 'Vender, cobrar y saber cuánto ganaste',
      precios: { mensual: 450 },
      limite: '2 usuarios · 1 sucursal',
      /* Se contrata solo: crea la cuenta en Neron POS sin pasar por WhatsApp.
         Verificado el 25/09/2026: el alta está abierta, pide correo, código
         y contraseña, y NO pide tarjeta. */
      alta: {
        url: ROUTES.celularesAlta,
        texto: 'Crear cuenta gratis',
        nota: '1 mes gratis · Sin tarjeta',
        como: 'Escribe tu correo en Neron POS y te llega un código para crear tu cuenta.',
      },
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
      precios: { mensual: 750 },
      limite: '5 usuarios · 1 sucursal',
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
      precios: { mensual: 1250 },
      desde: true,
      /* 02/10/2026 (Joveth): el Pro trae 2 sucursales; cada una más, +$280. */
      nota: '+' + mxn(SUCURSAL_EXTRA) + ' al mes por cada sucursal extra',
      limite: 'Usuarios ilimitados · 2 sucursales incluidas',
      feats: [
        'Todo lo del Premium',
        'Socios y comisionistas con inventario compartido',
        'Auditoría: quién cambió qué y cuándo',
        'Historial del negocio, fotografiado solo por periodo',
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
      precios: escalera(550),
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
      precios: escalera(700),
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
      precios: escalera(1200),
      limite: 'Usuarios sin límite',
      feats: [
        'Todo lo del Premium',
        'Escanea la INE y llena la ficha sola',
        'Escanea el documento del auto',
        'Tu logo en el sistema y en todos los PDFs',
        'Cuatro roles, pesos y dólares, soporte prioritario',
      ],
    },
  ],
};

/* --------------------------------------------------------------------------
   ARCHIVO · NERON TERAPIAS (fuera de la oferta pública desde el 25/09/2026)
   --------------------------------------------------------------------------
   El dueño la retiró porque todavía no hay un programa central definido. Se
   guarda aquí, SIN exportar y sin pintarse en ningún lado, por si vuelve:
   devolverla es regresar `sistema` a SYSTEMS y `planes` a PLANS.terapias.
   -------------------------------------------------------------------------- */
const ARCHIVO_TERAPIAS = {
  sistema: {
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
    cta: 'Pregunta por Terapias',
    url: '',
    event: 'system_therapies_click',
    mockup: 'mk-terapias',
  },
  planes: [
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
void ARCHIVO_TERAPIAS;

/* Formas de pago que ofrece la landing. `factor` sólo se usa para el texto
   de ahorro; el precio real sale de PLANS. */
/* Desde el 02/10/2026 solo se cobra mes con mes (decisión de Joveth). Con un
   solo periodo, la página no enseña el selector de forma de pago. */
const PERIODS = [
  { id: 'mensual',    label: 'Mensual',    unidad: 'mes' },
];

/* --------------------------------------------------------------------------
   DESPUÉS DE LOS PLANES · tarjetas extra por sistema (02/10/2026)
   --------------------------------------------------------------------------
   `precio` es el número que se pinta (con `prefijo` +, o sin número si es a la
   medida); `boton` va a WhatsApp con el mensaje del plan. */
const PLAN_EXTRAS = {
  celulares: [
    {
      id: 'celulares_empresarial',
      nombre: 'Empresarial',
      desc: 'Para cadenas y operaciones grandes',
      precioTexto: 'Precio a la medida de tu operación',
      feats: [
        'Todo lo del Pro',
        'Muchas sucursales con un precio especial',
        'Configuración y mejoras pensadas para tu negocio',
        'Atención directa con el fundador',
      ],
      boton: 'Hablemos por WhatsApp',
    },
  ],
};

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
  { enabled:true,  icon:'i-grid',   count:3,   prefix:'',  suffix:'',      label:'Productos: Celulares, Neron One y Autos (próximamente)' },
  /* El "desde" sale del plan Normal más barato de PLANS, no se escribe a mano. */
  { enabled:true,  icon:'i-cash',   count:Math.min.apply(null, Object.keys(PLANS).map(function (k) { return PLANS[k][0].precios.mensual; })),
    prefix:'$', suffix:'', label:'Sistemas desde, al mes, con IVA incluido' },
  /* Apagada el 02/10/2026: ya solo hay pago mensual. */
  { enabled:false, icon:'i-gift',   count:3,   prefix:'',  suffix:'',      label:'Formas de pago: mensual, trimestral y anual' },
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
const FAQS = (function () {
  /* Precios y límites salen de PLANS: si cambian allá, esta sección cambia sola. */
  var cel = PLANS.celulares;
  var normal = mxn(cel[0].precios.mensual), premium = mxn(cel[1].precios.mensual), pro = mxn(cel[2].precios.mensual);
  var wa = CONTACT_CONFIG.whatsappDisplay;
  return [
    {
      q: '¿Qué es Neron?',
      a: 'Un ecosistema mexicano de software. Neron Celulares es el sistema para tiendas de celulares y Neron One organiza tus finanzas y pendientes. Neron Autos, para agencias y lotes de autos, llega próximamente.',
    },
    {
      q: '¿Cuánto cuesta Neron Celulares?',
      a: 'Normal ' + normal + ' al mes, Premium ' + premium + ' y Pro desde ' + pro + ' (incluye 2 sucursales; cada una extra, +' + mxn(SUCURSAL_EXTRA) + '). Para cadenas hay un plan Empresarial a la medida. Precios con IVA incluido, pago mes con mes y sin permanencia forzosa.',
    },
    {
      q: '¿Qué cambia entre un plan y otro?',
      a: 'Normal: punto de venta, caja, créditos e inventario, hasta 2 usuarios. Premium suma tienda en línea, reparaciones y compras, hasta 5 usuarios. Pro suma socios, auditoría y soporte prioritario, con usuarios ilimitados.',
    },
    {
      q: '¿Puedo probarlo gratis?',
      a: 'Sí, sin tarjeta. El plan Normal te da 1 mes gratis y creas tu cuenta tú mismo. Premium y Pro también se prueban gratis: escríbenos por WhatsApp.',
    },
    {
      q: '¿Cuál me conviene?',
      a: 'Si tienes una tienda de celulares, Neron Celulares. Si quieres ordenar tus finanzas, Neron One. Si tienes una agencia o lote de autos, Neron Autos (próximamente). ¿Dudas? Escríbenos y te orientamos sin compromiso.',
    },
    {
      q: '¿Necesito instalar algo?',
      a: 'No. Funciona en la nube desde el navegador, en computadora, tablet o celular, en cualquier parte del país. Solo necesitas internet.',
    },
    {
      q: '¿Mis datos están seguros?',
      a: 'Cada negocio ve únicamente su propia información, protegida y respaldada en la nube.',
    },
    {
      q: '¿Qué es Neron One?',
      a: 'La aplicación para ordenar tus finanzas: cuentas con capital disponible y proyectado, ingresos, gastos, pagos programados, pendientes, calendario y reportes. Hoy trabaja con lo que tú registras; conectarla con los demás sistemas llegará por etapas. Para conocerla, escríbenos por WhatsApp.',
    },
    {
      q: '¿Cuándo estará disponible Neron Autos?',
      a: 'Aún no hay fecha publicada: seguimos terminándolo. Si quieres que te avisemos cuando abra, escríbenos por WhatsApp.',
    },
    {
      q: '¿Puedo cambiar de plan después?',
      a: 'Sí. Escríbenos por WhatsApp y movemos tu cuenta al plan que necesites.',
    },
    {
      q: '¿Cómo recibo soporte?',
      a: 'Directo por WhatsApp (' + wa + '), con personas que conocen el sistema; el plan Pro tiene soporte prioritario. También hay un Centro de ayuda con guías por tema. Instagram (@neron_fix) es solo el perfil de la marca.',
    },
  ];
})();

/* --------------------------------------------------------------------------
   NAVEGACIÓN
   -------------------------------------------------------------------------- */
const NAV = [
  { label:'Celulares',            href:'#sistema-celulares' },
  { label:'Autos',                href:'#sistema-autos' },
  { label:'Neron One',            href:'#neron-one' },
  { label:'Precios',              href:'#precios' },
  { label:'Contacto',             href:'#contacto' },
  { label:'Preguntas frecuentes', href:'#faq' },
];

/* --------------------------------------------------------------------------
   ECOSISTEMA · la sección de Neron One
   --------------------------------------------------------------------------
   La regla: NO afirmar integraciones que todavía no existen. Hoy Neron One
   no recibe datos de Celulares ni de Autos; está diseñado para hacerlo.
   Cuando la conexión exista de verdad, se cambia `nota`.
   -------------------------------------------------------------------------- */
const ECOSISTEMA = {
  eyebrow: 'El ecosistema Neron',
  titulo: 'Cada producto hace su trabajo.',
  tituloMarca: 'Neron One reúne tu información financiera.',
  texto: 'Neron Celulares lleva tu tienda y, próximamente, Neron Autos llevará tu agencia. Neron One es donde ves el panorama: tus cuentas, lo que entra, lo que sale y lo que tienes pendiente.',
  origenes: [
    { icon: 'i-mobile', name: 'Neron Celulares', ancla: '#sistema-celulares' },
    { icon: 'i-car',    name: 'Neron Autos · próximamente', ancla: '#sistema-autos' },
  ],
  centro: { icon: 'i-chart', name: 'Neron One' },
  destino: 'Tu visión financiera',
  hoy: [
    'Cuentas con capital disponible y proyectado',
    'Ingresos, gastos y pagos que se repiten',
    'Pendientes y calendario en el mismo lugar',
    'Reportes del mes y por categoría',
  ],
  nota: 'Neron One está diseñado para recibir los reportes de Neron Celulares y Neron Autos. Esa conexión llega por etapas: hoy organiza la información que tú registras.',
  ctaTexto: 'Quiero conocer Neron One',
  ctaMensaje: 'Hola, quiero conocer Neron One',
};

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
   system_one_click · plan_click · plan_signup_click · plan_product_click · plan_period_click
   faq_open · instagram_click · login_click · nav_click · final_cta_click · mobile_bar_click      */

/* --------------------------------------------------------------------------
   PRÓXIMAMENTE · pantalla que abre la tarjeta de un sistema que aún no sale
   -------------------------------------------------------------------------- */
const PROXIMAMENTE = {
  autos: {
    icon: 'i-car',
    etiqueta: 'Neron Autos',
    titulo: 'Disponible próximamente',
    texto: 'Estamos terminando el sistema para agencias y lotes de autos. Todavía no hay fecha publicada ni acceso; en cuanto esté listo lo verás aquí mismo.',
    lista: 'Lo que viene',
    ctaTexto: 'Avísame cuando esté listo',
    ctaMensaje: 'Hola, quiero que me avisen cuando Neron Autos esté disponible',
    cerrar: 'Entendido',
  },
};

/* --------------------------------------------------------------------------
   MOVIMIENTO · textos de las piezas animadas
   --------------------------------------------------------------------------
   Todo lo de aqui es DECORATIVO o ilustrativo: no son resultados ni cifras de
   ningun negocio. Las piezas animadas son aria-hidden; la informacion real
   vive en SYSTEMS, BENEFITS y en la lista de la seccion `orden`.
   -------------------------------------------------------------------------- */
const MOTION = {
  /* Fragmentos de interfaz que flotan alrededor del mockup del hero */
  heroCards: [
    { icon: 'i-check',  title: 'Venta confirmada',     sub: 'Punto de venta' },
    { icon: 'i-mobile', title: 'Equipo en inventario', sub: 'Por IMEI' },
    { icon: 'i-cash',   title: 'Abono recibido',       sub: 'Créditos y cobranza' },
    { icon: 'i-chart',  title: 'Reporte del mes',      sub: 'Neron One' },
  ],
  /* Recorrido de cada producto al pasar el mouse / tocar su tarjeta */
  flujos: {
    celulares: ['Inventario', 'Venta', 'Accesorios', 'Crédito', 'Cobro'],
    autos:     ['Unidad', 'Financiamiento', 'Expediente', 'Venta', 'Seguimiento'],
    one:       ['Dinero', 'Flujo', 'Control', 'Organización'],
  },
  /* Franja tipografica gigante que se desliza con el scroll (decorativa) */
  marquee: ['Orden', 'Control', 'Imagen profesional', 'Crecimiento'],
  /* Seccion "del desorden al control" */
  orden: {
    eyebrow: 'Todo en un solo lugar',
    titulo: 'Del desorden',
    tituloMarca: 'al control',
    texto: 'Ventas, inventario, créditos, cobranza y reportes dejan de vivir en hojas y mensajes sueltos. Cada cosa en su lugar, a la vista.',
    puntos: [
      { icon: 'i-cart',  title: 'Punto de venta',        text: 'Cobra, imprime el ticket y cierra la caja.' },
      { icon: 'i-box',   title: 'Control de inventario', text: 'Cada equipo y accesorio, con su estado.' },
      { icon: 'i-cash',  title: 'Créditos y cobranza',   text: 'Enganche, abonos y fechas de pago claras.' },
      { icon: 'i-chart', title: 'Reportes',              text: 'La información, lista para decidir.' },
    ],
    ruido: ['Hojas de inventario', 'Mensajes sin responder', 'Pagos pendientes', 'Notas sueltas'],
    hub: 'Todo en un solo lugar',
    ejemplo: 'Vista ilustrativa de la interfaz. Los datos mostrados son de ejemplo.',
  },
};

window.NERON_CONFIG = {
  CONTACT_CONFIG, ROUTES, SYSTEMS, PLANS, PLAN_EXTRAS, PERIODS, STATS,
  BENEFITS, TRUST, FAQS, NAV, ECOSISTEMA, MOTION, PROXIMAMENTE, ANALYTICS_CONFIG, waLink,
};
