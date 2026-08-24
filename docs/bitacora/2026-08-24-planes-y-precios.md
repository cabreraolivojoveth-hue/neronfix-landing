# 24/08/2026 · Tres sistemas, tres planes, tres formas de pago

## Qué se hizo

Salió Neron Caja de la landing y entró Neron Terapias. Ahora el sitio muestra
sólo los tres sistemas por giro: Celulares, Autos y Terapias.

La sección de precios se rehízo entera. Antes mostraba los tres planes de Caja
tomados de la API `caja.neronfix.com/api/planes`, más dos tarjetitas sueltas
con el precio de Autos y de Celulares. Ahora el visitante elige primero su
sistema y después cómo quiere pagar, y ve tres planes: Normal, Premium y Pro.

Los precios quedaron así, con IVA incluido:

| Sistema y plan | Mensual | Trimestral | Anual |
|---|---|---|---|
| Celulares · Normal | $349 | $939 | $3,490 |
| Celulares · Premium | $649 | $1,749 | $6,490 |
| Celulares · Pro | $1,099 | $2,949 | $10,990 |
| Autos · Normal | $849 | $2,290 | $8,490 |
| Autos · Premium | $1,390 | $3,749 | $13,900 |
| Autos · Pro | $2,190 | $5,890 | $21,900 |
| Terapias · Normal | $299 | $799 | $2,990 |
| Terapias · Premium | $649 | $1,749 | $6,490 |
| Terapias · Pro | $1,290 | $3,490 | $12,900 |

El anual siempre son diez mensualidades. El trimestral ronda el 10%.

## Qué se agregó

- `PLANS` y `PERIODS` en `assets/config.js`: los nueve planes con sus funciones
  reales, verificadas contra el código de cada sistema.
- Pestañas de sistema y de forma de pago, generadas de la configuración.
- Renglón de límite en cada tarjeta ("2 usuarios · 1 sucursal").
- Mockup nuevo de Terapias: agenda del día con el aviso de alergias del
  expediente.
- Terapias en el menú de sistemas, en el pie y en los datos estructurados.

## Qué se corrigió de paso

- **El botón de Celulares estaba muerto.** Apuntaba a
  `celulares.neronfix.com`, que contesta 404. El sistema real vive en
  `storephone.neronfix.com`. Se corrigió en la tarjeta, en el pie, en el modal
  de acceso, en los datos estructurados y en las páginas de ayuda y contacto.
- Se quitó el código y los estilos de `plans-other` y `price-mini`, que ya no
  se usan.
- El README decía que existía `assets/contacto.js`; ese archivo no existe.
- README y CLAUDE.md decían que los precios venían de una API. Ya no.

## Qué queda pendiente

- Terapias no tiene subdominio. Mientras no lo tenga, su botón va a WhatsApp y
  no aparece en el modal de "Iniciar sesión".
- Los planes se pueden vender, pero ningún sistema aplica todavía los límites
  de usuarios ni de módulos por plan. Eso se hace dentro de cada producto, no
  aquí.
