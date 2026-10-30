# Bandeja de entrada de descargas manuales

Aquí se dejan los archivos que solo se pueden descargar a mano: webs que responden 403, con desafío anti-bots, con un `robots.txt` que no admite la consulta automatizada o que piden iniciar sesión. Nadie salta esas protecciones; las descarga una persona (David) desde su navegador.

## Cómo dejar un archivo

1. Descarga el documento (PDF, xlsx o csv) desde la URL exacta de la lista de descargas manuales del ticket.
2. Ponle el nombre `<fuente>_<AAAA-MM-DD>.<ext>`, con la fecha del día de la descarga. Ejemplos: `aqualia-vigo_2026-11-03.pdf`, `ersar-rasarp_2026-11-03.xlsx`.
3. Súbelo a esta carpeta, en una rama y un pull request propios o en el de la parte en curso. Si el documento no dice en qué URL estaba, añade un archivo `<fuente>_<AAAA-MM-DD>.txt` con la URL.

## Cómo se incorpora

Al empezar cada parte de trabajo se revisa esta carpeta:

1. Se transcribe lo que el archivo publica a su archivo de `raw/` (por ejemplo `raw/operadores_art63_2026-10.psv`), con la URL, la fecha de consulta (la de la descarga), el año del dato, el aviso legal y el SHA-256 del archivo. Nunca se calcula ni se estima nada.
2. Se cita en la ficha, en `data/sources.md` y en `DATA-LICENSES.md`.
3. Se borra el archivo de esta carpeta en el mismo pull request. Solo se guarda el original en `raw/` si su licencia permite la copia; si no, queda su URL y su SHA-256.

Esta carpeta debe estar vacía (salvo este README) en `main`.
