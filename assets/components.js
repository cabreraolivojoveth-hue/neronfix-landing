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

    /* Caja: terminal de punto de venta */
    'mk-caja': '<svg viewBox="0 0 400 225" role="img" aria-label="Pantalla de cobro de Neron Caja con productos y total">' +
      '<rect width="400" height="225" fill="#f6f1ec"/>' +
      '<rect x="20" y="18" width="200" height="186" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="34" y="40" font-size="10" font-family="Inter,sans-serif" font-weight="600" fill="#14100f">Venta en curso</text>' +
      '<text x="206" y="40" font-size="7.5" font-family="Inter,sans-serif" fill="#837976" text-anchor="end">Ticket #1842</text>' +
      /* Renglones de productos */
      '<g font-family="Inter,sans-serif">' +
      '<rect x="34" y="52" width="172" height="1" fill="#f2ece7"/>' +
      '<text x="34" y="70" font-size="8" fill="#14100f">Refresco 600 ml × 3</text><text x="206" y="70" font-size="8" font-weight="600" fill="#14100f" text-anchor="end">$66.00</text>' +
      '<text x="34" y="90" font-size="8" fill="#14100f">Pan de caja</text><text x="206" y="90" font-size="8" font-weight="600" fill="#14100f" text-anchor="end">$48.50</text>' +
      '<text x="34" y="110" font-size="8" fill="#14100f">Detergente 1 kg</text><text x="206" y="110" font-size="8" font-weight="600" fill="#14100f" text-anchor="end">$54.00</text>' +
      '<text x="34" y="130" font-size="8" fill="#14100f">Café soluble</text><text x="206" y="130" font-size="8" font-weight="600" fill="#14100f" text-anchor="end">$92.00</text>' +
      '<rect x="34" y="142" width="172" height="1" fill="#f2ece7"/>' +
      '<text x="34" y="162" font-size="8" fill="#837976">Subtotal</text><text x="206" y="162" font-size="8" fill="#514845" text-anchor="end">$260.50</text>' +
      '<text x="34" y="186" font-size="10" font-weight="600" fill="#7a1225">Total</text>' +
      '<text x="206" y="188" font-size="17" font-weight="700" fill="#7a1225" text-anchor="end">$260.50</text>' +
      '</g>' +
      /* Teclado de cobro */
      '<rect x="232" y="18" width="148" height="90" rx="10" fill="#fff" stroke="#e6ded7"/>' +
      '<text x="246" y="38" font-size="8" font-family="Inter,sans-serif" fill="#837976">Recibido</text>' +
      '<text x="246" y="60" font-size="16" font-family="Inter,sans-serif" font-weight="700" fill="#14100f">$300.00</text>' +
      '<rect x="246" y="70" width="120" height="24" rx="8" fill="#fcf7ea" stroke="#e8d5a3"/>' +
      '<text x="258" y="86" font-size="8" font-family="Inter,sans-serif" fill="#8a6820">Cambio</text>' +
      '<text x="354" y="86" font-size="9" font-family="Inter,sans-serif" font-weight="700" fill="#8a6820" text-anchor="end">$39.50</text>' +
      '<rect x="232" y="118" width="70" height="38" rx="9" fill="#fbf9f7" stroke="#ece5df"/>' +
      '<text x="267" y="142" font-size="8.5" font-family="Inter,sans-serif" font-weight="600" fill="#514845" text-anchor="middle">Efectivo</text>' +
      '<rect x="310" y="118" width="70" height="38" rx="9" fill="#fbf9f7" stroke="#ece5df"/>' +
      '<text x="345" y="142" font-size="8.5" font-family="Inter,sans-serif" font-weight="600" fill="#514845" text-anchor="middle">Tarjeta</text>' +
      '<rect x="232" y="166" width="148" height="38" rx="9" fill="#7a1225"/>' +
      '<text x="306" y="190" font-size="10" font-family="Inter,sans-serif" font-weight="700" fill="#fff" text-anchor="middle">Cobrar e imprimir</text>' +
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
          ' data-suffix="' + esc(s.suffix || '') + '"' + (s.live ? ' data-live="' + esc(s.live) + '"' : '') + '>' +
          esc(s.prefix || '') + '0' + esc(s.suffix || '') + '</span>';
      return '<div class="stat rv" style="--d:' + i + '">' +
        '<span class="stat__ic">' + icon(s.icon) + '</span>' +
        '<span>' + num + '<span class="stat__l">' + esc(s.label) + '</span></span></div>';
    }).join('');
  }

  /* --- Sistemas -------------------------------------------------------- */
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
          '<p class="sys__price" data-price-for="' + esc(s.id) + '">' +
            esc(s.priceNote) + ' <b>' + money(s.price) + '</b><span class="per">/ ' + esc(s.period) + '</span>' +
            (s.trial ? ' <span class="sys__note">' + icon('i-check') + esc(s.trial) + '</span>' : '') +
          '</p>' +
          '<a class="btn btn--primary" href="' + esc(s.url) + '" data-track="' + esc(s.event) + '"' +
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

  /* --- Precios --------------------------------------------------------- */
  var PLANS = C.PLANS_FALLBACK.slice();
  var period = 'mensual';

  function planCard(p) {
    var feats = (p.feats || []).map(function (f) {
      return '<li>' + icon('i-check') + '<span>' + esc(f) + '</span></li>';
    }).join('');
    return '<article class="plan' + (p.popular ? ' plan--featured' : '') + ' rv">' +
      (p.popular ? '<span class="plan__tag">' + icon('i-star') + 'Más elegido</span>' : '') +
      '<h3 class="plan__name">' + esc(p.nombre) + '</h3>' +
      '<p class="plan__desc">' + esc(p.desc || '') + '</p>' +
      '<p class="plan__price"><b>' + money(p.precio) + '</b><span>/ ' + (p.periodo === 'anual' ? 'año' : 'mes') + '</span></p>' +
      (p.ahorro ? '<span class="plan__save">' + icon('i-check') + 'Ahorras ' + money(p.ahorro) + ' al año</span>' : '') +
      '<p class="plan__trial' + (p.prueba ? ' yes' : '') + '">' + (p.prueba ? '14 días gratis, sin tarjeta' : 'Sin prueba · contratación directa') + '</p>' +
      '<ul class="plan__feats">' + feats + '</ul>' +
      '<a class="btn ' + (p.popular ? 'btn--primary' : 'btn--secondary') + '" href="' + esc(C.ROUTES.caja) + '/?plan=' + encodeURIComponent(p.id) + '"' +
        ' data-track="plan_click" data-track-label="' + esc(p.id) + '">' +
        (p.prueba ? 'Empezar gratis' : 'Contratar ' + esc(p.nombre)) + icon('i-arrow') + '</a>' +
      '</article>';
  }

  function renderPlans() {
    var host = U.$('#plans');
    if (!host) return;
    var list = PLANS.filter(function (p) { return (p.periodo || 'mensual') === period; });
    host.innerHTML = list.map(planCard).join('');
    U.initReveal(host);
    /* Sin animación de entrada al cambiar de pestaña: ya están en pantalla. */
    U.$$('.rv', host).forEach(function (n) { n.classList.add('is-in'); });
  }

  function renderPricingExtras() {
    var host = U.$('#plans-other');
    if (!host) return;
    host.innerHTML = C.SYSTEMS.filter(function (s) { return !s.livePricing; }).map(function (s) {
      return '<a class="price-mini rv" href="' + esc(s.url) + '" data-track="' + esc(s.event) + '" data-track-label="precios">' +
        '<span class="price-mini__l"><span class="price-mini__ic">' + icon(s.icon) + '</span>' +
        '<span><h3>Neron ' + esc(s.name) + '</h3><p>' + esc(s.cat) + '</p></span></span>' +
        '<span class="price-mini__r"><span class="price-mini__p">' + money(s.price) +
        '<small> / ' + esc(s.period) + '</small></span>' +
        '<span class="link-arrow">Ver sistema' + icon('i-arrow') + '</span></span></a>';
    }).join('');
  }

  function initPricing() {
    var toggle = U.$('#plan-toggle');
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        var b = e.target.closest('.toggle__btn');
        if (!b) return;
        period = b.getAttribute('data-period');
        U.$$('.toggle__btn', toggle).forEach(function (x) {
          x.setAttribute('aria-selected', String(x === b));
        });
        renderPlans();
      });
    }
    renderPlans();
    renderPricingExtras();

    /* Sincroniza con la API real de Neron Caja (fuente única de precios).
       Sólo se consulta en la página que muestra precios. */
    if (!w.fetch || !U.$('#plans')) return;
    fetch(C.ROUTES.planesApi, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.planes || !j.planes.length) return;
        PLANS = j.planes;
        renderPlans();
        /* Propaga el precio más bajo a la tarjeta y a la métrica de Caja. */
        var mens = PLANS.filter(function (p) { return (p.periodo || 'mensual') === 'mensual'; });
        if (!mens.length) return;
        var min = Math.min.apply(null, mens.map(function (p) { return p.precio; }));
        var card = U.$('[data-price-for="caja"] b');
        if (card) card.textContent = money(min);
        var stat = U.$('.stat__n[data-live="caja"]');
        if (stat) { stat.setAttribute('data-count', min); if (stat.__cu) stat.textContent = '$' + min.toLocaleString('es-MX'); }
      })
      .catch(function () { /* se conserva el respaldo local */ });
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

  /* --- Contacto -------------------------------------------------------- */
  function renderContact() {
    var host = U.$('#contact');
    if (!host) return;
    var cards = [
      { icon: 'i-whatsapp', cls: 'wa', title: 'WhatsApp', text: 'La vía más rápida. Te atendemos personas que conocen el sistema y pueden darte de alta hoy mismo.', cta: 'Escribir por WhatsApp', href: C.waLink(), ev: 'whatsapp_click', ext: true },
      { icon: 'i-help', title: 'Centro de ayuda', text: 'Guías por tema: facturación, inventario, ventas, clientes, configuración y dispositivos.', cta: 'Ir al Centro de ayuda', href: C.ROUTES.faq, ev: 'help_click' },
      { icon: 'i-mail', title: 'Más formas de contacto', text: 'Consulta todos nuestros canales de atención y elige el que prefieras.', cta: 'Ver contacto', href: C.ROUTES.contacto, ev: 'contact_click' },
    ];
    host.innerHTML = cards.map(function (c, i) {
      return '<a class="contact-card rv" style="--d:' + i + '" href="' + esc(c.href) + '"' +
        (c.ext ? ' target="_blank" rel="noopener noreferrer"' : '') +
        ' data-track="' + esc(c.ev) + '">' +
        '<span class="contact-card__ic ' + (c.cls || '') + '">' + icon(c.icon) + '</span>' +
        '<h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p>' +
        '<span class="link-arrow">' + esc(c.cta) + icon('i-arrow') + '</span></a>';
    }).join('');
  }

  /* --- Modal de acceso -------------------------------------------------- */
  /* No existe una ruta de login unificada: cada sistema tiene el suyo, así
     que el botón lleva al sistema real que el usuario ya contrató. */
  function renderLoginModal() {
    var host = U.$('#login-options');
    if (!host) return;
    host.innerHTML = C.SYSTEMS.map(function (s) {
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
