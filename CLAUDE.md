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
- **No se inventan datos.** Nada de clientes, ventas, estadísticas,
  testimonios ni certificaciones sin respaldo real. Lo que no exista se deja
  sin pintar (ver el hueco comentado «Clientes que ya lo usan» en `index.html`).
- **Desde el 23/10/2026 la página es de UN SOLO programa: StorePhone** (por
  Neron). Neron One, Neron Autos y Terapias no se mencionan.
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
- `faq.html` y `contacto.html` ya no existen: `vercel.json` los redirige a `/`.

## Después de desplegar

Avisar al usuario que haga refresco forzado (`Ctrl+Shift+R` / `Cmd+Shift+R`)
si el navegador conserva en caché el logotipo o el favicon anteriores.

Consulta `README.md` para la arquitectura y dónde se edita cada cosa.
