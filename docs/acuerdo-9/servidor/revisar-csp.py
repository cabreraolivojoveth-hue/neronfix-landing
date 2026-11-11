#!/usr/bin/env python3
"""revisar-csp.py normal|google <archivo> — dice si una CSP de neronfix.com es la que debe ser (06/11/2026).

normal: EXACTAMENTE la de siempre (la de Vercel): solo lo propio.
google: la normal + SOLO direcciones https de Google, y solo en script-src, img-src, connect-src y
        frame-src. Nada de *, 'unsafe-*', https:, data: ni blob: agregados. Sale 0 si esta bien.
"""
import sys

NORMAL = ("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
          "font-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; "
          "form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests")
GOOGLE = {"https://www.googletagmanager.com", "https://ad.doubleclick.net", "https://www.googleadservices.com", "https://googleads.g.doubleclick.net",
          "https://www.google.com", "https://www.google.com.mx", "https://td.doubleclick.net", "https://bid.g.doubleclick.net"}
DONDE = {"script-src", "img-src", "connect-src", "frame-src"}


def partir(t):
    d = {}
    for parte in t.strip().split(";"):
        w = parte.split()
        if w:
            if w[0] in d:
                raise ValueError(f"directiva repetida: {w[0]}")
            d[w[0]] = w[1:]
    return d


def revisar(modo, texto):
    t = texto.strip()
    if "\n" in t or '"' in t or "$" in t or "\\" in t:
        return "trae saltos de linea, comillas dobles, $ o \\"
    if modo == "normal":
        return None if t == NORMAL else "no es exactamente la CSP normal de siempre"
    try:
        n, g = partir(NORMAL), partir(t)
    except ValueError as e:
        return str(e)
    for k, v in n.items():
        if k not in g:
            return f"le falta {k}"
        if not set(v) <= set(g[k]):
            return f"{k} perdio lo de siempre"
    for k, v in g.items():
        extra = [x for x in v if x not in n.get(k, [])]
        if extra and k not in DONDE:
            return f"{k} no puede abrir nada ({' '.join(extra)})"
        malos = [x for x in extra if x not in GOOGLE]
        if malos:
            return f"{k} abre algo que no es de Google: {' '.join(malos)}"
    return None


if __name__ == "__main__":
    modo, archivo = sys.argv[1], sys.argv[2]
    try:
        txt = open(archivo, encoding="utf-8").read()
    except OSError as e:
        print(f"no pude leer {archivo}: {e}"); sys.exit(1)
    mal = revisar(modo, txt)
    if mal:
        print(f"{archivo}: {mal}"); sys.exit(1)
    sys.exit(0)
