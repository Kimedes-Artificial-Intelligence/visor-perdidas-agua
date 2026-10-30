// ================= Precedencia del dato de pérdidas de un municipio (FWG-1870) =================
// Un municipio puede tener varias fuentes. Se pinta la primera de esta lista que tenga dato:
//   1. aca:    auditoría publicada en el registro de la ACA (Catalunya, F9 agua no registrada)
//   2. art63:  agua no registrada o pérdidas reales en % publicadas por el operador o el ayuntamiento (art. 63.2 RD 3/2023)
//   3. eiel:   pérdidas declaradas en la EIEL. Hay un solo valor por municipio (media de sus núcleos): los valores no
//              redondeados y los múltiplos de 5 no compiten entre sí; la ficha dice qué parte son múltiplos de 5
//   4. ib:     estimación del Govern de les Illes Balears
// El rendimiento, el IFE y el ILI del art. 63.2 no son porcentajes de pérdidas: no entran aquí ni se convierten.
const LOSS_ORDER=["aca","art63","eiel","ib"];
function pickLoss(c){for(const k of LOSS_ORDER)if(c[k])return c[k];return null;}
// Fila del art. 63.2 que se pinta: agua no registrada antes que pérdidas reales; ninguna si solo hay otros indicadores
const A63_PAINT=["ANR","PERDIDAS_REALES"];
function a63Paint(rows){for(const k of A63_PAINT){const r=(rows||[]).find(x=>x[0]===k);if(r)return r;}return null;}
if(typeof module!=="undefined")module.exports={LOSS_ORDER,pickLoss,A63_PAINT,a63Paint};
