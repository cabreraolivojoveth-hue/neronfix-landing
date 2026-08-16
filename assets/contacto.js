/* ==========================================================================
   NERON · Página de contacto
   Muestra la tarjeta de correo únicamente cuando CONTACT_CONFIG.email
   tiene un valor real. Antes había un enlace "mailto:PENDIENTE" publicado.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var C = w.NERON_CONFIG;
  if (!C) return;

  var email = (C.CONTACT_CONFIG.email || '').trim();
  var card = d.getElementById('card-email');
  if (!card) return;

  if (!email) { card.hidden = true; return; }

  card.href = 'mailto:' + email;
  card.hidden = false;
  var dato = d.getElementById('dato-email');
  if (dato) dato.textContent = email;
  card.setAttribute('data-track', 'email_click');
})(window, document);
