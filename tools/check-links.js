/* Verifica que TODO lo referenciado exista en disco. */
const fs = require('fs');
const path = require('path');
const WEB = path.resolve(__dirname, '..');

const errs = [];
const warn = [];
function chkAbs(abs, ctx) {
  if (!fs.existsSync(abs)) errs.push('FALTA  ' + path.relative(WEB, abs).replace(/\\/g, '/') + '   <- ' + ctx);
}
function chkRel(rel, ctx) {
  chkAbs(path.join(WEB, rel), ctx);
}

/* 1) HTML: cada src/href resuelto desde el directorio del propio HTML */
const htmls = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmls.push(p);
  }
})(WEB);

for (const h of htmls) {
  const src = fs.readFileSync(h, 'utf8');
  const ctx = path.relative(WEB, h).replace(/\\/g, '/');
  const re = /(?:src|href)\s*=\s*"([^"]+)"/g;
  let g;
  while ((g = re.exec(src))) {
    const ref = g[1].trim();
    if (!ref || /^(https?:|data:|mailto:|#|javascript:)/i.test(ref)) continue;
    chkAbs(path.resolve(path.dirname(h), ref.split('#')[0].split('?')[0]), ctx);
  }
}

/* 2) descargas declaradas en el codigo (comillas ya incluidas en el match) */
function scanDownloads(file) {
  const src = fs.readFileSync(path.join(WEB, file), 'utf8');
  /* 'tp/' aparece en la pagina TP, asi que solo se aceptan archivos reales */
  const re = /['"](?:slides|apuntes|examenes|codigo|notebooks|imagenes)\/[^'"]+['"]|['"]tp\/(?!index\.html)[^'"]+\.[a-z0-9]+['"]/gi;
  const out = new Set();
  let m;
  while ((m = re.exec(src))) out.add(m[0].slice(1, -1));
  return out;
}
const refs = new Set([...scanDownloads('assets/js/pages.js'), ...scanDownloads('assets/data/units.js')]);
for (const r of refs) chkRel('downloads/' + r, 'declarado en el codigo');

/* 3) archivos huerfanos en downloads que nadie enlaza */
const onDisk = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name !== 'index.html') onDisk.push(path.relative(WEB, p).replace(/\\/g, '/'));
  }
})(path.join(WEB, 'downloads'));
const huerfanos = onDisk.filter(p => !refs.has(p.replace('downloads/', '')));

/* 4) catalogo */
global.window = global;
global.EDD = { unidades: [] };
new Function('EDD', fs.readFileSync(path.join(WEB, 'assets/data/units.js'), 'utf8'))(global.EDD);
const us = global.EDD.unidades;
for (const u of us) chkRel(u.id + '/index.html', 'unidad ' + u.id);

global.EDD.quizzes = {};
new Function('EDD', fs.readFileSync(path.join(WEB, 'assets/data/quizzes.js'), 'utf8'))(global.EDD);
for (const u of us) if (!global.EDD.quizzes[u.id]) errs.push('FALTA  quiz para ' + u.id);

/* 5) labs */
let labs = 0, conTests = 0;
for (const u of us) {
  (u.labs || []).forEach((l, i) => {
    labs++;
    const id = l.id || ('lab-' + u.id + '-' + i);
    if (l.tests && l.tests.length) {
      conTests++;
      if (!l.solution) errs.push('FALTA  solution en ' + id);
      if (!l.starter) errs.push('FALTA  starter en ' + id);
      (l.tests || []).forEach((t, k) => {
        if (!t.name || !t.code) errs.push('FALTA  test incompleto ' + id + '[' + k + ']');
      });
    }
  });
}

/* 6) secciones de teoria: h sin html */
let secciones = 0;
for (const u of us) for (const s of (u.secciones || [])) { secciones++; if (!s.html) errs.push('FALTA  html en seccion "' + s.h + '" de ' + u.id); }

console.log('HTML revisados        : ' + htmls.length);
console.log('Unidades              : ' + us.length);
console.log('Refs de downloads    : ' + refs.size);
console.log('Archivos en downloads : ' + onDisk.length);
console.log('Labs / con tests      : ' + labs + ' / ' + conTests);
console.log('Secciones de teoria  : ' + secciones);
console.log('');
if (huerfanos.length) { console.log('SIN ENLAZAR (' + huerfanos.length + '):'); huerfanos.forEach(h => console.log('  ' + h)); console.log(''); }
if (warn.length) { console.log('AVISOS:'); warn.forEach(w => console.log('  ' + w)); console.log(''); }
if (errs.length) { console.log('ERRORES (' + errs.length + '):'); errs.forEach(e => console.log('  ' + e)); process.exitCode = 1; }
else console.log('TODO OK: no falta ningun archivo referenciado.');