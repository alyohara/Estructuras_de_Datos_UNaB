/* ============================================================
   EDD — Laboratorio de Python (Pyodide)
   Carga: vendor/pyodide local -> fallback CDN
   El runtime provee: _edd.run(code), _edd.test(setup, tests),
   e input() simulado para poder probar los TP que lo usan.
   ============================================================ */
(function (EDD) {
  'use strict';

  var U = EDD.util, P = EDD.progress;
  var CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

  var state = { loading: false, ready: false, py: null, error: null, source: null, waiters: [] };

  /* Runtime Python instalado una vez en el namespace global de Pyodide.
     `_edd_exec`     -> corre un bloque (el que escribe el alumno) y captura stdout/stderr.
     `_edd_tests`    -> corre la suite contra el código del alumno.
        Namespace fresco por test: primero `setup`, después el código del alumno
        (con su stdout descartado para que no ensucie la salida del test) y por
        último el test. Así el test puede llamar a las funciones que el alumno
        definió, y cada test arranca sin el estado que dejó el anterior. */
  var RUNTIME = [
    'import sys, io, time, traceback, json as _json',
    '_edd_in = []',
    'def _edd_set_input(s):',
    '    global _edd_in',
    '    _edd_in = [l for l in str(s).split(chr(10))]',
    'def _edd_input(prompt="", _g=None):',
    '    if prompt: print(prompt, end="")',
    '    if _edd_in: return _edd_in.pop(0)',
    '    return ""',
    'def _edd_ns():',
    '    g = {"__name__": "__main__", "__builtins__": __builtins__}',
    '    g["input"] = _edd_input',
    '    g["_edd_input"] = _edd_input',
    '    return g',
    'def _edd_exec(code, setup="", student="", quiet=False):',
    '    g = _edd_ns()',
    '    b, e = io.StringIO(), io.StringIO()',
    '    so, se = sys.stdout, sys.stderr',
    '    sys.stdout, sys.stderr = b, e',
    '    t0 = time.time(); err = None',
    '    try:',
    '        if setup and setup.strip(): exec(setup, g)',
    '        if student and student.strip():',
    '            if quiet:',
    '                _sink = io.StringIO(); sys.stdout = _sink',
    '                try: exec(student, g)',
    '                finally: sys.stdout = b',
    '            else:',
    '                exec(student, g)',
    '        exec(code, g)',
    '    except BaseException:',
    '        err = traceback.format_exc()',
    '    finally:',
    '        sys.stdout, sys.stderr = so, se',
    '    return _json.dumps({"out": b.getvalue(), "err": e.getvalue() + (err or ""), "ms": (time.time()-t0)*1000.0})',
    'def _edd_tests(setup, student, tests, feed=""):',
    '    res = []',
    '    for t in tests:',
    '        _edd_set_input(feed)',
    '        res.append(_json.loads(_edd_exec(t.get("code",""), setup, student, True)))',
    '    return _json.dumps(res)'
  ].join('\n');

  function vendorPath() { return U.root() + 'vendor/pyodide/'; }

  function inject(indexURL, src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = indexURL + 'pyodide.js';
      s.onload = function () {
        var loader = window.loadPyodide;
        if (typeof loader !== 'function') return reject(new Error('loadPyodide no está definido tras cargar ' + s.src));
        loader({ indexURL: indexURL, lockFileURL: indexURL + 'pyodide-lock.json' })
          .then(function (py) {
            return py.runPythonAsync(RUNTIME).then(function () { return py; });
          })
          .then(function (py) {
            state.py = py; state.ready = true; state.loading = false; state.source = src;
            state.waiters.splice(0).forEach(function (w) { w[0](py); });
            EDD.py._emit();
            resolve(py);
          })
          .catch(function (e) {
            state.loading = false; state.error = e;
            state.waiters.splice(0).forEach(function (w) { w[1](e); });
            EDD.py._emit();
            reject(e);
          });
      };
      s.onerror = function () {
        state.loading = false;
        var e = new Error('No se pudo cargar pyodide.js');
        state.error = e;
        state.waiters.splice(0).forEach(function (w) { w[1](e); });
        EDD.py._emit();
        reject(e);
      };
      document.head.appendChild(s);
    });
  }

  function load() {
    if (state.ready) return Promise.resolve(state.py);
    if (state.loading) return new Promise(function (res, rej) { state.waiters.push([res, rej]); });
    if (location.protocol === 'file:') {
      state.loading = false;
      var fe = new Error('file://'); fe.code = 'file://';
      return Promise.reject(fe);
    }
    state.loading = true;
    var local = vendorPath();
    return fetch(local + 'pyodide.asm.wasm', { method: 'HEAD' })
      .then(function (r) { if (!r.ok) throw new Error('local-missing'); return inject(local, 'local'); })
      .catch(function (e) {
        if (e.code === 'file://') throw e;
        console.warn('[EDD] Pyodide local no encontrado; usando CDN.');
        return inject(CDN, 'cdn');
      });
  }

  /* ---------------------- API ---------------------- */
  var py = EDD.py = {
    state: state,
    load: load,
    ready: function () { return state.ready; },
    _subs: [],
    on: function (fn) { this._subs.push(fn); },
    _emit: function () { this._subs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); },

    /** Ejecuta código. opts: { setup, input } -> Promise<{out, err, ms}> */
    run: function (code, opts) {
      opts = opts || {};
      return load().then(function (p) {
        return p.runPythonAsync('_edd_set_input(' + JSON.stringify(opts.input == null ? '' : opts.input) + ')')
          .then(function () { return p.runPythonAsync('_edd_exec(' + JSON.stringify(code) + ', ' + JSON.stringify(opts.setup || '') + ')'); })
          .then(function (r) { return JSON.parse(r); });
      });
    },

/**
     * Corre una suite de tests contra el código del alumno.
     * tests = [{name, code, mustContain:[], mustNotContain:[], mustEqual:''}]
     * Cada test corre en un namespace limpio: se ejecuta `setup`, luego el
     * código del alumno y luego el test, de modo que puede llamar a las
     * funciones que el alumno definió.
     */
    test: function (setup, student, tests, feed) {
      var pyTests = tests.map(function (t) { return { name: t.name, code: t.code || '' }; });
      return load()
        .then(function (p) {
          return p.runPythonAsync('_edd_tests(' + JSON.stringify(setup || '') + ', ' + JSON.stringify(student || '') +
            ', ' + JSON.stringify(pyTests) + ', ' + JSON.stringify(feed == null ? '' : feed) + ')');
        })
        .then(function (raw) {
          var res = JSON.parse(raw);
          var passed = 0;
          var out = res.map(function (r, i) {
            var t = tests[i];
            var fails = [];
            var norm = function (x) { return String(x == null ? '' : x).trim().replace(/\r/g, ''); };
            (t.mustContain || []).forEach(function (s) {
              if (r.out.indexOf(s) === -1) fails.push('esperaba ver «' + s + '» en la salida. Salida actual: «' + norm(r.out) + '»');
            });
            (t.mustNotContain || []).forEach(function (s) {
              if (r.out.indexOf(s) !== -1) fails.push('no debía aparecer «' + s + '»');
            });
            if (t.mustEqual != null && norm(r.out) !== norm(t.mustEqual)) {
              fails.push('la salida era «' + norm(r.out) + '» y se esperaba «' + norm(t.mustEqual) + '»');
            }
            if (r.err) fails.push('error al ejecutar:\n' + r.err.trim());
            if (!fails.length) passed++;
            return { name: t.name, ok: !fails.length, fails: fails };
          });
          return { passed: passed, total: tests.length, results: out };
        });
    }
  };

/* ---------------------- Componente UI ---------------------- */
  /**
   * spec = { id, enunciado, starter, setup, input, inputLabel,
   *          hints:[html], hint, solution, solutionExp,
   *          tests:[{name, code, mustContain, mustNotContain, mustEqual}] }
   */
  py.lab = function (mount, spec) {
    spec = spec || {};
    var box = U.el('div', { class: 'py-lab' });
    var stTxt = 'Sin cargar';
    var st = U.el('div', { class: 'st' }, [U.el('span', { class: 'dot' }), stTxt]);
    var con = U.el('div', { class: 'console' });
    var tr = U.el('div', { class: 'test-results hidden' });

    function setSt(txt, kind) { st.className = 'st ' + (kind || ''); st.lastChild.textContent = txt; }
    function line(cls, txt) { con.appendChild(U.el('div', { class: cls, text: txt })); }

    var hasTests = !!(spec.tests && spec.tests.length);
    var editorBox = U.el('div', { class: 'editor-wrap' });

    /* Campo de datos de entrada: permite probar los ejercicios que usan input().
       Una línea por respuesta; se usa tanto en Ejecutar como en Tests. */
    var feed = U.el('textarea', {
      class: 'editor feed', spellcheck: 'false', rows: 3,
      placeholder: 'Una línea por dato que pide input()'
    });
    feed.value = spec.input == null ? '' : String(spec.input);
    var inputRow = U.el('div', { class: 'feed-row' }, [
      U.el('label', { class: 'tiny muted', text: spec.inputLabel || 'Datos de entrada para input()' }),
      feed
    ]);

    box.appendChild(U.el('div', { class: 'py-lab-bar' }, [
      U.el('span', { class: 'chip brand', text: 'Python 3.11' }), st,
      U.el('div', { class: 'spacer' }),
      U.el('button', { class: 'btn sm', text: '⬇ Cargar', onclick: boot }),
      U.el('button', { class: 'btn sm', text: '▶ Ejecutar', onclick: run }),
      hasTests ? U.el('button', { class: 'btn sm ok', text: '✓ Tests', onclick: doTest }) : null,
      U.el('button', { class: 'btn sm', text: '↺', title: 'Volver al código inicial', onclick: function () {
        if (confirm('¿Borrar el código que escribiste?')) {
          ed.value = spec.starter || '';
          con.innerHTML = ''; tr.className = 'test-results hidden';
        }
      } })
    ]));

    /* U.el() hace setAttribute('value'), que no puebla un <textarea>: se asigna después. */
    var ed = U.el('textarea', { class: 'editor', spellcheck: 'false', rows: 14 });
    ed.value = spec.starter || '';
    ed.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ed.selectionStart;
        ed.value = ed.value.slice(0, s) + '    ' + ed.value.slice(ed.selectionEnd);
        ed.selectionStart = ed.selectionEnd = s + 4;
      }
    });
    /* Al empezar a escribir, se carga Python solo (sin esperar al botón). */
    var autoBoot = false;
    [ed, feed].forEach(function (node) {
      node.addEventListener('focus', function () {
        if (!autoBoot && !state.loading) { autoBoot = true; boot(); }
      });
    });
    editorBox.appendChild(ed);
    box.appendChild(inputRow);
    box.appendChild(editorBox);
    box.appendChild(con);
    box.appendChild(tr);
    mount.appendChild(box);

    /* --- Pistas progresivas: se van revelando de a una --- */
    var hintList = [].concat(spec.hints || (spec.hint ? [spec.hint] : []));
    if (hintList.length) {
      var revealed = 0;
      var hintBody = U.el('div', { class: 'acc-body' });
      var btnHint = U.el('button', { class: 'btn sm mt-1', text: '💡 Ver una pista' });
      btnHint.addEventListener('click', function () {
        if (revealed < hintList.length) {
          hintBody.appendChild(U.el('div', { class: 'hint-item' + (hintList.length > 1 ? ' q' + (revealed + 1) : ''), html: hintList[revealed] }));
          revealed++;
        }
        if (revealed >= hintList.length) {
          btnHint.disabled = true;
          btnHint.textContent = '✓ Pistas agotadas';
        } else {
          btnHint.textContent = hintList.length > 1
            ? '💡 Ver pista ' + (revealed + 1) + ' de ' + hintList.length
            : '💡 Ver la pista';
        }
      });
      var hintAcc = U.el('details', { class: 'acc mt-1' }, [
        U.el('summary', { text: '💡 Pistas (' + hintList.length + ')' }), hintBody
      ]);
      hintAcc.addEventListener('toggle', function () { if (hintAcc.open && !revealed) btnHint.click(); });
      hintAcc.appendChild(btnHint);
      box.appendChild(hintAcc);
    }

    if (spec.solution) {
      box.appendChild(U.el('details', { class: 'acc mt-1' }, [
        U.el('summary', { text: '🔑 Ver solución comentada' }),
        U.el('div', { class: 'acc-body' }, [
          U.code(spec.solution, 'python'),
          spec.solutionExp ? U.el('div', { class: 'mt-1', html: spec.solutionExp }) : null
        ])
      ]));
    }

    function boot() {
      setSt('Cargando…', 'loading');
      con.innerHTML = '';
      line('l-info', 'Descargando el intérprete Python (~13 MB la primera vez; luego queda en caché).');
      return py.load().then(function () {
        setSt('Listo' + (state.source === 'cdn' ? ' (CDN)' : ''), 'loaded');
        con.innerHTML = '';
        line('l-ok', '✓ Python listo. Escribí tu código y tocá Ejecutar.');
        if (hasTests && spec.autoTest) setTimeout(doTest, 250);
      }).catch(function (e) {
        con.innerHTML = '';
        if (e.code === 'file://') {
          setSt('Necesita servidor local', 'error');
          line('l-err', '⚠ Pyodide no puede ejecutarse abriendo el archivo directamente (file://).');
          line('l-info', 'Abrí una terminal en la carpeta  web/  y ejecutá:');
          line('l-head', '    python -m http.server 8000');
          line('l-info', 'Luego entrá a  http://localhost:8000');
        } else {
          setSt('Error', 'error');
          line('l-err', '✗ ' + e.message);
          line('l-info', state.source === 'cdn'
            ? 'No hay internet y no se encontró la copia local de Pyodide. Revisá la carpeta  web/vendor/pyodide/.'
            : 'Revisá tu conexión a internet.');
        }
      });
    }

    function run() {
      con.innerHTML = '';
      if (!state.ready) {
        line('l-info', 'Cargando Python…');
        return boot().then(function () { if (state.ready) run(); });
      }
      line('l-head', '▶ Ejecutando…');
      py.run(ed.value, { setup: spec.setup, input: feed.value }).then(function (r) {
        con.innerHTML = '';
        if (r.out) line('l-out', r.out.replace(/\n$/, ''));
        if (r.err) line('l-err', r.err.trim());
        if (!r.out && !r.err) line('l-info', '(el código corrió sin imprimir nada)');
        line('l-info', '— ' + r.ms.toFixed(1) + ' ms —');
      }).catch(function (e) { con.innerHTML = ''; line('l-err', '✗ ' + e.message); });
    }

    function doTest() {
      if (!state.ready) { con.innerHTML = ''; line('l-info', 'Cargando Python…'); return boot().then(function () { if (state.ready) doTest(); }); }
      tr.className = 'test-results';
      tr.innerHTML = '<div class="test-score">Ejecutando tests…</div>';
      py.test(spec.setup, ed.value, spec.tests, feed.value).then(function (res) {
        tr.innerHTML = '';
        var pct = res.total ? Math.round(res.passed / res.total * 100) : 0;
        tr.appendChild(U.el('div', {
          class: 'test-score',
          style: 'color:' + (pct === 100 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--err)'),
          text: res.passed + ' / ' + res.total + ' tests  (' + pct + '%)'
        }));
        tr.appendChild(U.el('ol', null, res.results.map(function (r) {
          return U.el('li', { class: r.ok ? 'pass' : 'fail' }, [
            (r.ok ? '✓ ' : '✗ ') + U.esc(r.name),
            r.fails.length ? U.el('div', { class: 'tiny', html: r.fails.map(U.esc).join('<br>') }) : null
          ]);
        })));
        if (spec.id) {
          P.setLab(spec.id, res.passed === res.total, res.passed + '/' + res.total);
          if (res.passed > 0 && res.passed < res.total) P.setExercise(spec.id, true);
        }
        if (res.passed === res.total && spec.onPass) spec.onPass();
        if (spec.id) EDD.progress._emit();
      }).catch(function (e) {
        tr.innerHTML = '';
        tr.appendChild(U.el('div', { style: 'color:var(--err)', text: '✗ ' + e.message }));
      });
    }

    /* El catálogo (core.js) ya contó este laboratorio; acá sólo se registra el id,
       de forma idempotente, para el caso de labs sueltos. */
    if (spec.id) EDD.registerExercises([{ id: spec.id, label: spec.titulo || spec.id }]);
    return { el: box, run: run, test: doTest, editor: ed, input: feed };
  };

})(window.EDD);