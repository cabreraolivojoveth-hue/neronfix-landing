/* ==========================================================================
   NERON · Componentes
   Cada función renderiza una sección a partir de assets/config.js.
   Para cambiar contenido se edita config.js, nunca el HTML.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var C = w.NERON_CONFIG;
  var U = w.NeronUI;
  var esc = U.esc, icon = U.icon, money = U.money;

  /* ======================================================================
     MOCKUPS · SVG puro, sin imágenes externas.
     Los datos mostrados son ilustrativos de la interfaz del sistema.
     ====================================================================== */

  function chartPath(pts, w0, h0, x0, y0) {
    var max = Math.max.apply(null, pts), min = Math.min.apply(null, pts);
    var span = (max - min) || 1;
    return pts.map(function (v, i) {
      var x = x0 + (i / (pts.length - 1)) * w0;
      var y = y0 + h0 - ((v - min) / span) * h0;
      return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }).join(' ');
  }

  var SERIES = [18, 34, 26, 48, 40, 62, 55, 78, 70, 92, 84, 100];
  var LINE = chartPath(SERIES, 300, 96, 200, 232);
  var AREA = LINE + ' L500 328 L200 328 Z';

  /* --- Pantalla completa del panel (mockup principal del hero) --------- */
  function screenSVG() {
    var navItems = ['Dashboard', 'Ventas', 'Inventario', 'Clientes', 'Reportes', 'Configuración', 'Usuarios'];
    var nav = navItems.map(function (t, i) {
      var y = 70 + i * 33, on = i === 0;
      return (on ? '<rect x="12" y="' + (y - 10) + '" width="128" height="26" rx="8" fill="#f7ebee"/>' : '') +
        '<circle cx="27" cy="' + (y + 3) + '" r="3.4" fill="' + (on ? '#7a1225' : '#c9c0ba') + '"/>' +
        '<text x="40" y="' + (y + 7) + '" font-size="9.5" font-family="Inter,sans-serif" font-weight="' + (on ? '600' : '400') + '" fill="' + (on ? '#7a1225' : '#837976') + '">' + t + '</text>';
    }).join('');

    var kpis = [
      ['Ventas del día', '$45,231', '+12.8%'],
      ['Ventas del mes', '$1,234,567', '+8.7%'],
      ['Productos vendidos', '1,231', '+6.3%'],
      ['Clientes nuevos', '86', '+14.5%']
    ].map(function (k, i) {
      var x = 176 + i * 153;
      return '<rect x="' + x + '" y="82" width="141" height="74" rx="10" fill="#fff" stroke="#ece5df"/>' +
        '<text x="' + (x + 14) + '" y="104" font-size="8" font-family="Inter,sans-serif" fill="#837976">' + k[0] + '</text>' +
        '<text x="' + (x + 14) + '" y="126" font-size="15" font-family="Inter,sans-serif" font-weight="700" fill="#14100f">' + k[1] + '</text>' +
        '<circle cx="' + (x + 17) + '" cy="140" r="2.6" fill="#1faa56"/>' +
        '<text x="' + (x + 24) + '" y="143" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#1faa56">' + k[2] + '</text>';
    }).join('');

    var grid = [232, 256, 280, 304, 328].map(function (y) {
      return '<line x1="200" y1="' + y + '" x2="500" y2="' + y + '" stroke="#f2ece7" stroke-width="1"/>';
    }).join('');

    var dots = SERIES.map(function (v, i) {
      var max = 100, min = 18;
      var x = 200 + (i / (SERIES.length - 1)) * 300;
      var y = 232 + 96 - ((v - min) / (max - min)) * 96;
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.4" fill="#7a1225"/>';
    }).join('');

    var months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map(function (m, i) {
      var x = 200 + (i / 11) * 300;
      return '<text x="' + x.toFixed(1) + '" y="346" font-size="7" font-family="Inter,sans-serif" fill="#a89f9a" text-anchor="middle">' + m + '</text>';
    }).join('');

    /* Dona: 4 segmentos sobre una circunferencia de 2πr ≈ 238.8 */
    var r = 38, cir = 2 * Math.PI * r;
    var segs = [['#7a1225', 40], ['#b8933f', 25], ['#c48a96', 20], ['#e8d5a3', 15]];
    var off = 0;
    var donut = segs.map(function (s) {
      var len = cir * s[1] / 100;
      var el = '<circle cx="616" cy="266" r="' + r + '" fill="none" stroke="' + s[0] + '" stroke-width="15"' +
        ' stroke-dasharray="' + (len - 3).toFixed(1) + ' ' + (cir - len + 3).toFixed(1) + '"' +
        ' stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 616 266)"/>';
      off += len;
      return el;
    }).join('');

    var legend = [['Celulares', '40%', '#7a1225'], ['Accesorios', '25%', '#b8933f'], ['Servicios', '20%', '#c48a96'], ['Otros', '15%', '#e8d5a3']]
      .map(function (l, i) {
        var y = 238 + i * 20;
        return '<rect x="668" y="' + (y - 6) + '" width="7" height="7" rx="2" fill="' + l[2] + '"/>' +
          '<text x="681" y="' + y + '" font-size="8" font-family="Inter,sans-serif" fill="#514845">' + l[0] + '</text>' +
          '<text x="762" y="' + y + '" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#14100f" text-anchor="end">' + l[1] + '</text>';
      }).join('');

    var stock = [['Cargador tipo C', 82, '12 pzas'], ['Mica cristal 6.1"', 54, '8 pzas'], ['Audífonos BT', 31, '3 pzas']]
      .map(function (s, i) {
        var y = 404 + i * 26;
        return '<text x="196" y="' + y + '" font-size="8.5" font-family="Inter,sans-serif" fill="#514845">' + s[0] + '</text>' +
          '<rect x="440" y="' + (y - 7) + '" width="180" height="6" rx="3" fill="#f2ece7"/>' +
          '<rect x="440" y="' + (y - 7) + '" width="' + (180 * s[1] / 100).toFixed(0) + '" height="6" rx="3" fill="#b8933f"/>' +
          '<text x="756" y="' + y + '" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#14100f" text-anchor="end">' + s[2] + '</text>';
      }).join('');

    return '<svg viewBox="0 0 800 500" role="img" preserveAspectRatio="xMidYMid slice"' +
      ' aria-label="Ilustración del panel de Neron: ventas del día y del mes, gráfica de ventas, ventas por categoría e inventario con menor stock.">' +
      '<rect width="800" height="500" fill="#ffffff"/>' +
      /* Barra lateral */
      '<rect width="152" height="500" fill="#fbf9f7"/>' +
      '<line x1="152" y1="0" x2="152" y2="500" stroke="#ece5df"/>' +
      '<rect x="18" y="20" width="24" height="24" rx="7" fill="#7a1225"/>' +
      '<path d="M25 38V26l10 12V26" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="50" y="37" font-size="10" letter-spacing="2.4" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">NERON</text>' +
      nav +
      /* Encabezado */
      '<text x="176" y="44" font-size="19" font-family="Playfair Display,Georgia,serif" font-weight="600" fill="#14100f">Dashboard</text>' +
      '<text x="176" y="62" font-size="8.5" font-family="Inter,sans-serif" fill="#837976">Resumen de tu negocio</text>' +
      '<circle cx="742" cy="42" r="11" fill="#fff" stroke="#ece5df"/><circle cx="742" cy="42" r="2.6" fill="#b8933f"/>' +
      '<circle cx="772" cy="42" r="11" fill="#f7ebee" stroke="#f0dade"/><circle cx="772" cy="42" r="3" fill="#7a1225"/>' +
      kpis +
      /* Gráfica de ventas */
      '<rect x="176" y="172" width="364" height="190" rx="12" fill="#fff" stroke="#ece5df"/>' +
      '<text x="196" y="200" font-size="10.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Ventas</text>' +
      '<rect x="470" y="189" width="52" height="16" rx="8" fill="#fbf9f7"/>' +
      '<text x="496" y="200" font-size="7.5" font-family="Inter,sans-serif" fill="#837976" text-anchor="middle">12 meses</text>' +
      grid +
      '<defs><linearGradient id="mkArea" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#7a1225" stop-opacity=".16"/><stop offset="100%" stop-color="#7a1225" stop-opacity="0"/>' +
      '</linearGradient></defs>' +
      '<path d="' + AREA + '" fill="url(#mkArea)"/>' +
      '<path d="' + LINE + '" fill="none" stroke="#7a1225" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots + months +
      /* Dona */
      '<rect x="552" y="172" width="224" height="190" rx="12" fill="#fff" stroke="#ece5df"/>' +
      '<text x="572" y="200" font-size="10.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Por categoría</text>' +
      donut + legend +
      /* Inventario */
      '<rect x="176" y="376" width="600" height="100" rx="12" fill="#fff" stroke="#ece5df"/>' +
      '<text x="196" y="398" font-size="9.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Inventario · menor stock</text>' +
      stock +
      '</svg>';
  }

  /* --- Marco de laptop (HTML + CSS, sin foreignObject) ----------------- */
  function laptopHTML() {
    return '' +
      '<div class="mock__laptop">' +
        '<div class="mock__lid">' +
          '<span class="mock__cam" aria-hidden="true"></span>' +
          '<div class="mock__screen"></div>' +
        '</div>' +
        '<div class="mock__base" aria-hidden="true"><span class="mock__notch"></span></div>' +
      '</div>';
  }

  /* --- Teléfono -------------------------------------------------------- */
  function phoneHTML() {
    var bars = [30, 48, 38, 62, 54, 76, 68].map(function (v, i) {
      return '<rect x="' + (26 + i * 24) + '" y="' + (300 - v * 1.5) + '" width="13" height="' + (v * 1.5) + '" rx="4" fill="' + (i === 6 ? '#7a1225' : '#e8d5a3') + '"/>';
    }).join('');
    return '' +
      '<div class="mock__phone">' +
        '<svg viewBox="0 0 220 440" aria-hidden="true" focusable="false">' +
          '<rect x="2" y="2" width="216" height="436" rx="34" fill="#171314"/>' +
          '<rect x="9" y="9" width="202" height="422" rx="28" fill="#fff"/>' +
          '<rect x="84" y="16" width="52" height="7" rx="3.5" fill="#171314"/>' +
          '<text x="24" y="58" font-size="13" font-family="Playfair Display,Georgia,serif" font-weight="600" fill="#14100f">Dashboard</text>' +
          '<text x="24" y="74" font-size="8" font-family="Inter,sans-serif" fill="#837976">Hoy</text>' +
          '<rect x="18" y="88" width="184" height="64" rx="12" fill="#7a1225"/>' +
          '<text x="34" y="112" font-size="8" font-family="Inter,sans-serif" fill="#e8c9d0">Ventas del día</text>' +
          '<text x="34" y="136" font-size="19" font-family="Inter,sans-serif" font-weight="700" fill="#fff">$45,231</text>' +
          '<rect x="18" y="164" width="88" height="56" rx="11" fill="#fbf9f7" stroke="#ece5df"/>' +
          '<text x="30" y="184" font-size="7" font-family="Inter,sans-serif" fill="#837976">Productos</text>' +
          '<text x="30" y="203" font-size="13" font-family="Inter,sans-serif" font-weight="700" fill="#14100f">1,231</text>' +
          '<rect x="114" y="164" width="88" height="56" rx="11" fill="#fbf9f7" stroke="#ece5df"/>' +
          '<text x="126" y="184" font-size="7" font-family="Inter,sans-serif" fill="#837976">Clientes</text>' +
          '<text x="126" y="203" font-size="13" font-family="Inter,sans-serif" font-weight="700" fill="#14100f">86</text>' +
          '<text x="24" y="248" font-size="9" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Últimos 7 días</text>' +
          bars +
          '<rect x="18" y="330" width="184" height="1" fill="#ece5df"/>' +
          '<circle cx="40" cy="360" r="4" fill="#7a1225"/><text x="54" y="364" font-size="8" font-family="Inter,sans-serif" fill="#514845">Corte de caja</text>' +
          '<circle cx="40" cy="386" r="4" fill="#b8933f"/><text x="54" y="390" font-size="8" font-family="Inter,sans-serif" fill="#514845">Inventario bajo</text>' +
          '<rect x="72" y="414" width="76" height="5" rx="2.5" fill="#dcd4ce"/>' +
        '</svg>' +
      '</div>';
  }

  /* --- Mini mockups de cada tarjeta de sistema ------------------------- */
  var CARD_MOCKUPS = {
    /* Autos: ficha de unidad en inventario */
    'mk-autos': '<svg viewBox="0 0 400 225" role="img" aria-label="Vista del inventario de autos en Neron Autos">' +
      '<rect width="400" height="225" fill="#f6f1ec"/>' +
      '<rect x="20" y="18" width="360" height="42" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="34" y="38" font-size="10" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Inventario de unidades</text>' +
      '<text x="34" y="51" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">14 disponibles · 3 apartadas</text>' +
      '<rect x="318" y="30" width="48" height="18" rx="9" fill="#7a1225"/>' +
      '<text x="342" y="42" font-size="7.5" font-family="Inter,sans-serif" font-weight="600" fill="#fff" text-anchor="middle">+ Agregar</text>' +
      /* Ficha con silueta de auto */
      '<rect x="20" y="72" width="360" height="64" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<rect x="30" y="82" width="76" height="44" rx="7" fill="#f0e9e2"/>' +
      '<path d="M42 112l3.5-10a4 4 0 0 1 3.8-2.8h16.4a4 4 0 0 1 3.8 2.8l3.5 10" fill="none" stroke="#7a1225" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="38" y="111" width="42" height="9" rx="2.5" fill="#7a1225"/>' +
      '<circle cx="47" cy="121" r="3" fill="#3d0812"/><circle cx="71" cy="121" r="3" fill="#3d0812"/>' +
      '<text x="118" y="96" font-size="10" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Sedán 2021 · 48,300 km</text>' +
      '<text x="118" y="110" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">Enganche $45,000 · 24 mensualidades</text>' +
      '<rect x="118" y="116" width="60" height="14" rx="7" fill="#fcf7ea"/>' +
      '<text x="148" y="126" font-size="7" font-family="Inter,sans-serif" font-weight="600" fill="#8a6820" text-anchor="middle">Contrato PDF</text>' +
      '<text x="366" y="102" font-size="13" font-family="Inter,sans-serif" font-weight="700" fill="#7a1225" text-anchor="end">$289,000</text>' +
      /* Cobranza */
      '<rect x="20" y="148" width="360" height="56" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="34" y="168" font-size="9" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Cobranza de la semana</text>' +
      '<rect x="34" y="178" width="300" height="7" rx="3.5" fill="#f0e9e2"/>' +
      '<rect x="34" y="178" width="204" height="7" rx="3.5" fill="#b8933f"/>' +
      '<text x="34" y="197" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">17 de 25 pagos registrados</text>' +
      '<text x="366" y="184" font-size="9" font-family="Inter,sans-serif" font-weight="700" fill="#1faa56" text-anchor="end">68%</text>' +
      '</svg>',

    /* Celulares: punto de venta con ticket */
    'mk-celulares': '<svg viewBox="0 0 400 225" role="img" aria-label="Punto de venta de Neron Celulares con ticket y equipos">' +
      '<rect width="400" height="225" fill="#f6f1ec"/>' +
      '<rect x="20" y="18" width="222" height="186" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="34" y="40" font-size="10" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Punto de venta</text>' +
      '<rect x="34" y="52" width="194" height="22" rx="7" fill="#fbf9f7" stroke="#ece5df"/>' +
      '<circle cx="47" cy="63" r="4.5" fill="none" stroke="#a89f9a" stroke-width="1.6"/><path d="M50.5 66.5l3 3" stroke="#a89f9a" stroke-width="1.6" stroke-linecap="round"/>' +
      '<text x="60" y="67" font-size="7.5" font-family="Inter,sans-serif" fill="#a89f9a">Buscar equipo o accesorio…</text>' +
      /* Renglones */
      '<rect x="34" y="84" width="194" height="34" rx="8" fill="#fbf9f7"/>' +
      '<rect x="42" y="90" width="16" height="22" rx="3" fill="#7a1225"/>' +
      '<text x="66" y="99" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Equipo 128 GB</text>' +
      '<text x="66" y="111" font-size="7" font-family="Inter,sans-serif" fill="#837976">IMEI registrado · 1 pza</text>' +
      '<text x="220" y="105" font-size="9" font-family="Inter,sans-serif" font-weight="700" fill="#14100f" text-anchor="end">$6,499</text>' +
      '<rect x="34" y="124" width="194" height="30" rx="8" fill="#fbf9f7"/>' +
      '<rect x="42" y="130" width="16" height="18" rx="3" fill="#b8933f"/>' +
      '<text x="66" y="143" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Mica + funda</text>' +
      '<text x="220" y="143" font-size="9" font-family="Inter,sans-serif" font-weight="700" fill="#14100f" text-anchor="end">$380</text>' +
      '<line x1="34" y1="166" x2="228" y2="166" stroke="#ece5df"/>' +
      '<text x="34" y="184" font-size="9" font-family="Inter,sans-serif" fill="#514845">Total</text>' +
      '<text x="228" y="186" font-size="15" font-family="Inter,sans-serif" font-weight="700" fill="#7a1225" text-anchor="end">$6,879</text>' +
      /* Panel derecho: crédito */
      '<rect x="254" y="18" width="126" height="90" rx="10" fill="#7a1225"/>' +
      '<text x="268" y="42" font-size="8" font-family="Inter,sans-serif" fill="#e8c9d0">Crédito a 16 semanas</text>' +
      '<text x="268" y="64" font-size="17" font-family="Inter,sans-serif" font-weight="700" fill="#fff">$520</text>' +
      '<text x="268" y="78" font-size="7.5" font-family="Inter,sans-serif" fill="#e8c9d0">por semana</text>' +
      '<rect x="268" y="86" width="72" height="14" rx="7" fill="rgba(255,255,255,.16)"/>' +
      '<text x="304" y="96" font-size="7" font-family="Inter,sans-serif" font-weight="600" fill="#fff" text-anchor="middle">Pagaré listo</text>' +
      '<rect x="254" y="118" width="126" height="86" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="268" y="138" font-size="8.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Corte de caja</text>' +
      '<text x="268" y="158" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">Efectivo</text>' +
      '<text x="366" y="158" font-size="7.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f" text-anchor="end">$12,400</text>' +
      '<text x="268" y="175" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">Tarjeta</text>' +
      '<text x="366" y="175" font-size="7.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f" text-anchor="end">$8,150</text>' +
      '<line x1="268" y1="183" x2="366" y2="183" stroke="#ece5df"/>' +
      '<text x="268" y="196" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#7a1225">Total</text>' +
      '<text x="366" y="196" font-size="8" font-family="Inter,sans-serif" font-weight="700" fill="#7a1225" text-anchor="end">$20,550</text>' +
      '</svg>',

    /* Terapias: agenda del día con expediente */
    'mk-terapias': '<svg viewBox="0 0 400 225" role="img" aria-label="Agenda del día en Neron Terapias con citas y expediente del paciente">' +
      '<rect width="400" height="225" fill="#f6f1ec"/>' +
      '<rect x="20" y="18" width="222" height="186" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="34" y="40" font-size="10" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Agenda de hoy</text>' +
      '<text x="228" y="40" font-size="7.5" font-family="Inter,sans-serif" fill="#837976" text-anchor="end">8 citas</text>' +
      '<g font-family="Inter,sans-serif">' +
      '<rect x="34" y="52" width="194" height="34" rx="8" fill="#fbf9f7"/>' +
      '<rect x="34" y="52" width="3.5" height="34" rx="2" fill="#7a1225"/>' +
      '<text x="48" y="68" font-size="8" font-weight="600" fill="#14100f">Masaje profundo · 60 min</text>' +
      '<text x="48" y="80" font-size="7" fill="#837976">10:00 · Terapeuta 1</text>' +
      '<rect x="34" y="92" width="194" height="34" rx="8" fill="#fbf9f7"/>' +
      '<rect x="34" y="92" width="3.5" height="34" rx="2" fill="#b8933f"/>' +
      '<text x="48" y="108" font-size="8" font-weight="600" fill="#14100f">Reflexología · 45 min</text>' +
      '<text x="48" y="120" font-size="7" fill="#837976">11:15 · Terapeuta 2</text>' +
      '<rect x="34" y="132" width="194" height="34" rx="8" fill="#fbf9f7"/>' +
      '<rect x="34" y="132" width="3.5" height="34" rx="2" fill="#c48a96"/>' +
      '<text x="48" y="148" font-size="8" font-weight="600" fill="#14100f">Taller de aromaterapia</text>' +
      '<text x="48" y="160" font-size="7" fill="#837976">17:00 · 9 de 12 lugares</text>' +
      '<line x1="34" y1="176" x2="228" y2="176" stroke="#ece5df"/>' +
      '<text x="34" y="192" font-size="8" fill="#837976">Vendido hoy</text>' +
      '<text x="228" y="194" font-size="13" font-weight="700" fill="#7a1225" text-anchor="end">$4,860</text>' +
      '</g>' +
      /* Panel derecho: aviso clínico y expediente */
      '<rect x="254" y="18" width="126" height="82" rx="10" fill="#fcf7ea" stroke="#e8d5a3"/>' +
      '<text x="268" y="38" font-size="7.5" font-family="Inter,sans-serif" font-weight="600" fill="#8a6820">Aviso del expediente</text>' +
      '<text x="268" y="56" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Alergia a lavanda</text>' +
      '<text x="268" y="70" font-size="7" font-family="Inter,sans-serif" fill="#8a6820">Evitar presión en zona lumbar</text>' +
      '<text x="268" y="86" font-size="7" font-family="Inter,sans-serif" fill="#8a6820">Se muestra en cada cita</text>' +
      '<rect x="254" y="110" width="126" height="94" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="268" y="130" font-size="8.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Expediente</text>' +
      '<text x="268" y="148" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">Sesiones</text>' +
      '<text x="366" y="148" font-size="7.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f" text-anchor="end">14</text>' +
      '<text x="268" y="165" font-size="7.5" font-family="Inter,sans-serif" fill="#837976">Cursos</text>' +
      '<text x="366" y="165" font-size="7.5" font-family="Inter,sans-serif" font-weight="600" fill="#14100f" text-anchor="end">2</text>' +
      '<line x1="268" y1="174" x2="366" y2="174" stroke="#ece5df"/>' +
      '<text x="268" y="190" font-size="8" font-family="Inter,sans-serif" font-weight="600" fill="#7a1225">Notas por sesión</text>' +
      '</svg>',
  };

  /* ======================================================================
     SECCIONES
     ====================================================================== */

  /* --- Navegación (desktop + drawer) ---------------------------------- */
  function renderNav() {
    var nav = C.NAV.map(function (n) {
      return '<a class="nav__link" href="' + esc(n.href) + '" data-spy="' + esc(n.href) + '"' +
        ' data-track="nav_click" data-track-label="' + esc(n.label) + '">' + esc(n.label) + '</a>';
    }).join('');
    var el = U.$('#nav');
    if (el) el.innerHTML = nav;

    var drawer = C.NAV.map(function (n, i) {
      return '<a class="drawer__link" href="' + esc(n.href) + '" data-spy="' + esc(n.href) + '" style="--i:' + i + '"' +
        ' data-track="nav_click" data-track-label="' + esc(n.label) + '">' +
        esc(n.label) + icon('i-arrow') + '</a>';
    }).join('');
    var dl = U.$('#drawer-links');
    if (dl) dl.innerHTML = drawer;
  }

  /* --- Mockup del hero ------------------------------------------------- */
  function renderMockup() {
    var host = U.$('#mockup');
    if (!host) return;
    host.innerHTML = '<div class="mock__halo"></div>' + laptopHTML() + phoneHTML();
    var scr = U.$('.mock__screen', host);
    if (scr) scr.innerHTML = screenSVG();
    if (!U.reduced) U.$('.mock__laptop', host).classList.add('mock__float');
  }

  /* --- Barra de confianza ---------------------------------------------- */
  function renderTrust() {
    var host = U.$('#trust');
    if (!host) return;
    host.innerHTML = C.TRUST.map(function (t, i) {
      return '<div class="trust__item rv" style="--d:' + i + '">' +
        '<span class="trust__ic">' + icon(t.icon) + '</span>' +
        '<span><span class="trust__t">' + esc(t.title) + '</span>' +
        '<span class="trust__d">' + esc(t.text) + '</span></span></div>';
    }).join('');
  }

  /* --- Métricas -------------------------------------------------------- */
  function renderStats() {
    var host = U.$('#stats');
    if (!host) return;
    var list = C.STATS.filter(function (s) { return s.enabled; });
    if (!list.length) { host.closest('section').hidden = true; return; }
    host.innerHTML = list.map(function (s, i) {
      var num = s.text
        ? '<span class="stat__n">' + esc(s.text) + '</span>'
        : '<span class="stat__n" data-count="' + s.count + '" data-prefix="' + esc(s.prefix || '') + '"' +
          ' data-suffix="' + esc(s.suffix || '') + '">' +
          esc(s.prefix || '') + '0' + esc(s.suffix || '') + '</span>';
      return '<div class="stat rv" style="--d:' + i + '">' +
        '<span class="stat__ic">' + icon(s.icon) + '</span>' +
        '<span>' + num + '<span class="stat__l">' + esc(s.label) + '</span></span></div>';
    }).join('');
  }

  /* --- Sistemas -------------------------------------------------------- */
  /* Un sistema sin dirección propia todavía no tiene subdominio publicado:
     su botón va a WhatsApp en vez de dejar un enlace que no abre. */
  function sysLink(s) {
    return s.url ? s.url : C.waLink('Hola, quiero información de Neron ' + s.name);
  }
  function sysAttrs(s) {
    return s.url ? '' : ' target="_blank" rel="noopener noreferrer"';
  }


  function renderSystems() {
    var host = U.$('#systems');
    if (!host) return;
    host.innerHTML = C.SYSTEMS.map(function (s, i) {
      var feats = s.feats.map(function (f) {
        return '<li>' + icon('i-check') + '<span>' + esc(f) + '</span></li>';
      }).join('');
      return '<article class="sys rv rv--scale" style="--d:' + i + '">' +
        '<div class="sys__media">' + (CARD_MOCKUPS[s.mockup] || '') + '</div>' +
        '<div class="sys__body">' +
          '<div class="sys__top"><span class="sys__ic">' + icon(s.icon) + '</span>' +
            '<span><span class="sys__cat">' + esc(s.cat) + '</span>' +
            '<h3>' + esc(s.name) + '</h3></span></div>' +
          '<p class="sys__desc">' + esc(s.desc) + '</p>' +
          '<ul class="sys__feats">' + feats + '</ul>' +
          '<p class="sys__plans">' +
            '<b>Tres planes</b> desde ' + money(s.price) + ' al mes' +
          '</p>' +
          '<a class="sys__plans-link" href="#precios" data-plans-for="' + esc(s.id) + '"' +
            ' data-track="plan_product_click" data-track-label="' + esc(s.id) + ' desde tarjeta">' +
            'Ver los tres planes de ' + esc(s.name) + icon('i-arrow') + '</a>' +
          '<a class="btn btn--primary" href="' + esc(sysLink(s)) + '"' + sysAttrs(s) +
            ' data-track="' + esc(s.event) + '"' +
            ' data-track-label="' + esc(s.name) + '">' + esc(s.cta) + icon('i-arrow') + '</a>' +
        '</div></article>';
    }).join('');
  }

  /* --- Beneficios ------------------------------------------------------ */
  function renderBenefits() {
    var host = U.$('#benefits');
    if (!host) return;
    host.innerHTML = C.BENEFITS.map(function (b, i) {
      return '<article class="benefit rv" style="--d:' + i + '">' +
        '<div class="benefit__ic">' + icon(b.icon) + '</div>' +
        '<h3>' + esc(b.title) + '</h3><p>' + esc(b.text) + '</p></article>';
    }).join('');
  }

  /* --- Precios ---------------------------------------------------------
     Tres sistemas, tres planes cada uno, tres formas de pago. El visitante
     elige primero su giro y después cómo quiere pagar; así nunca ve nueve
     tarjetas al mismo tiempo. Los precios viven en config.js. */
  var product = C.SYSTEMS[0].id;
  var period = 'mensual';

  function periodBy(id) {
    for (var i = 0; i < C.PERIODS.length; i++) if (C.PERIODS[i].id === id) return C.PERIODS[i];
    return C.PERIODS[0];
  }

  function planCard(p, sys) {
    var per = periodBy(period);
    var precio = p.precios[period];
    var mensualizado = period === 'trimestral' ? Math.round(precio / 3)
                     : period === 'anual' ? Math.round(precio / 12) : null;
    var feats = (p.feats || []).map(function (f) {
      return '<li>' + icon('i-check') + '<span>' + esc(f) + '</span></li>';
    }).join('');
    var msg = 'Hola, quiero el plan ' + p.nombre + ' de Neron ' + sys.name +
              ' (' + per.label.toLowerCase() + ', ' + money(precio) + ')';
    return '<article class="plan' + (p.popular ? ' plan--featured' : '') + ' rv">' +
      (p.popular ? '<span class="plan__tag">' + icon('i-star') + 'Más elegido</span>' : '') +
      '<h3 class="plan__name">' + esc(p.nombre) + '</h3>' +
      '<p class="plan__desc">' + esc(p.desc || '') + '</p>' +
      '<p class="plan__price"><b>' + money(precio) + '</b><span>/ ' + esc(per.unidad) + '</span></p>' +
      (mensualizado
        ? '<span class="plan__save">' + icon('i-check') + 'Te sale en ' + money(mensualizado) + ' al mes</span>'
        : '') +
      '<p class="plan__trial yes">Prueba gratis, sin tarjeta</p>' +
      '<ul class="plan__feats">' + feats + '</ul>' +
      (p.limite ? '<p class="plan__limit">' + esc(p.limite) + '</p>' : '') +
      '<a class="btn ' + (p.popular ? 'btn--primary' : 'btn--secondary') + '"' +
        ' href="' + esc(C.waLink(msg)) + '" target="_blank" rel="noopener noreferrer"' +
        ' data-track="plan_click" data-track-label="' + esc(p.id + ' ' + period) + '">' +
        'Quiero el ' + esc(p.nombre) + icon('i-arrow') + '</a>' +
      '</article>';
  }

  function systemById(id) {
    for (var i = 0; i < C.SYSTEMS.length; i++) if (C.SYSTEMS[i].id === id) return C.SYSTEMS[i];
    return C.SYSTEMS[0];
  }

  function renderPlans() {
    var host = U.$('#plans');
    if (!host) return;
    var sys = systemById(product);
    var list = (C.PLANS[product] || []);
    host.innerHTML = list.map(function (p) { return planCard(p, sys); }).join('');
    U.initReveal(host);
    /* Sin animación de entrada al cambiar de pestaña: ya están en pantalla. */
    U.$$('.rv', host).forEach(function (n) { n.classList.add('is-in'); });

    var cap = U.$('#plans-for');
    if (cap) {
      cap.innerHTML = icon(sys.icon) + '<span>Planes de <b>Neron ' + esc(sys.name) +
        '</b> · ' + esc(sys.cat.toLowerCase()) + '</span>';
    }
  }

  /* Pestañas de sistema y de forma de pago, generadas de config.js. */
  function renderPricingToggles() {
    var ph = U.$('#product-toggle');
    if (ph) {
      ph.innerHTML = C.SYSTEMS.map(function (s) {
        return '<button class="toggle__btn" type="button" role="tab" data-product="' + esc(s.id) + '"' +
          ' aria-selected="' + (s.id === product) + '">' + esc(s.name) + '</button>';
      }).join('');
    }
    var th = U.$('#plan-toggle');
    if (th) {
      th.innerHTML = C.PERIODS.map(function (t) {
        return '<button class="toggle__btn" type="button" role="tab" data-period="' + esc(t.id) + '"' +
          ' aria-selected="' + (t.id === period) + '">' + esc(t.label) +
          (t.nota ? '<span class="toggle__save">' + esc(t.nota) + '</span>' : '') + '</button>';
      }).join('');
    }
  }

  function wireToggle(sel, attr, onPick) {
    var el = U.$(sel);
    if (!el) return;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.toggle__btn');
      if (!b) return;
      onPick(b.getAttribute(attr));
      U.$$('.toggle__btn', el).forEach(function (x) {
        x.setAttribute('aria-selected', String(x === b));
      });
      renderPlans();
    });
  }

  /* Los enlaces "Ver los tres planes" de las tarjetas eligen la pestaña del
     sistema antes de bajar, para que nadie llegue a precios y tenga que
     volver a decir cuál es su giro. */
  function wirePlanJumps() {
    U.$$('[data-plans-for]').forEach(function (a) {
      a.addEventListener('click', function () {
        var id = a.getAttribute('data-plans-for');
        if (!C.PLANS[id]) return;
        product = id;
        U.$$('#product-toggle .toggle__btn').forEach(function (x) {
          x.setAttribute('aria-selected', String(x.getAttribute('data-product') === id));
        });
        renderPlans();
      });
    });
  }

  function initPricing() {
    if (!U.$('#plans')) return;
    renderPricingToggles();
    wireToggle('#product-toggle', 'data-product', function (v) { product = v; });
    wireToggle('#plan-toggle', 'data-period', function (v) { period = v; });
    renderPlans();
    wirePlanJumps();
  }

  /* --- FAQ ------------------------------------------------------------- */
  function renderFaq() {
    var host = U.$('#faq-list');
    if (!host) return;
    host.innerHTML = C.FAQS.map(function (f, i) {
      return '<div class="faq__item rv" style="--d:' + Math.min(i, 4) + '">' +
        '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '">' +
        '<span>' + esc(f.q) + '</span><span class="faq__chev">' + icon('i-chevron') + '</span></button>' +
        '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '">' +
        '<p>' + esc(f.a) + '</p></div></div>';
    }).join('');
    U.initAccordion(host);

    /* Datos estructurados FAQPage generados del mismo arreglo. */
    var ld = d.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: C.FAQS.map(function (f) {
        return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
      })
    });
    d.head.appendChild(ld);
  }

  /* --- Contacto --------------------------------------------------------
     WhatsApp es el único canal de atención: se presenta como bloque
     principal. El Centro de ayuda va aparte porque es autoservicio, no
     una vía de contacto alternativa. */
  function renderContact() {
    var host = U.$('#contact');
    if (!host) return;
    var num = C.CONTACT_CONFIG.whatsappDisplay || '';
    host.innerHTML =
      '<a class="wa-panel rv" href="' + esc(C.waLink()) + '" target="_blank" rel="noopener noreferrer"' +
        ' data-track="whatsapp_click" data-track-label="seccion contacto">' +
        '<span class="wa-panel__ic">' + icon('i-whatsapp') + '</span>' +
        '<span class="wa-panel__body">' +
          '<span class="wa-panel__tag">Único canal de atención</span>' +
          '<h3>Escríbenos por WhatsApp</h3>' +
          (num ? '<span class="wa-panel__num">' + esc(num) + '</span>' : '') +
          '<p>Todo el servicio y soporte de Neron se atiende por aquí. Te responde una ' +
          'persona que conoce el sistema y puede dar de alta tu cuenta hoy mismo.</p>' +
        '</span>' +
        '<span class="btn btn--wa">Abrir WhatsApp' + icon('i-arrow') + '</span>' +
      '</a>' +
      '<a class="contact-card rv" style="--d:1" href="' + esc(C.ROUTES.faq) + '" data-track="help_click">' +
        '<span class="contact-card__ic">' + icon('i-help') + '</span>' +
        '<h3>Centro de ayuda</h3>' +
        '<p>¿Prefieres resolverlo tú? Guías por tema: facturación, inventario, ventas, ' +
        'clientes, configuración y dispositivos.</p>' +
        '<span class="link-arrow">Ir al Centro de ayuda' + icon('i-arrow') + '</span></a>';
  }

  /* --- Modal de acceso -------------------------------------------------- */
  /* No existe una ruta de login unificada: cada sistema tiene el suyo, así
     que el botón lleva al sistema real que el usuario ya contrató. */
  function renderLoginModal() {
    var host = U.$('#login-options');
    if (!host) return;
    host.innerHTML = C.SYSTEMS.filter(function (s) { return !!s.url; }).map(function (s) {
      return '<a class="modal__opt" href="' + esc(s.url) + '" data-track="login_click" data-track-label="' + esc(s.id) + '">' +
        icon(s.icon) + '<span><b>Neron ' + esc(s.name) + '</b><span>' + esc(s.cat) + '</span></span>' +
        '<span class="link-arrow">' + icon('i-arrow') + '</span></a>';
    }).join('');
  }

  /* --- Enlaces de WhatsApp y del footer -------------------------------- */
  function wireLinks() {
    U.$$('[data-wa]').forEach(function (a) {
      a.href = C.waLink(a.getAttribute('data-wa') || '');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      if (!a.hasAttribute('data-track')) a.setAttribute('data-track', 'whatsapp_click');
    });

    /* Enlaces legales: sólo aparecen si existe la URL en la configuración.
       Sin URL se ocultan y se les quita el href para no dejar un enlace muerto. */
    U.$$('[data-route]').forEach(function (a) {
      var url = C.ROUTES[a.getAttribute('data-route')];
      if (url) { a.href = url; a.hidden = false; }
      else { a.removeAttribute('href'); a.hidden = true; }
    });

    /* Número de WhatsApp visible, desde la configuración. */
    var disp = C.CONTACT_CONFIG.whatsappDisplay || '';
    var num = U.$('#wa-numero');
    if (num) num.textContent = disp;
    var fnum = U.$('#ftr-wa');
    if (fnum) fnum.textContent = disp ? '· ' + disp : '';

    var y = U.$('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  w.NeronComponents = {
    renderNav: renderNav, renderMockup: renderMockup, renderTrust: renderTrust,
    renderStats: renderStats, renderSystems: renderSystems, renderBenefits: renderBenefits,
    initPricing: initPricing, renderFaq: renderFaq, renderContact: renderContact,
    renderLoginModal: renderLoginModal, wireLinks: wireLinks,
  };
})(window, document);
