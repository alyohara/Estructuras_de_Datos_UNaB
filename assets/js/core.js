/* ============================================================
   EDD — Núcleo: navegación, progreso, almacenamiento, utilidades
   Script clásico (sin módulos) para que funcione en file://
   ============================================================ */
(function (global) {
  'use strict';

  var EDD = global.EDD = global.EDD || {};

  /* URL absoluta de este propio script, capturada mientras se ejecuta
     (document.currentScript deja de estar disponible después). */
  var SELF_SRC = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src;
    var all = document.getElementsByTagName('script');
    for (var i = 0; i < all.length; i++) {
      if (all[i].src && /\/assets\/js\/core\.js(\?|#|$)/.test(all[i].src)) return all[i].src;
    }
    return '';
  })();

  /* ---------------- Utilidades ---------------- */
  var U = EDD.util = {
    el: function (tag, attrs, children) {
      var e = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'html') e.innerHTML = attrs[k];
        else if (k === 'text') e.textContent = attrs[k];
        else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
      });
      (Array.isArray(children) ? children : children ? [children] : []).forEach(function (c) {
        if (c == null || c === false) return;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
      return e;
    },
    qs: function (s, r) { return (r || document).querySelector(s); },
    qsa: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    /** Escapa HTML para insertar texto de usuario o contenido. */
    esc: function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    /** Resalta sintaxis Python de forma conservadora (para código de ejemplo). */
    py: function (code) {
      var out = U.esc(code);
      var kw = /\b(def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|with|try|except|finally|raise|lambda|pass|break|continue|global|nonlocal|yield|assert|del|global|async|await|self|super|init|len|range|print|input|int|float|str|list|dict|set|tuple|bool|sorted|min|max|sum|abs|enumerate|zip|reversed|append|extend|pop|insert|remove|items|keys|values|get|popleft|isinstance|type)\b/g;
      out = out.replace(/(&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;|&#39;&#39;&#39;[\s\S]*?&#39;&#39;&#39;)/g, '\u0001$1\u0002');
      out = out.replace(/(#[^\n]*)/g, '\u0003$1\u0002');
      out = out.replace(kw, '<span class="tok-kw">$1</span>');
      out = out.replace(/(&quot;[^&\n]*?&quot;|&#39;[^&\n]*?&#39;)/g, '<span class="tok-str">$1</span>');
      out = out.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
      out = out.replace(/\u0001([\s\S]*?)\u0002/g, '<span class="tok-com">$1</span>');
      out = out.replace(/\u0003([^\n]*)\u0002/g, '<span class="tok-com">$1</span>');
      return out;
    },
    /** Inserta un bloque de código con botón copiar. */
    code: function (code, lang) {
      var pre = U.el('pre', { html: '<code>' + U.py(code) + '</code>' });
      var wrap = U.el('div', { class: 'codeblock' }, [
        pre,
        lang ? U.el('span', { class: 'lang', text: lang }) : null,
        U.el('button', {
          class: 'btn sm copy', text: 'copiar',
          onclick: function () {
            var b = this;
            function ok() {
              EDD.util.toast('Código copiado', 'ok');
              b.textContent = '¡copiado!';
              setTimeout(function () { b.textContent = 'copiar'; }, 1400);
            }
            /* navigator.clipboard no existe en contextos no seguros (http sin TLS). */
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(code).then(ok, function () { fallback(); });
            } else {
              fallback();
            }
            function fallback() {
              var ta = document.createElement('textarea');
              ta.value = code;
              ta.setAttribute('readonly', '');
              ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
              document.body.appendChild(ta);
              ta.select();
              var done = false;
              try { done = document.execCommand('copy'); } catch (e) { done = false; }
              document.body.removeChild(ta);
              if (done) ok();
              else EDD.util.toast('No se pudo copiar. Seleccioná el código a mano.', 'err');
            }
          }
        })
      ]);
      return wrap;
    },
    /** Construye una tabla desde {head:[], rows:[[]]}. */
    table: function (head, rows, cls) {
      var t = U.el('table', { class: cls || '' });
      if (head) t.appendChild(U.el('thead', null, U.el('tr', null, head.map(function (h) { return U.el('th', { html: h }); }))));
      t.appendChild(U.el('tbody', null, rows.map(function (r) {
        return U.el('tr', null, r.map(function (c) { return U.el('td', { html: c }); }));
      })));
      return U.el('div', { class: 'table-wrap' }, t);
    },
    toast: (function () {
      var el;
      return function (msg, kind, ms) {
        if (!el) { el = U.el('div', { class: 'toast' }); document.body.appendChild(el); }
        el.className = 'toast show ' + (kind || '');
        el.innerHTML = U.esc(msg);
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.className = 'toast ' + (kind || ''); }, ms || 2200);
      };
    })(),
    /** Base path del sitio (con barra final) para resolver links desde subcarpetas.
        Orden de precedencia: window.EDD_ROOT → <html data-root> → ruta de este script. */
    root: function () {
      if (U._root != null) return U._root;
      var r = null;
      if (typeof global.EDD_ROOT === 'string' && global.EDD_ROOT) {
        r = global.EDD_ROOT;
      } else if (document.documentElement) {
        r = document.documentElement.getAttribute('data-root');
      }
      if (!r && SELF_SRC) {
        var i = SELF_SRC.lastIndexOf('/assets/js/');
        if (i >= 0) r = SELF_SRC.slice(0, i + 1);
      }
      U._root = r || './';
      return U._root;
    },
    /** Reinicia el cache de root() (solo para pruebas). */
    _root: null,
    link: function (rel) {
      var r = U.root();
      return r + rel;
    },
    shuffle: function (arr, seed) {
      var a = arr.slice(), i, j, t;
      var rnd = seed == null ? Math.random : function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      for (i = a.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    sample: function (arr, n, seed) { return U.shuffle(arr, seed).slice(0, n); },
    /** Compara normalizando espacios, tildes y mayúsculas. */
    norm: function (s) {
      return String(s).trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
    },
    /** Compara ignorando espacios y tildes (para completar código). */
    normCode: function (s) {
      return U.norm(s).replace(/[\s;]+/g, '');
    },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  };

  /* ---------------- Progreso ---------------- */
  var KEY = 'edd.progress.v1';
  var SKEY = 'edd.student.v1';

  var Progress = EDD.progress = {
    data: null,

    blank: function () {
      return {
        student: { nombre: '', legajo: '', comision: '' },
        quizzes: {},        // quizId -> { score, total, done, at }
        exercises: {},      // exId -> true
        units: {},          // unitId -> { visited, vizDone: [] }
        labs: {},           // labId -> { passed, at }
        createdAt: new Date().toISOString()
      };
    },

    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        this.data = raw ? JSON.parse(raw) : this.blank();
      } catch (e) { this.data = this.blank(); }
      var base = this.blank();
      Object.keys(base).forEach(function (k) {
        if (this.data[k] == null) this.data[k] = base[k];
      }.bind(this));
      return this.data;
    },

    save: function () {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.data));
        this._lastSave = Date.now();
      } catch (e) {
        U.toast('No se pudo guardar (almacenamiento lleno o bloqueado)', 'err', 3500);
      }
      this._emit();
    },

    reset: function () { this.data = this.blank(); this.save(); },

    /** Student identity, cached in a separate key so it survives a progress reset. */
    student: function () {
      try { return JSON.parse(localStorage.getItem(SKEY)) || { nombre: '', legajo: '', comision: '' }; }
      catch (e) { return { nombre: '', legajo: '', comision: '' }; }
    },
    setStudent: function (s) {
      localStorage.setItem(SKEY, JSON.stringify(s));
      this.data.student = s;
      this.save();
    },

    /* --- Quizzes --- */
    setQuiz: function (id, score, total) {
      var prev = this.data.quizzes[id];
      // Conservar el mejor intento
      if (!prev || prev.done === 0 || score >= prev.score) {
        this.data.quizzes[id] = { score: score, total: total, done: 1, at: Date.now() };
      } else {
        prev.attempts = (prev.attempts || 1) + 1;
      }
      this.save();
    },
    quiz: function (id) { return this.data.quizzes[id] || null; },

    /* --- Ejercicios --- */
    setExercise: function (id, done) {
      if (done) this.data.exercises[id] = new Date().toISOString();
      else delete this.data.exercises[id];
      this.save();
    },
    exerciseDone: function (id) { return !!this.data.exercises[id]; },

    /* --- Laboratorios Pyodide --- */
    setLab: function (id, passed, detail) {
      this.data.labs[id] = { passed: passed ? 1 : 0, at: Date.now(), detail: detail || '' };
      this.save();
    },
    lab: function (id) { return this.data.labs[id] || null; },

    /* --- Unidades --- */
    visitUnit: function (id) {
      if (!this.data.units[id]) this.data.units[id] = { visited: 0, viz: {} };
      this.data.units[id].visited = 1;
      this.save();
    },
    setVizDone: function (uid, key) {
      if (!this.data.units[uid]) this.data.units[uid] = { visited: 0, viz: {} };
      this.data.units[uid].viz[key] = 1;
      this.save();
    },
    vizDone: function (uid, key) {
      return !!(this.data.units[uid] && this.data.units[uid].viz && this.data.units[uid].viz[key]);
    },

/**
     * Porcentaje de avance de una unidad.
     * Los ítems contados son exactamente los que la unidad declara:
     * cada clave de `u.viz`, cada lab y el quiz. Se comparan por clave, no
     * por cantidad, para que el porcentaje nunca pueda pasar de 100 %.
     */
    unitPct: function (uid) {
      var u = EDD.unitById ? EDD.unitById(uid) : null;
      if (!u) return 0;
      var got = 0, tot = 0;
      (u.viz || []).forEach(function (v) {
        tot++;
        if (this.vizDone(uid, v.key)) got++;
      }, this);
      (u.labs || []).forEach(function (l, i) {
        tot++;
        var r = this.data.labs[l.id || ('lab-' + uid + '-' + i)];
        if (r && r.passed) got++;
      }, this);
      if (EDD.quizzes && EDD.quizzes[uid]) {
        tot++;
        var q = this.data.quizzes['quiz-' + uid];
        if (q && q.done) got++;
      }
      return tot ? Math.round(got / tot * 100) : 0;
    },

    /** Detalle de qué ítems de una unidad faltan, para la UI. */
    unitItems: function (uid) {
      var u = EDD.unitById ? EDD.unitById(uid) : null;
      if (!u) return [];
      var out = [];
      var self = this;
      (u.viz || []).forEach(function (v) {
        out.push({ label: v.label, done: self.vizDone(uid, v.key) });
      });
      (u.labs || []).forEach(function (l, i) {
        var r = self.data.labs[l.id || ('lab-' + uid + '-' + i)];
        out.push({ label: l.title, done: !!(r && r.passed) });
      });
      if (EDD.quizzes && EDD.quizzes[uid]) {
        var q = self.data.quizzes['quiz-' + uid];
        out.push({ label: 'Autoevaluación', done: !!(q && q.done) });
      }
      return out;
    },

    /* --- Métricas globales --- */
    stats: function () {
      var d = this.data;
      var qids = Object.keys(d.quizzes), exN = 0, labN = 0, qDone = 0;
      qids.forEach(function (k) { if (d.quizzes[k].done) qDone++; });
      Object.keys(d.exercises).forEach(function (k) { exN++; });
      Object.keys(d.labs).forEach(function (k) { if (d.labs[k].passed) labN++; });
      var qPts = 0, qMax = 0;
      EDD.quizRegistry.forEach(function (q) {
        qMax += q.total || 0;
        var r = d.quizzes[q.id];
        qPts += r && r.done ? r.score : 0;
      });
      var vN = 0;
      Object.keys(d.units).forEach(function (k) { vN += Object.keys(d.units[k].viz || {}).length; });
      return {
        quizzes: qDone, quizzesTotal: EDD.quizRegistry.length,
        exercises: exN, labs: labN,
        viz: vN, vizTotal: EDD.vizRegistry.length,
        qPts: qPts, qMax: qMax,
        pct: function () {
          // Promedio ponderado: quizzes 55%, ejercicios 25%, labs 20%
          var a = EDD.quizRegistry.length ? qPts / qMax : 0;
          var b = EDD.exerciseRegistry.length ? exN / EDD.exerciseRegistry.length : 0;
          var c = EDD.labTotal ? labN / EDD.labTotal : 0;
          return Math.round((a * .55 + b * .25 + c * .20) * 100);
        }
      };
    },

    /* --- Export / import --- */
    exportJSON: function () {
      var payload = {
        _app: 'edd-interactivo',
        _version: 1,
        _exportedAt: new Date().toISOString(),
        student: this.student(),
        progress: this.data
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var a = U.el('a', { href: URL.createObjectURL(blob), download: 'edd-progreso-' + (this.student().nombre || 'sin-nombre').replace(/\s+/g, '-').toLowerCase() + '.json' });
      document.body.appendChild(a); a.click(); a.remove();
      U.toast('Progreso exportado', 'ok');
    },

    importJSON: function (file, cb) {
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var p = JSON.parse(fr.result);
          if (!p || p._app !== 'edd-interactivo' || !p.progress) throw new Error('formato');
          var cur = this.data, inc = p.progress;
          /* Merge: se conserva el mejor resultado de cada quiz y la unión de
             todo lo completado. Nunca se pisa progreso con algo peor. */
          var merged = this.blank();
          merged.student = (p.student && (p.student.nombre || p.student.legajo)) ? p.student : cur.student;
          merged.createdAt = cur.createdAt;
          Object.keys(inc.quizzes || {}).forEach(function (k) {
            var a = inc.quizzes[k], b = cur.quizzes[k];
            merged.quizzes[k] = (!b || (a.score || 0) >= (b.score || 0)) ? a : b;
          });
          /* Los ejercicios son marcas de tiempo: se conserva la mas antigua
             para que "cuándo lo resolví" no cambie al importar. */
          Object.keys(cur.exercises || {}).forEach(function (k) { merged.exercises[k] = cur.exercises[k]; });
          Object.keys(inc.exercises || {}).forEach(function (k) {
            if (!merged.exercises[k]) merged.exercises[k] = inc.exercises[k];
          });
          /* Labs: gana el aprobado. */
          Object.keys(inc.labs || {}).forEach(function (k) {
            var a = inc.labs[k], b = cur.labs[k];
            merged.labs[k] = (!b || (a.passed && !b.passed) || (a.passed && b.passed && a.at >= b.at)) ? a : b;
          });
          Object.keys(inc.units || {}).forEach(function (k) {
            var a = inc.units[k] || {}, b = cur.units[k] || {};
            var viz = {};
            Object.keys(b.viz || {}).forEach(function (v) { viz[v] = 1; });
            Object.keys(a.viz || {}).forEach(function (v) { viz[v] = 1; });
            merged.units[k] = { visited: (a.visited || b.visited) ? 1 : 0, viz: viz };
          });
          this.data = merged;
          try { localStorage.setItem(SKEY, JSON.stringify(merged.student)); } catch (e) {}
          this.save();
          cb && cb(true, merged.student);
        } catch (e) {
          cb && cb(false, e);
        }
      }.bind(this);
      fr.readAsText(file);
    },

    /* --- Reactividad mínima --- */
    _subs: [],
    on: function (fn) { this._subs.push(fn); },
    _emit: function () { this._subs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }
  };

EDD.quizRegistry = [];
EDD.exerciseRegistry = [];
EDD.vizRegistry = [];
EDD.labTotal = 0;

/* Los registros son idempotentes: la misma clave nunca se cuenta dos veces,
   aunque la página se monte varias veces o un componente se registre a la vez
   desde el catálogo y desde el renderizador. */
EDD.registerQuiz = function (q) {
  for (var i = 0; i < EDD.quizRegistry.length; i++) if (EDD.quizRegistry[i].id === q.id) return;
  EDD.quizRegistry.push(q);
};
EDD.registerExercises = function (list) {
  list.forEach(function (e) {
    for (var i = 0; i < EDD.exerciseRegistry.length; i++) if (EDD.exerciseRegistry[i].id === e.id) return;
    EDD.exerciseRegistry.push(e);
  });
};
EDD.registerViz = function (n) {
  if (EDD.vizRegistry.some(function (v) { return v.key === n; })) return;
  EDD.vizRegistry.push({ key: n });
};

/**
 * Construye el catálogo total (quizzes, laboratorios y visualizadores) a partir
 * de los datos, antes de renderizar cualquier página. Sin esto las páginas que
 * no montan un quiz —como el inicio— verían el denominador en cero y el
 * progreso global marcaría siempre 0 %.
 */
EDD.buildCatalog = function () {
  var self = this;
  var units = self.unidades || [];
  var quizzes = self.quizzes || {};

  units.forEach(function (u) {
    var q = quizzes[u.id];
    if (q) self.registerQuiz({ id: 'quiz-' + u.id, total: q.preguntas.length });
    (u.labs || []).forEach(function (l, i) {
      var id = l.id || ('lab-' + u.id + '-' + i);
      self.registerExercises([{ id: id, label: l.title }]);
      if (l.tests && l.tests.length) self.labTotal++;
    });
    (u.viz || []).forEach(function (v) { self.registerViz(v.key); });
  });

  (self.tps || []).forEach(function (tp) {
    self.registerExercises([{ id: tp.id, label: 'TP ' + tp.num }]);
    if (tp.tests && tp.tests.length) self.labTotal++;
  });

  (self.examenes || []).forEach(function (x) {
    var pool = [];
    (x.unidades || []).forEach(function (uid) { var q = quizzes[uid]; if (q) pool = pool.concat(q.preguntas); });
    self.registerQuiz({ id: 'exam-teoria-' + x.id, total: Math.min(x.preguntas, pool.length) });
    self.registerExercises([{ id: 'stack-' + x.id, label: x.stack.titulo }]);
    if (x.stack && x.stack.tests && x.stack.tests.length) self.labTotal++;
  });
};

  /* ---------------- Shell: barra superior + sidebar ---------------- */
  EDD.shell = {
    SECTIONS: [
      { href: 'index.html', label: 'Inicio' },
      { href: 'u1/index.html', label: 'U1' },
      { href: 'u2/index.html', label: 'U2' },
      { href: 'u3/index.html', label: 'U3' },
      { href: 'u4/index.html', label: 'U4' },
      { href: 'u5/index.html', label: 'U5' },
      { href: 'u6/index.html', label: 'U6' },
      { href: 'u7/index.html', label: 'U7' },
      { href: 'u8/index.html', label: 'U8' },
      { href: 'u9/index.html', label: 'U9' },
      { href: 'u10/index.html', label: 'U10' },
      { href: 'tp/index.html', label: 'TP' },
      { href: 'exams/index.html', label: 'Exámenes' }
    ],

    mount: function (opts) {
      opts = opts || {};
      Progress.load();

      /* Si la página se vuelve a renderizar (hashchange, etc.) limpiamos el shell anterior. */
      U.qsa('nav.topnav').forEach(function (n) { n.parentNode.removeChild(n); });
      U.qsa('footer.site').forEach(function (n) { n.parentNode.removeChild(n); });
      var oldLayout = U.qs('.layout');
      if (oldLayout) {
        var prevMain = U.qs('main');
        if (prevMain && prevMain.parentNode === oldLayout) {
          oldLayout.parentNode.insertBefore(prevMain, oldLayout);
        }
        oldLayout.parentNode.removeChild(oldLayout);
      }

      // --- Barra superior ---
      var nav = U.el('nav', { class: 'topnav' }, U.el('div', { class: 'topnav-inner' }, [
        U.el('a', { class: 'brand', href: U.link('index.html') }, [
          U.el('span', { class: 'logo', text: 'ED' }),
          U.el('span', { text: 'Estructuras de Datos' })
        ]),
        U.el('div', { class: 'spacer' }),
        U.el('div', { class: 'topnav-links' }, EDD.shell.SECTIONS.map(function (s) {
          return U.el('a', { href: U.link(s.href), 'data-nav': s.href, text: s.label });
        })),
        U.el('button', { class: 'icon-btn', title: 'Cambiar tema', text: '◐', onclick: function () { EDD.shell.toggleTheme(); } }),
        U.el('button', { class: 'icon-btn', title: 'Mi progreso', text: '◔', onclick: function () { EDD.shell.openProgressModal(); } })
      ]));
      document.body.insertBefore(nav, document.body.firstChild);

      /* Marca el link activo comparando el final de la ruta, para que funcione
         tanto en la raíz del dominio como dentro de un subdirectorio. */
      var path = location.pathname.replace(/\/+$/, '');
      U.qsa('[data-nav]').forEach(function (a) {
        var href = a.getAttribute('data-nav');
        var activo = href === 'index.html'
          ? !/\/[^/]+\/index\.html$/.test(path)      // index.html del sitio, no el de una subcarpeta
          : path.slice(-href.length) === href;
        if (activo) a.classList.add('active');
      });

      // --- Sidebar (opcional) ---
      if (opts.toc && opts.toc.length) {
        var side = U.el('aside', { class: 'sidebar' });
        side.appendChild(U.el('h4', { text: 'En esta página' }));
        var cur2 = null;
        opts.toc.forEach(function (t) {
          if (t.group && t.group !== cur2) { cur2 = t.group; side.appendChild(U.el('h4', { text: t.group })); }
          side.appendChild(U.el('a', { href: '#' + t.id, text: t.label }));
        });
        var main = U.qs('main');
        if (main) {
          /* Ojo: U.el mueve <main> dentro de .layout, así que hay que guardar
             el padre y el hermano ANTES de construir el layout. */
          var parent = main.parentNode || document.body;
          var next = main.nextSibling;
          var layout = U.el('div', { class: 'layout' }, [side, main]);
          parent.insertBefore(layout, next);
          // IntersectionObserver para resaltar
          if ('IntersectionObserver' in global) {
            var io = new IntersectionObserver(function (es) {
              es.forEach(function (e) {
                if (e.isIntersecting) {
                  U.qsa('.sidebar a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
                }
              });
            }, { rootMargin: '-15% 0px -70% 0px' });
            opts.toc.forEach(function (t) { var e = document.getElementById(t.id); if (e) io.observe(e); });
          }
        }
      }

      // --- Footer ---
      var f = U.qs('footer.site') || U.el('footer', { class: 'site' });
      f.className = 'site';
      f.innerHTML = '<div class="wrap flex" style="justify-content:space-between">' +
        '<div>Material interactivo de <strong>Algoritmos y Estructuras de Datos</strong> — UNAB. ' +
        'Material de estudio libre para uso académico.</div>' +
        '<div class="flex" style="gap:14px">' +
        '<a href="' + U.link('downloads/index.html') + '">Descargas</a>' +
        '<a href="#" id="f-export">Exportar progreso</a>' +
        '</div></div>';
      document.body.appendChild(f);
      U.qs('#f-export', f).addEventListener('click', function (e) { e.preventDefault(); Progress.exportJSON(); });
    },

    toggleTheme: function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('edd.theme', next); } catch (e) {}
    },

    openProgressModal: function () {
      var s = Progress.student(), st = Progress.stats();
      var bg = U.el('div', { class: 'modal-bg open' });
      var m = U.el('div', { class: 'modal' });
      var mi = {};
      function field(k, label, ph) {
        mi[k] = U.el('input', { type: 'text', value: s[k] || '', placeholder: ph || '', id: 'f-' + k });
        return [U.el('label', { for: 'f-' + k, text: label }), mi[k]];
      }
      m.appendChild(U.el('h3', { text: 'Mi progreso' }));
      m.appendChild(U.el('div', { class: 'bar mb-1' }, U.el('i', { style: 'width:' + st.pct() + '%' })));
      m.appendChild(U.el('p', { class: 'small muted', text: st.pct() + '% del recorrido · ' + st.quizzes + '/' + st.quizzesTotal + ' quizzes · ' + st.exercises + ' ejercicios · ' + st.labs + ' laboratorios' }));
      m.appendChild(U.el('h4', { class: 'mt-2', text: 'Identificación (opcional)' }));
      field('nombre', 'Nombre y apellido', 'Ana Pérez').forEach(function (e) { m.appendChild(e); });
      field('legajo', 'Legajo', '295123').forEach(function (e) { m.appendChild(e); });
      m.appendChild(U.el('label', { for: 'f-com', text: 'Comisión' }));
      var sel = U.el('select', { id: 'f-com' });
      ['', 'Comisión 2', 'Comisión 3'].forEach(function (o) {
        sel.appendChild(U.el('option', { value: o, text: o || '— sin especificar —', selected: (s.comision || '') === o }));
      });
      sel.className = 'btn';
      m.appendChild(sel);

      var file = U.el('input', { type: 'file', accept: '.json,application/json' });
      file.addEventListener('change', function () {
        if (!file.files[0]) return;
        Progress.importJSON(file.files[0], function (ok) {
          U.toast(ok ? 'Progreso importado' : 'El archivo no es un progreso válido', ok ? 'ok' : 'err', 3000);
          if (ok) { close(); setTimeout(function () { EDD.shell.openProgressModal(); }, 300); }
        });
      });

      var fileLbl = U.el('span', { class: 'small muted' });
      file.addEventListener('change', function () {
        fileLbl.textContent = file.files[0] ? file.files[0].name : '';
      });

      var btns = U.el('div', { class: 'btn-row mt-2' }, [
        U.el('button', { class: 'btn primary', text: 'Guardar', onclick: function () {
          Progress.setStudent({ nombre: mi.nombre.value.trim(), legajo: mi.legajo.value.trim(), comision: sel.value });
          U.toast('Guardado', 'ok'); close();
        } }),
        U.el('button', { class: 'btn', text: 'Exportar .json', onclick: function () { Progress.exportJSON(); } }),
        U.el('button', { class: 'btn danger', text: 'Reiniciar todo', onclick: function () {
          if (confirm('¿Seguro? Se borra todo el progreso guardado en este navegador.')) { Progress.reset(); close(); location.reload(); }
        } }),
        U.el('button', { class: 'btn', onclick: function () { file.click(); } }, ['Importar .json', fileLbl]),
        U.el('button', { class: 'btn', text: 'Cerrar', onclick: close })
      ]);
      function close() { bg.remove(); document.removeEventListener('keydown', onKey); }
      function onKey(e) { if (e.key === 'Escape') close(); }
      document.addEventListener('keydown', onKey);
      bg.addEventListener('click', function (e) { if (e.target === bg) close(); });
m.appendChild(btns);
      bg.appendChild(m);
      document.body.appendChild(bg);
    }
  };

  // Restaurar tema
  try {
    var th = localStorage.getItem('edd.theme');
    if (th) document.documentElement.setAttribute('data-theme', th);
    else if (matchMedia && matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) {}

})(window);