# Instrucciones de trabajo · neronfix-landing

## Publicación

**Publica siempre, sin preguntar.** El dueño del proyecto dio autorización
permanente para desplegar a producción sin confirmación previa.

Flujo de cada cambio:

1. Hacer el cambio y probarlo.
2. `git commit` con mensaje descriptivo.
3. `git push origin main` — esto dispara el build de producción en Vercel.
4. Mantener la rama de trabajo asignada al día con `main`.
5. **Verificar en vivo** con `curl` contra `https://www.neronfix.com` que los
   archivos nuevos responden 200 antes de dar el trabajo por terminado.

No hace falta abrir pull request ni esperar aprobación.

## Despliegue

- Hosting: **Vercel**, conectado al repositorio de GitHub.
- Rama de producción: **`main`**. Cualquier otra rama solo genera preview.
- No hay Vercel CLI ni token en el entorno: el único modo de desplegar es
  empujar a `main`.
- Dominio real: **`https://www.neronfix.com`** (el apex responde 301 hacia www).

## Reglas del proyecto

- **El logotipo no se modifica.** Los archivos `logo-final.png`,
  `logo-principal-full.png`, `logo-mono.png` y `logo-neron.png` se conservan
  tal cual. `logo-header.png` es una copia a escala exacta 1:3 del original,
  solo para aligerar el header.
- **No se inventan datos.** Nada de clientes, ventas, estadísticas,
  testimonios ni certificaciones sin respaldo real. Lo que no exista se deja
  como placeholder desactivado en `assets/config.js`.
- **El contenido se edita en `assets/config.js`**, no en el HTML.
- **Los precios viven en `PLANS` de `assets/config.js`**, no en una API. La
  escalera no se rompe: el anual son diez mensualidades y el trimestral ronda
  el 10% de descuento sobre tres meses. Se publican con IVA incluido.
- **Un sistema sin `url` va a WhatsApp**, nunca a un subdominio que no exista.
  Ya pasó con `celulares.neronfix.com`, que contestaba 404 y dejaba muerto el
  botón principal de la tarjeta; el sistema real vive en `storephone`.

## Después de desplegar

Avisar al usuario que haga refresco forzado (`Ctrl+Shift+R` / `Cmd+Shift+R`)
si el navegador conserva en caché el logotipo o el favicon anteriores.

Consulta `README.md` para la arquitectura y dónde se edita cada cosa.
