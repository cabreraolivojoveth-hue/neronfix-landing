/* ==========================================================================
   NERON · Sprite de iconos
   Fuente única para las tres páginas. Se inyecta al inicio del <body> y se
   referencia con <svg class="ic"><use href="#i-nombre"></use></svg>.
   ========================================================================== */
(function (d) {
  'use strict';

  var SPRITE =
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>' +
    '<symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></symbol>' +
    '<symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>' +
    '<symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></symbol>' +
    '<symbol id="i-search-off" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M8 11h6"/></symbol>' +
    '<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M4 20l1.4-3.5a7.5 7.5 0 1 1 3.1 2.7z"/><path d="M9 9.5c0 2.8 2.3 5 5 5a.7.7 0 0 0 .7-.7v-.9c0-.4-.3-.7-.7-.6l-1.1.2-1.6-1.6.2-1.1c.1-.4-.2-.7-.6-.7h-.9a.7.7 0 0 0-.7.7z"/></symbol>' +
    '<symbol id="i-diamond" viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18"/></symbol>' +
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/><path d="M9 12l2 2 4-4"/></symbol>' +
    '<symbol id="i-car" viewBox="0 0 24 24"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13"/><rect x="3" y="13" width="18" height="5" rx="1"/><circle cx="7.5" cy="18" r="1.3"/><circle cx="16.5" cy="18" r="1.3"/></symbol>' +
    '<symbol id="i-mobile" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></symbol>' +
    '<symbol id="i-cart" viewBox="0 0 24 24"><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M3 4h2l2.2 11h10l1.8-7H6"/></symbol>' +
    '<symbol id="i-cash" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.4"/></symbol>' +
    '<symbol id="i-file" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h5"/></symbol>' +
    '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>' +
    '<symbol id="i-device" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></symbol>' +
    '<symbol id="i-flag" viewBox="0 0 24 24"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></symbol>' +
    '<symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></symbol>' +
    '<symbol id="i-cloud" viewBox="0 0 24 24"><path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9.5a3.75 3.75 0 0 1 .5 8.5z"/></symbol>' +
    '<symbol id="i-support" viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.6"/><rect x="17.5" y="13" width="4" height="6" rx="1.6"/><path d="M20 19v.5a2.5 2.5 0 0 1-2.5 2.5H13"/></symbol>' +
    '<symbol id="i-grid" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></symbol>' +
    '<symbol id="i-gift" viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2.5 8h19v4h-19zM12 21V8"/><path d="M12 8H7.8a2.4 2.4 0 0 1 0-4.8C11 3.2 12 8 12 8zM12 8h4.2a2.4 2.4 0 0 0 0-4.8C13 3.2 12 8 12 8z"/></symbol>' +
    '<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 19V5M4 19h16"/><path d="M8 15l3.5-4.5 3 2.5L20 7"/></symbol>' +
    '<symbol id="i-pie" viewBox="0 0 24 24"><path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M14 3.3A9 9 0 0 1 20.7 10H14z"/></symbol>' +
    '<symbol id="i-store" viewBox="0 0 24 24"><path d="M4 10v10h16V10"/><path d="M3 4h18l1.2 4.2a3.1 3.1 0 0 1-6 1.3 3.1 3.1 0 0 1-6 0 3.1 3.1 0 0 1-6-1.3z"/><path d="M10 20v-5h4v5"/></symbol>' +
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></symbol>' +
    '<symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 17v.01M12 13.6a2.2 2.2 0 0 0 1.6-3.6A2.2 2.2 0 0 0 9.9 11"/></symbol>' +
    '<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 4l2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8z"/></symbol>' +
    '<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c0-3.9 3.4-6.6 7.5-6.6s7.5 2.7 7.5 6.6"/></symbol>' +
    '<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"/><path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.6c2.4.6 4 2.6 4 5.4"/></symbol>' +
    '<symbol id="i-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></symbol>' +
    '<symbol id="i-box" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></symbol>' +
    '<symbol id="i-catalog" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></symbol>' +
    '<symbol id="i-factory" viewBox="0 0 24 24"><path d="M2 20h20M4 20V10l4-4 4 4v10M16 20v-6a2 2 0 0 1 4 0v6M8 20v-4"/></symbol>' +
    '<symbol id="i-printer" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/></symbol>' +
    '<symbol id="i-share" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M8.5 17.5 12 11l3.5 6.5"/></symbol>' +
    '<symbol id="i-play" viewBox="0 0 24 24"><path d="M22.54 6.42A2.78 2.78 0 0 0 20.6 4.5C18.88 4 12 4 12 4s-6.88 0-8.6.5A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.5C5.12 20 12 20 12 20s6.88 0 8.6-.5a2.78 2.78 0 0 0 1.94-1.92A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><path d="M9.75 15.02 15.5 12 9.75 8.98z"/></symbol>' +
    '<symbol id="i-refresh" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.28-4.93"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></symbol>';

  function inject() {
    if (d.getElementById('neron-sprite')) return;
    var host = d.createElement('div');
    host.id = 'neron-sprite';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    host.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" focusable="false">' + SPRITE + '</svg>';
    d.body.insertBefore(host, d.body.firstChild);
  }

  if (d.body) inject();
  else d.addEventListener('DOMContentLoaded', inject);
})(document);
