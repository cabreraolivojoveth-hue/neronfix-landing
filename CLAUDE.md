# Instrucciones de trabajo · neronfix-landing

## Publicación (con el Protocolo Maestro, modo directo — 06/11/2026)

Aquí manda `/home/joveth/neron/protocolo` (sin «sí» de Joveth, pero con su comparativa
toda en APROBADO). **Nunca** `git push origin main` ni `publicar.sh` a mano: así se
publicaron `ec882f9` y `831c464` y la guardia e-protocolo lo marcó «FUERA DEL PROTOCOLO».

1. Cambio en esta carpeta (rama `main`), `git commit`.
2. `python3 /home/joveth/neron/protocolo/comparar.py /home/joveth/neron/repos/neronfix-landing --que "…" --visto <capturas>`
   — corre `neron-landing/pruebas/probar-en-neron-2.sh` en A y en B: sirve el árbol con el
   MISMO nginx de producción en un contenedor desechable de **neron-2** y pasa
   `prueba-landing.mjs` con Chromium (nunca en el servidor).
3. Las revisiones que pida su nivel (`revision.py`, luego `comparar.py --releer`).
4. `python3 /home/joveth/neron/protocolo/publicar.py landing-neronfix --comparativa <json>`:
   corre `neron-landing/publicar.sh` (copia `main` a `sitio/`), sube `main` a GitHub y
   comprueba que internet sirve el `index.html` del commit.
5. Verificar en vivo con `curl` y `guardia.py --detalle`; renglón en `memoria/landing/BITACORA.md`.

## Despliegue

- Hosting: **el servidor NERON** (orden de Joveth, 02/11/2026): contenedor
  `neron-landing` (127.0.0.1:8081, nginx con las mismas cabeceras y redirecciones
  que tenía `vercel.json`) detrás del túnel de Cloudflare. Lo llena SOLO
  `neron-landing/publicar.sh` con la rama **`main`**.
- La mudanza del dominio la hace `neron-landing/mudar-al-servidor.sh` (sudo, una
  vez). Hasta que se corra, Vercel sigue entregando lo que se empuja a `main`.
- `vercel.json` se queda como respaldo para regresar; si cambian cabeceras, se
  cambian en los dos.
- Dominio real: **`https://www.neronfix.com`** (el apex responde 301 hacia www).

## Reglas del proyecto

- **Logo oficial (Joveth, 01/11/2026): `logo-oficial.png`**, marca «NO» + «NERON»
  en negro sobre blanco (1254×1254). Se copia tal cual, sin retocar; no se cambia
  su forma ni su color. Todo lo demás sale de él: `logo-oficial-cabecera.png`
  (marca + palabra en negro, fondo transparente, para la cabecera),
  `favicon-32.png`, `favicon-192.png`, `favicon-512.png` y `apple-touch-icon.png`
  (solo la marca «NO» negra sobre blanco, con CENTRADO ÓPTICO: el centro de peso al
  centro horizontal, en vertical a la mitad entre peso y bordes; margen ≥12%) y, para el
  perfil de Google, `logo-perfil.png` (720, solo la marca, ~58% del ancho) y
  `logo-perfil-completo.png` (1080, marca + palabra), que no se ligan desde la página. Nada de versiones
  vino, plateadas o con brillo. Las variantes viejas se borraron (siguen en git).
  Si se rehacen los iconos, cambiar el `?v=` de sus enlaces para que el navegador
  no muestre el viejo.
- **Videos (02/11/2026):** la fila «Aprende a usar StorePhone» sale del RSS público del
  canal https://www.youtube.com/@neronfix. `neron-landing/videos.py` (cron cada 30 min)
  deja `datos/videos.json` y las miniaturas; nginx las prefiere sobre `videos.json` y
  `videos/` del repo (la lista de la última publicación). Al publicar, refrescar el
  bloque con `neron-landing/videos.py --html index.html` (los títulos van en el HTML
  para buscadores). Nada de reproductor de YouTube en la página: el video abre en
  YouTube, en otra pestaña.
- **Movimiento (02/11/2026): `movimiento.js`** hace el carrusel de planes (puntitos,
  flechas con ratón, arranca en Premium; en ≥1000px van los 3 juntos), el avance solo de
  los videos (4.5 s; se pausa con ratón, dedo, foco, fuera de pantalla o pestaña oculta)
  y el aparecer al bajar (`.rv`). Con «reducir movimiento» nada se mueve solo. Sin
  efectos con rebote; solo opacidad y desplazamientos ≤12px.
- **Sin internet (StorePhone 1.20.0):** solo cobrar de contado lo que no lleva IMEI y
  abrir caja. Si la app cambia (paso B: IMEI sin red), se cambian la tarjeta y la
  pregunta «¿Funciona sin internet?» (visible y JSON-LD).
- **No se inventan datos.** Nada de clientes, ventas, estadísticas,
  testimonios ni certificaciones sin respaldo real. Lo que no exista se deja
  sin pintar (ver el hueco comentado «Clientes que ya lo usan» en `index.html`).
- **Desde el 23/10/2026 la página es de UN SOLO programa: StorePhone** (por
  Neron). Neron One, Neron Autos y Terapias no se mencionan.
- **«Neron Fix» = SOLO StorePhone (Joveth, 02/11/2026).** En el JSON-LD la empresa se llama
  «Neron Fix» (logo oficial, YouTube, perfil de Google) y su único producto es el
  SoftwareApplication StorePhone; las 4 páginas para buscadores lo publican «Neron Fix» con el
  mismo `@id`. `/llms.txt` lo dice para las IAs. Ninguna palabra de otros giros en nada servido
  (la prueba lo vigila). Los sistemas de clientes (autos., estetica., terapias., one.,
  storephone.) mandan `X-Robots-Tag: noindex` desde su servidor.
- **El contenido vive en `index.html`, escrito en el HTML** (sin scripts), para
  que los buscadores lo lean tal cual. Ya no hay `assets/`: lo viejo está en git.
- **Precios (02/10/2026, solo mensual, IVA incluido):** Normal $450 (2 usuarios ·
  1 sucursal), Premium $750 (5 usuarios · 1 sucursal), Pro desde $1,250 (usuarios
  ilimitados · 2 sucursales; +$280 por sucursal extra). Aparecen en las tarjetas,
  en la pregunta «¿Cuánto cuesta?» y en el JSON-LD: si cambian, se cambian en los
  tres; la prueba (`neron-landing/pruebas/prueba-landing.mjs`) vigila que
  coincidan, y que las preguntas del JSON-LD sean idénticas a las visibles.
- **Alta cerrada:** todo botón de alta abre WhatsApp 646 287 5283 con «Hola,
  quiero acceso a StorePhone[, me interesa el plan X]». Nada de «crear cuenta»,
  «gratis» ni «sin tarjeta». `storephone.neronfix.com` solo se liga como «Entrar».
- **Medición (06/11/2026): `medicion.js`** (portada y las 4 páginas para buscadores). Cada
  toque a un botón de WhatsApp manda una marca vacía a NUESTRO servidor (`POST /clic?d=botón&p=página&a=1|0`,
  nginx contesta 204 y solo queda en su registro); la cuenta `neron-landing/clics.py`. Sin cookies
  ni nada de fuera. La **etiqueta de Google Ads está lista y APAGADA**: `GOOGLE_ADS` y
  `ETIQUETA_WHATSAPP` vacíos = no se carga nada de Google. Se enciende con los dos datos que dé
  Joveth (nunca inventados) + `neron-landing/google-ads.sh encender` (abre la CSP con
  `servidor/csp-con-google.txt`). La prueba vigila que con la CSP normal Google quede bloqueado y
  con la de Google cargue y mande la conversión.
- `faq.html` y `contacto.html` ya no existen: `vercel.json` los redirige a `/`.

## Después de desplegar

Avisar al usuario que haga refresco forzado (`Ctrl+Shift+R` / `Cmd+Shift+R`)
si el navegador conserva en caché el logotipo o el favicon anteriores.

Consulta `README.md` para la arquitectura y dónde se edita cada cosa.
