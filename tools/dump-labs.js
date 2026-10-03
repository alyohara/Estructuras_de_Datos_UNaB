const fs = require('fs');
global.window = global;
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
global.EDD.tps = [];
new Function('EDD', fs.readFileSync(DATA + 'tps.js', 'utf8'))(global.EDD);
global.EDD.examenes = [];
new Function('EDD', fs.readFileSync(DATA + 'exams.js', 'utf8'))(global.EDD);

const out = [];
for (const u of global.EDD.unidades) {
  (u.labs || []).forEach((l, i) => {
    if (l.tests && l.tests.length) out.push({ id: l.id || ('lab-' + u.id + '-' + i), title: l.title, group: u.id, solution: l.solution, starter: l.starter, tests: l.tests });
  });
}
(global.EDD.tps || []).forEach(tp => {
  if (tp.tests && tp.tests.length) out.push({ id: tp.id, title: tp.titulo, group: 'TP ' + tp.num, solution: tp.solution || tp.starter, starter: tp.starter, tests: tp.tests });
});
(global.EDD.examenes || []).forEach(x => {
  const s = x.stack || {};
  if (s.tests && s.tests.length) out.push({ id: 'stack-' + x.id, title: s.titulo, group: 'EX ' + x.titulo, solution: s.solution, starter: s.starter, tests: s.tests });
});

fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log('bloques con tests: ' + out.length);
for (const l of out) console.log('  ' + l.group.padEnd(8) + ' ' + String(l.tests.length).padStart(2) + 't  ' + l.title.slice(0, 55));