// smoke-dom.js -- Monta cada pagina con un DOM minimo y reporta errores de runtime.
// No usa jsdom: el shim implementa solo lo que el sitio realmente necesita.

/* Smoke test: ejecuta core, quiz, pyodide, los viz, los datos y pages en un
   DOM minimo y monta cada pagina. Detecta errores de runtime. */
const fs = require('fs');
const path = require('path');
const WEB = 'D:/UNaB/2024 - Estructuras de Datos/web';

/* ---------- mini selector: tag / .clase / #id ---------- */
const REG = [];
function reg(e) { REG.push(e); return e; }
function parse(sel) {
  const m = String(sel).trim().match(/^([a-zA-Z][\w-]*)?((?:[.#][\w-]+)*)$/);
  if (!m) return null;
  const parts = { tag: m[1] ? m[1].toUpperCase() : null, cls: [], id: null };
  (m[2] || '').split(/(?=[.#])/).forEach(p => {
    if (p[0] === '.') parts.cls.push(p.slice(1)); else if (p[0] === '#') parts.id = p.slice(1);
  });
  return parts;
}
function matches(e, p) {
  if (p.tag && e.tagName !== p.tag) return false;
  if (p.id && e.attrs.id !== p.id) return false;
  for (const c of p.cls) {
    if (!String(e.attrs.class || '').split(/\s+/).includes(c)) return false;
  }
  return true;
}
function findAll(sel, root) {
  const p = parse(sel);
  if (!p) return [];
  const pool = root ? REG.filter(e => isDesc(e, root)) : REG.filter(e => attached(e));
  return pool.filter(e => matches(e, p));
}
function attached(e) {
  if (e === bodyEl || e === head || e.tagName === 'HTML') return true;
  let p = e.parentNode;
  while (p) { if (p === bodyEl || p === head) return true; p = p.parentNode; }
  return false;
}
function isDesc(e, root) {
  let p = e.parentNode;
  while (p) { if (p === root) return true; p = p.parentNode; }
  return false;
}

/* ---------- DOM minimo ---------- */
let idc = 0;
class El {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this.children = []; this.attrs = {}; this._text = ''; this._html = '';
    this.style = {}; this.dataset = {}; this.classList = makeCL(this); this.__id = ++idc;
    this.parentNode = null; this.value = ''; this.checked = false; this.disabled = false; reg(this);
  }
  set className(v) { this.attrs.class = v; } get className() { return this.attrs.class || ''; }
  set textContent(v) { this._text = String(v); this.children = []; } get textContent() { return this._text; }
  set innerHTML(v) {
    this._html = String(v); this.children = [];
    /* parser muy crudo: solo registra id/clase para que qs() los encuentre */
    const re = /<([a-zA-Z][\w-]*)((?:\s+[^<>]*?)?)\/?>/g; let m;
    while ((m = re.exec(this._html))) {
      const e = new El(m[1]); e.parentNode = this;
      const attrs = m[2] || '';
      const id = attrs.match(/id\s*=\s*"([^"]*)"/); if (id) e.attrs.id = id[1];
      const cl = attrs.match(/class\s*=\s*"([^"]*)"/); if (cl) e.attrs.class = cl[1];
      e.__raw = m[0];
      if (this.tagName === 'SELECT') {
        const v = m[2] && (m[2].match(/value\s*=\s*"([^"]*)"/) || [])[1];
        if (v !== undefined && !this.value) this.value = v;   /* el navegador elige la primera opcion */
      }
    }
  } get innerHTML() { return this._html; }
  appendChild(c) {
    if (c) c.parentNode = this;
    if (this.tagName === 'SELECT' && c && c.tagName === 'OPTION' && !this.value) this.value = c.attrs.value || c.value || '';
    this.children.push(c); return c;
  }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); if (c) c.parentNode = null; }
  insertBefore(c) { if (c) c.parentNode = this; this.children.push(c); return c; }
  replaceChild(n, o) { const i = this.children.indexOf(o); this.children[i] = n; }
  remove() {}
  setAttribute(k, v) { this.attrs[k] = v; } getAttribute(k) { return this.attrs[k]; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener() {} removeEventListener() {}
  querySelector() { return null; } querySelectorAll() { return []; }
  getBoundingClientRect() { return { width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40 }; }
  focus() {} blur() {} click() {}
  contains() { return false; }
  get firstChild() { return this.children[0] || null; }
  get lastChild() { return this.children[this.children.length - 1] || null; }
}
function makeCL(el) {
  const set = new Set(String(el.attrs.class || '').split(/\s+/).filter(Boolean));
  return {
    add: (...c) => c.forEach(x => set.add(x)),
    remove: (...c) => c.forEach(x => set.delete(x)),
    toggle: (c, f) => { const on = f === undefined ? !set.has(c) : f; on ? set.add(c) : set.delete(c); return on; },
    contains: c => set.has(c)
  };
}
El.prototype.querySelector = function (s) { const r = findAll(s, this); return r[0] || null; };
El.prototype.querySelectorAll = function (s) { return findAll(s, this); };

const bodyEl = new El('body');
const mount = new El('main'); mount.className = 'wrap';
bodyEl.appendChild(mount);
const head = new El('head');

const store = {};
const ALL = [];
const doc = {
  readyState: 'complete',
  body: bodyEl, head: head, documentElement: new El('html'),
  title: '',
  createElement: t => new El(t),
  createElementNS: (ns, t) => new El(t),
  createTextNode: t => { const e = new El('#text'); e._text = t; return e; },
  createDocumentFragment: () => new El('#frag'),
  querySelector: s => findAll(s)[0] || null,
  querySelectorAll: s => findAll(s),
  getElementById: id => findAll('#' + id)[0] || null,
  getElementsByTagName: t => (t === 'head' ? [head] : t === 'body' ? [bodyEl] : t === 'main' ? [mount] : []),
  addEventListener() {}, removeEventListener() {},
  execCommand: () => true
};
const storeObj = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; }
};
global.window = global;
global.document = doc;
global.localStorage = storeObj;
global.navigator = { userAgent: 'node', language: 'es' };
global.location = { href: 'http://localhost/u1/index.html', pathname: '/u1/index.html', origin: 'http://localhost', search: '' };
global.history = { replaceState() {} };
global.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
global.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
global.cancelAnimationFrame = id => clearTimeout(id);
global.getComputedStyle = () => ({ getPropertyValue: () => '' });
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
global.alert = () => {};
global.Blob = class { constructor() {} };
global.URL.createObjectURL = () => 'blob:x';
global.URL.revokeObjectURL = () => {};
global.FileReader = class { readAsText() {} };
global.Image = class { set src(v) {} get src() { return ''; } addEventListener() {} };
global.SVGElement = El;
global.Event = class { constructor(t) { this.type = t; } };
global.CustomEvent = global.Event;

const EDD = global.EDD = {};

/* ---------- carga los scripts como lo hace el navegador ---------- */
const order = [
  'assets/js/core.js', 'assets/js/quiz.js', 'assets/js/pyodide.js',
  'assets/js/viz-linear.js', 'assets/js/viz-tree.js', 'assets/js/viz-heap.js',
  'assets/js/viz-graph.js', 'assets/js/viz-recursion.js', 'assets/js/viz-sorting.js',
  'assets/data/units.js', 'assets/data/quizzes.js', 'assets/data/tps.js', 'assets/data/exams.js',
  'assets/js/pages.js'
];
for (const f of order) {
  const src = fs.readFileSync(path.join(WEB, f), 'utf8');
  try { new Function(src)(); }
  catch (e) { console.log('ERROR AL CARGAR ' + f + ': ' + e.message); process.exitCode = 1; }
}

const PAGES = {
  'u1': 'unitPage', 'u2': 'unitPage', 'u3': 'unitPage', 'u4': 'unitPage',
  'u5': 'unitPage', 'u6': 'unitPage', 'u7': 'unitPage', 'u8': 'unitPage',
  'u9': 'unitPage', 'u10': 'unitPage',
  'tp': 'tpPage', 'exams': 'examsPage', 'downloads': 'downloadsPage'
};
let errs = 0;
const call = (fn, arg) => { try { fn.call(EDD, arg); } catch (e) { errs++; console.log('  ERROR en ' + fn.name + '(' + (arg || '') + '): ' + e.message + '\n    ' + (e.stack || '').split('\n')[1]); } };

for (const u of EDD.unidades) {
  const real = location.pathname; location.pathname = '/' + u.id + '/index.html';
  doc.title = '';
  call(EDD.homePage); call(EDD.unitPage, u.id);
  location.pathname = real;
}
location.pathname = '/tp/index.html'; call(EDD.tpPage);
location.pathname = '/exams/index.html'; call(EDD.examsPage);
location.pathname = '/downloads/index.html'; call(EDD.downloadsPage);

/* progreso y export/import */
try { EDD.progress.setStudent({ nombre: 'Test', legajo: '123' }); EDD.progress.save(); EDD.progress.stats(); EDD.progress.exportJSON(); }
catch (e) { errs++; console.log('  ERROR en progreso: ' + e.message); }
for (const u of EDD.unidades) {
  try { EDD.progress.unitPct(u.id); EDD.progress.unitItems(u.id); } catch (e) { errs++; console.log('  ERROR unitPct ' + u.id + ': ' + e.message); }
}
const st = EDD.progress.stats();
console.log('');
console.log('Paginas montadas : ' + (EDD.unidades.length + 3));
console.log('Quizzes          : ' + EDD.quizRegistry.length + ' (total ' + EDD.quizRegistry.reduce((a, q) => a + (q.total || 0), 0) + ' pts)');
console.log('Labs             : ' + EDD.labTotal);
console.log('Visualizadores   : ' + EDD.vizRegistry.length);
console.log('Progreso global  : ' + st.pct() + '%');
console.log('');
console.log(errs ? ('ERRORES DE RUNTIME: ' + errs) : 'Sin errores de runtime en ninguna pagina.');
if (errs) process.exitCode = 1;