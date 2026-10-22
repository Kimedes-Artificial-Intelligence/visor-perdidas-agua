# Visor de pérdidas de agua

Mapa interactivo de las pérdidas de agua en las redes de abastecimiento, en cuatro niveles:

- **Europa:** agua no registrada, pérdidas reales e índice lineal por país (EurEau; España con INE 2024).
- **España:** serie 2008-2024 por comunidad autónoma (INE, tabla 53447).
- **España por municipio:** los 8.131 municipios, con dato donde se publica por municipio: Catalunya (auditorías) e Illes Balears (estimación del Govern IB, 2000-2024). El resto, en gris con el motivo. Con zoom y selector de comunidad.
- **Catalunya:** agua no registrada por municipio, a partir de las auditorías de eficiencia hidráulica publicadas (ACA y operadores, 2024 y 2022).

Cada dato visible lleva su año y su fuente. Donde no hay dato publicado, el municipio aparece en gris con el texto "sin dato publicado". No hay valores estimados.

La página es un único archivo HTML sin dependencias en tiempo de ejecución, salvo las fuentes de Google Fonts.

## Generar la página

Necesitas Node 24 o posterior.

```bash
npm ci
npm run build
```

El resultado se escribe en `dist/index.html`. Puedes abrirlo directamente en el navegador.

## Estructura

| Carpeta | Contenido |
|---|---|
| `raw/` | Transcripciones de cada fuente, tal como se publicaron. Es el origen de todos los datos. |
| `data/` | Datos intermedios generados desde `raw/`, y `sources.md` con el detalle de fuentes, decisiones y discrepancias. |
| `src/` | Código de la página: `body.html`, `app.js`, estilos y geometría base. |
| `scripts/` | Generación de los datos y ensamblado de la página. |
| `tests/` | Verificaciones automáticas. |
| `reference/` | Versión 2 publicada, usada como referencia de regresión. |
| `dist/` | Salida de la generación. No se guarda en el repositorio. |

## Fuentes y licencias

El código se publica con licencia MIT (`LICENSE`). Los datos conservan la licencia de su fuente original: consulta `DATA-LICENSES.md`. El detalle de cada fuente, la fecha de consulta y las decisiones aplicadas están en `data/sources.md`.

## Cómo contribuir

Todo cambio entra por pull request y solo se une a `main` con las verificaciones en verde. Las correcciones de datos deben cambiar primero el archivo de `raw/` del que proceden.
