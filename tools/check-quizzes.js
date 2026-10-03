global.window = global;
const fs = require('fs');
// las rutas se resuelven relativas a este archivo, para que los tools
// funcionen desde cualquier carpeta y en cualquier maquina
const path = require('path');
const ROOT = path.resolve(__dirname, '..', 'assets', 'data');
const DATA = ROOT + path.sep;
const OUT = path.resolve(__dirname, 'labs.json');
global.EDD = { unidades: [] };
new Function('EDD', fs.readFileSync(DATA + 'units.js', 'utf8'))(global.EDD);
global.EDD.quizzes = {};
new Function('EDD', fs.readFileSync(DATA + 'quizzes.js', 'utf8'))(global.EDD);

const Q = global.EDD.quizzes;
const errs = [];
const ids = global.EDD.unidades.map(u => u.id);

for (const id of Object.keys(Q)) {
  const q = Q[id];
  if (!ids.includes(id)) errs.push(id + ': quiz sin unidad correspondiente');
  const n = q.preguntas.length;
  let pts = 0;
  q.preguntas.forEach((p, i) => {
    const tag = id + '[' + (i + 1) + ']';
    if (!p.t) errs.push(tag + ': sin enunciado');
    if (!p.type) errs.push(tag + ': sin type');
    if (p.ans === undefined) errs.push(tag + ': sin ans');
    if (!p.exp) errs.push(tag + ': sin exp');
    const nOpts = (p.opts || []).length;
    if (['mcq', 'multi', 'tf'].includes(p.type)) {
      if (!p.opts || nOpts < 2) errs.push(tag + ': ' + p.type + ' con ' + nOpts + ' opciones');
      if (p.type === 'mcq') {
        if (typeof p.ans !== 'number' || p.ans < 0 || p.ans >= nOpts) errs.push(tag + ': ans fuera de rango (' + p.ans + '/' + nOpts + ')');
        if (p.opts.filter(o => o === 'Falso' || o === 'Verdadero').length === 2 && p.type !== 'tf') errs.push(tag + ': opciones tf con type mcq');
      }
      if (p.type === 'multi') {
        if (!Array.isArray(p.ans) || !p.ans.length) errs.push(tag + ': multi sin ans array');
        else p.ans.forEach(a => { if (typeof a !== 'number' || a < 0 || a >= nOpts) errs.push(tag + ': ans multi fuera de rango'); });
        if (new Set(p.ans).size !== p.ans.length) errs.push(tag + ': ans multi con indices repetidos');
      }
      if (p.type === 'tf') {
        const vi = p.opts.findIndex(o => o === 'Verdadero');
        const fi = p.opts.findIndex(o => o === 'Falso');
        if (vi < 0 || fi < 0) errs.push(tag + ': tf sin opciones Verdadero/Falso');
      }
    } else if (p.type === 'fill') {
      if (!Array.isArray(p.ans) || !p.ans.length) errs.push(tag + ': fill sin ans array');
    } else if (p.type === 'order') {
      if (!Array.isArray(p.ans)) errs.push(tag + ': order sin ans array');
      else if (p.ans.length !== nOpts) errs.push(tag + ': order con ' + p.ans.length + ' items pero ' + nOpts + ' opciones');
    }
    pts++;
  });
  console.log((q.preguntas.length === n ? 'OK  ' : '??  ') + id + '  ' + String(n).padStart(2) + ' preguntas   ' + q.titulo);
}

console.log('');
if (errs.length) { console.log('PROBLEMAS:'); errs.forEach(e => console.log('  ' + e)); }
else console.log('Sin problemas estructurales.');