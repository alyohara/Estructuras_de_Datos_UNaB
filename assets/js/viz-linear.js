/* ============================================================
   EDD — Visualizador de estructuras lineales
   Lista enlazada (simple/doble/circular) · Pila · Cola
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util, P = EDD.progress;
  var V = EDD.viz = EDD.viz || {};

  /* ============================================================
     LISTA ENLAZADA
     ============================================================ */
  function LinkedListViz(mount, opts) {
    opts = opts || {};
    var mode = opts.mode || 'simple';        // simple | doble | circular
    var nodos = [];                          // {v, prev, next, id}
    var nextId = 1;

    var stage = U.el('div', { class: 'viz-stage' });
    var log = U.el('div', { class: 'viz-log' });
    var inp = U.el('input', { type: 'text', placeholder: 'valor', style: 'width:100px' });

    function push(v) { nodos.push({ v: v, id: nextId++ }); render(); }
    function unshift(v) { nodos.unshift({ v: v, id: nextId++ }); render(); }
    function pop() { return nodos.shift(); }
    function shift() { return nodos.pop(); }

    function search(v) {
      for (var i = 0; i < nodos.length; i++) if (String(nodos[i].v) === String(v)) return i;
      return -1;
    }

    var ops = {
      'Insertar al principio': function (v) { unshift(v); say('insertAtBeginning(' + v + ')  →  O(1)'); },
      'Insertar al final': function (v) { push(v); say('insertAtEnd(' + v + ')  →  O(n) para llegar al final'); },
      'Eliminar el primero': function () { var x = pop(); say(x ? 'deleteFromBeginning() → se quitó ' + x + '   O(1)' : 'deleteFromBeginning() → "The list is empty"'); render(); },
      'Eliminar el último': function () { var x = shift(); say(x ? 'deleteFromEnd() → se quitó ' + x + '   O(n)' : 'deleteFromEnd() → "The list is empty"'); render(); },
      'Buscar': function (v) {
        var i = search(v);
        var last = -1;
        U.qsa('.nd', stage).forEach(function (e, k) { if (k === i) e.classList.add('hl'); });
        for (var k = 0; k <= Math.max(i, 0) && k < nodos.length; k++) last = k;
        say('search(' + v + ') → ' + (i >= 0
          ? '"Value \'' + v + '\' found at position ' + i + '"   O(n)'
          : '"Value \'' + v + '\' not found in the list"'));
      },
      'Recorrer': function () {
        say('printList() → ' + (nodos.length ? nodos.map(function (n) { return n.v; }).join(' → ') + ' → None' : '(lista vacía)'));
      },
      'Invertir': function () { nodos.reverse(); say('Se invirtió la lista'); render(); },
      'Ordenar': function () {
        var sorted = nodos.slice().sort(function (a, b) { return String(a.v).localeCompare(String(b.v), 'es', { numeric: true }); });
        nodos = sorted; say('Lista ordenada'); render();
      },
      'Limpiar': function () { nodos = []; say('Lista vacía'); render(); }
    };

    var sel = U.el('select', { class: 'btn' });
    Object.keys(ops).forEach(function (k) { sel.appendChild(U.el('option', { value: k, text: k })); });

    var modeSel = U.el('select', { class: 'btn' });
    [['simple', 'Lista simple'], ['doble', 'Lista doble'], ['circular', 'Lista circular']].forEach(function (m) {
      modeSel.appendChild(U.el('option', { value: m[0], text: m[1], selected: mode === m[0] }));
    });
    modeSel.addEventListener('change', function () {
      mode = modeSel.value;
      var h = mode === 'doble' ? 'Cada nodo tiene <code>dato</code>, <code>siguiente</code> y <code>anterior</code>. Se puede recorrer en los dos sentidos.'
        : mode === 'circular' ? 'El <code>siguiente</code> del último nodo apunta a la cabeza: la lista no tiene fin (round-robin).'
        : 'Cada nodo tiene <code>dato</code> y <code>siguiente</code>. El último apunta a <code>None</code>.';
      desc.innerHTML = h;
      render();
    });

    var desc = U.el('div', { class: 'viz-caption' });

    function say(t) { log.textContent = t; }

    function render() {
      stage.innerHTML = '';
      if (!nodos.length) {
        stage.appendChild(U.el('div', { class: 'flex' }, [
          U.el('span', { class: 'chip', text: 'head → None' }),
          U.el('span', { class: 'dim small', text: 'lista vacía' })
        ]));
      } else {
        nodos.forEach(function (n, i) {
          if (i > 0) stage.appendChild(U.el('span', { class: 'arrow', text: '→' }));
          if (mode === 'doble' && i > 0) stage.appendChild(U.el('span', { class: 'arrow', text: '←', style: 'opacity:.45' }));
          var cls = 'nd' + (i === 0 ? ' head' : '') + (i === nodos.length - 1 ? ' tail' : '');
          var e = U.el('div', { class: cls, text: String(n.v) });
          e.title = 'Nodo ' + n.id;
          if (mode === 'doble') {
            e.appendChild(U.el('span', { class: 'nd-sub', text: i === 0 ? 'None ←' : '' }));
          }
          stage.appendChild(e);
        });
        if (mode === 'simple') stage.appendChild(U.el('span', { class: 'arrow', text: '→' })), stage.appendChild(U.el('span', { class: 'nil', text: 'None' }));
        else if (mode === 'circular') {
          stage.appendChild(U.el('span', { class: 'arrow', text: '↺' }));
          stage.appendChild(U.el('span', { class: 'chip', text: 'head' }));
        } else if (mode === 'doble') {
          stage.appendChild(U.el('span', { class: 'arrow', text: '→' }));
          stage.appendChild(U.el('span', { class: 'nil', text: 'None' }));
        }
      }
      renderList2();
    }

    function renderList2() {
      var c = U.qs('[data-ll-self]', mount);
      if (!c) return;
      c.innerHTML = '';
      if (!nodos.length) { c.appendChild(U.el('span', { class: 'chip', text: '[]' })); return; }
      c.appendChild(U.el('span', { class: 'chip brand' }, [U.el('b', { text: 'head' })]));
      nodos.forEach(function (n) {
        c.appendChild(U.el('span', { class: 'dim mono', text: ' → ' }));
        c.appendChild(U.el('span', { class: 'chip', text: String(n.v) }));
      });
      c.appendChild(U.el('span', { class: 'dim mono', text: mode === 'circular' ? ' ↺ head' : ' → None' }));
    }

    function doIt() {
      var v = inp.value.trim();
      if (!v && ['Insertar al principio', 'Insertar al final', 'Buscar'].indexOf(sel.value) >= 0) { U.toast('Escribí un valor', 'err'); inp.focus(); return; }
      ops[sel.value](v);
      P.setVizDone(opts.unit || 'u2', 'linkedList');
    }

    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') doIt(); });

    var presets = [
      { n: 'Ejemplo del apunte: the quick brown fox jumps', v: ['the', 'quick', 'brown', 'fox', 'jumps'], at: 'end' },
      { n: 'Del TP N°4 (10 → 70 → 30)', v: [10, 70, 30], at: 'end' },
      { n: 'Numeros 1..6', v: [1, 2, 3, 4, 5, 6], at: 'end' }
    ];
    var presetSel = U.el('select', { class: 'btn' }, [U.el('option', { value: '', text: 'Ejemplos…' })]);
    presets.forEach(function (p, i) { presetSel.appendChild(U.el('option', { value: i, text: p.n })); });
    presetSel.addEventListener('change', function () {
      var p = presets[Number(presetSel.value)];
      if (!p) return;
      nodos = []; nextId = 1;
      p.v.forEach(function (x) { if (p.at === 'end') push(x); else unshift(x); });
      say('Cargado: ' + p.n);
      presetSel.value = '';
    });

    var wrap = U.el('div', { class: 'viz' }, [
      stage,
      U.el('div', { class: 'viz-controls' }, [
        inp, sel, U.el('button', { class: 'btn primary', text: 'Ejecutar', onclick: doIt }),
        presetSel,
        U.el('button', { class: 'btn', text: 'Modo:', onclick: function () { modeSel.click(); } }),
        modeSel
      ]),
      desc,
      U.el('div', { class: 'mt-1', 'data-ll-self': '' }),
      log
    ]);
    desc.innerHTML = 'Cada nodo tiene <code>dato</code> y <code>siguiente</code>. El último apunta a <code>None</code>.';
    mount.appendChild(wrap);
    render();
    EDD.registerViz('linkedList');
    return wrap;
  }

  V.linkedList = function (mount, opts) { return LinkedListViz(mount, opts); };

  /* ============================================================
     PILA (LIFO)
     ============================================================ */
  V.pila = function (mount, opts) {
    opts = opts || {};
    var items = [];   // base -> tope

    var stage = U.el('div', { class: 'viz-stage', style: 'flex-direction:column;gap:5px;align-items:center' });
    var log = U.el('div', { class: 'viz-log' });
    var inp = U.el('input', { type: 'text', placeholder: 'valor', style: 'width:100px' });

    function push(v) {
      var e = U.el('div', { class: 'bar-item in' + (items.length ? ' top' : ''), text: String(v) });
      items.push(String(v));
      stage.insertBefore(e, stage.firstChild);
      tagTop();
      return e;
    }
    function pop() {
      if (!items.length) return null;
      var v = items.pop();
      var e = stage.firstElementChild;
      if (e) { e.classList.remove('in'); e.classList.add('out'); setTimeout(function () { if (e.parentNode) e.remove(); }, 280); }
      tagTop();
      return v;
    }
    function peek() { return items.length ? items[items.length - 1] : null; }
    function tagTop() { U.qsa('.bar-item', stage).forEach(function (e, i) { e.classList.toggle('top', i === 0); }); }

    var sel = U.el('select', { class: 'btn' });
    ['push (apilar)', 'pop (desapilar)', 'peek (tope)', 'is_empty', 'Ver la pila'].forEach(function (k) {
      sel.appendChild(U.el('option', { value: k, text: k }));
    });

    var doBtn = U.el('button', { class: 'btn primary', text: 'Ejecutar', onclick: function () {
      var v = inp.value.trim();
      var op = sel.value;
      if ((op === 'push (apilar)') && !v) { U.toast('Escribí un valor', 'err'); return; }
      if (op === 'push (apilar)') { push(v); inp.value = ''; log.textContent = 'push(' + v + ')  →  O(1). El tope ahora es ' + v; }
      else if (op === 'pop (desapilar)') { var x = pop(); log.textContent = x !== null ? 'pop() → ' + x + '   O(1). Quedan ' + items.length + ' elementos' : 'pop() → "La pila está vacía"  (IndexError)'; }
      else if (op === 'peek (tope)') { var t = peek(); log.textContent = t !== null ? 'peek() → ' + t : 'peek() → la pila está vacía'; }
      else if (op === 'is_empty') { log.textContent = 'is_empty() → ' + (items.length === 0); }
      else {
        log.textContent = items.length
          ? 'La pila de punta a base:\n' + items.map(function (x) { return '| ' + x + ' |'; }).join('\n') + '\n-------'
          : '(pila vacía)';
      }
      P.setVizDone(opts.unit || 'u2', 'pila');
    } });

    var tpl = U.el('button', { class: 'btn', text: 'Ejemplo del TP N°4', onclick: function () {
      stage.innerHTML = ''; items = [];
      [5, 10, 15].forEach(function (v) { setTimeout(function () { push(v); }, (v === 15 ? 0 : 0)); });
      log.textContent = 'push(5) → push(10) → push(15).  El 15 quedó en el tope.';
    } });

    var clr = U.el('button', { class: 'btn', text: 'Vaciar', onclick: function () { stage.innerHTML = ''; items = []; log.textContent = ''; } });

    mount.appendChild(U.el('div', { class: 'viz' }, [
      stage,
      U.el('div', { class: 'viz-caption center', text: items.length ? '' : 'base ↑' }),
      U.el('div', { class: 'viz-controls', style: 'justify-content:center' }, [inp, sel, doBtn, tpl, clr]),
      U.el('div', { class: 'viz-caption center dim', html: 'El último en entrar es el primero en salir: <b>LIFO</b>. Ejemplos: deshacer, pila de llamadas, Evaluar una expresión.' }),
      log
    ]));
    var tag = U.el('div', { class: 'bar-tag center', text: 'base ↑  (tope = último insertado)' });
    stage.parentNode.insertBefore(tag, stage.nextSibling);
    EDD.registerViz('pila');
  };

  /* ============================================================
     COLA (FIFO)
     ============================================================ */
  V.cola = function (mount, opts) {
    opts = opts || {};
    var items = [];

    var stage = U.el('div', { class: 'viz-stage' });
    var log = U.el('div', { class: 'viz-log' });
    var inp = U.el('input', { type: 'text', placeholder: 'valor', style: 'width:100px' });

    function render() {
      stage.innerHTML = '';
      if (!items.length) {
        stage.appendChild(U.el('span', { class: 'chip', text: 'frente = final = None  (cola vacía)' }));
      } else {
        stage.appendChild(U.el('span', { class: 'chip accent', text: 'frente' }));
        items.forEach(function (v, i) {
          stage.appendChild(U.el('span', { class: 'arrow', text: '→' }));
          var last = i === items.length - 1;
          stage.appendChild(U.el('div', { class: 'bar-item' + (i === 0 ? ' top' : ''), text: String(v) }));
        });
        stage.appendChild(U.el('span', { class: 'chip accent', text: 'final' }));
      }
      lst.innerHTML = '';
      items.forEach(function (v, i) {
        lst.appendChild(U.el('span', { class: 'chip', text: String(v) }));
        if (i < items.length - 1) lst.appendChild(U.el('span', { class: 'dim mono', text: '→' }));
      });
    }
    function push(v) { items.push(String(v)); render(); }
    function shift() { var v = items.shift(); render(); return v; }

    var lst = U.el('div', { class: 'flex', style: 'gap:2px;margin-top:10px;flex-wrap:wrap' });

    var sel = U.el('select', { class: 'btn' });
    ['enqueue (encolar)', 'dequeue (desencolar)', 'peek (frente)', 'is_empty'].forEach(function (k) {
      sel.appendChild(U.el('option', { value: k, text: k }));
    });

    mount.appendChild(U.el('div', { class: 'viz' }, [
      stage,
      lst,
      U.el('div', { class: 'viz-controls' }, [
        inp, sel,
        U.el('button', { class: 'btn primary', text: 'Ejecutar', onclick: function () {
          var v = inp.value.trim(), op = sel.value;
          if (op === 'enqueue (encolar)') { if (!v) return U.toast('Escribí un valor', 'err'); push(v); inp.value = ''; log.textContent = 'enqueue(' + v + ')  →  O(1) usando el puntero final'; }
          else if (op === 'dequeue (desencolar)') { var x = shift(); log.textContent = x !== undefined ? 'dequeue() → ' + x + '   O(1). Quedan ' + items.length : 'dequeue() → la cola está vacía'; }
          else if (op === 'peek (frente)') log.textContent = items.length ? 'peek() → ' + items[0] : 'la cola está vacía';
          else log.textContent = 'is_empty() → ' + (items.length === 0);
          P.setVizDone(opts.unit || 'u2', 'cola');
        } }),
        U.el('button', { class: 'btn', text: 'Ejemplo', onclick: function () { items = ['1', '2', '3']; render(); log.textContent = 'print(queue) → 1 -> 2 -> 3'; } }),
        U.el('button', { class: 'btn', text: 'Vaciar', onclick: function () { items = []; render(); } })
      ]),
      U.el('div', { class: 'viz-caption dim', html: 'El primero en entrar es el primero en salir: <b>FIFO</b>. Ejemplos: impresión, turnos, llamadas al 0800. Con <code>head</code> + <code>tail</code> las dos operaciones son O(1).' }),
      log
    ]));
    render();
    EDD.registerViz('cola');
  };

})(window.EDD);