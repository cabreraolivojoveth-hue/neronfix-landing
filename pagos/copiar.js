/* Copiar con un toque (página /pagos/, 03/11/2026). Funciona con el portapapeles
   moderno y, si el navegador no lo deja (WhatsApp por dentro, http), con el método viejo. */
(function () {
  function copiarViejo(texto) {
    var t = document.createElement('textarea');
    t.value = texto;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    t.setSelectionRange(0, texto.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  }
  function avisar(boton, ok) {
    var antes = boton.getAttribute('data-antes') || boton.textContent;
    boton.setAttribute('data-antes', antes);
    boton.textContent = ok ? (boton.getAttribute('data-listo') || '✓ Copiado') : 'Mantén presionado para copiar';
    boton.classList.toggle('listo', ok);
    clearTimeout(boton._t);
    boton._t = setTimeout(function () { boton.textContent = antes; boton.classList.remove('listo'); }, 2200);
  }
  document.addEventListener('click', function (ev) {
    var boton = ev.target.closest('[data-copiar]');
    if (!boton) return;
    var texto = boton.getAttribute('data-copiar');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(function () { avisar(boton, true); }, function () { avisar(boton, copiarViejo(texto)); });
    } else {
      avisar(boton, copiarViejo(texto));
    }
  });
})();
