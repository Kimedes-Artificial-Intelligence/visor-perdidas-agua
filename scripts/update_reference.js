// Sustituye la referencia de regresión por la página generada. Solo en pull requests que cambian datos o diseño a propósito.
const fs=require('fs');
fs.copyFileSync('dist/index.html','reference/perdidas-agua-europa.html');
console.log('reference/perdidas-agua-europa.html actualizado desde dist/index.html');
