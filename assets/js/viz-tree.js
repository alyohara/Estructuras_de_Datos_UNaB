/* ============================================================
   EDD — Visualizador de árboles
   Árbol binario (pre/in/post/niveles) · BST con rotaciones AVL
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util;
  var V = EDD.viz = EDD.viz || {};
  var SVGNS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs) {
    var e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  /* Layout por niveles: x = inorder, y = depth */
  function layout(root) {
    var pos = {}, maxY = 0, i = 0;
    (function walk(n, d) {
      if (!n) return;
      walk(n.l, d + 1);
      pos[n.uid] = { x: i++, y: d };
      maxY = Math.max(maxY, d);
      walk(n.r, d + 1);
    })(root, 0);
    var w = i || 1;
    var colW = 56, rowH = 74, padX = 44, padY = 40;
    var W = padX * 2 + w * colW, H = padY * 2 + (maxY + 1) * rowH;
    Object.keys(pos).forEach(function (k) {
      pos[k].px = padX + pos[k].x * colW + colW / 2;
      pos[k].py = padY + pos[k].y * rowH;
    });
    return { pos: pos, W: W, H: H };
  }

  function drawTree(root, stage, state) {
    state = state || {};
    var L = layout(root);
    var s = svg('svg', { viewBox: '0 0 ' + L.W + ' ' + L.H, width: L.W, height: L.H });
    var gEdges = svg('g', {}), gNodes = svg('g', {});
    s.appendChild(gEdges); s.appendChild(gNodes);

    (function edges(n) {
      if (!n) return;
      var a = L.pos[n.uid], r = 26;
      [n.l, n.r].forEach(function (c) {
        if (!c) return;
        var b = L.pos[c.uid];
        var ln = svg('line', { x1: a.px, y1: a.py, x2: b.px, y2: b.py, class: 'tree-edge' });
        if (state.hlEdge && ((state.hlEdge[0] === n.uid && state.hlEdge[1] === c.uid) || (state.hlEdge[0] === c.uid && state.hlEdge[1] === n.uid))) ln.setAttribute('class', 'tree-edge hl');
        gEdges.appendChild(ln);
      });
      edges(n.l); edges(n.r);
    })(root);

    (function nodes(n) {
      if (!n) return;
      var p = L.pos[n.uid];
      var cls = 'tree-node';
      if (state.hl === n.uid) cls += ' hl';
      if (state.visited && state.visited.indexOf(n.uid) >= 0) cls += ' visited';
      if (state.path && state.path.indexOf(n.uid) >= 0) cls += ' inpath';
      var g = svg('g', { class: cls });
      g.appendChild(svg('circle', { cx: p.px, cy: p.py, r: 22 }));
      var t = svg('text', { x: p.px, y: p.py });
      t.textContent = String(n.v);
      g.appendChild(t);
      if (state.order && state.order[n.uid] != null) {
        var b = svg('text', { x: p.px, y: p.py - 34, style: 'font:700 12px var(--mono);fill:var(--accent);text-anchor:middle' });
        b.textContent = state.order[n.uid];
        g.appendChild(b);
      }
      gNodes.appendChild(g);
      nodes(n.l); nodes(n.r);
    })(root);

    stage.innerHTML = '';
    stage.appendChild(s);
    return L;
  }

  function T() { return { v: null, l: null, r: null, uid: 0 }; }
  function ins(n, x) {
    if (!n) { n = T(); n.v = x; n.uid = ++seq; return n; }
    if (x < n.v) n.l = ins(n.l, x); else n.r = ins(n.r, x);
    return n;
  }
  function del(n, x) {
    if (!n) return null;
    if (x < n.v) n.l = del(n.l, x);
    else if (x > n.v) n.r = del(n.r, x);
    else {
      if (!n.l) return n.r;
      if (!n.r) return n.l;
      var s = n.r; while (s.l) s = s.l;
      n.v = s.v; n.r = del(n.r, s.v);
    }
    return n;
  }
  function height(n) { return n ? 1 + Math.max(height(n.l), height(n.r)) : 0; }
  function bf(n) { return n ? height(n.r) - height(n.l) : 0; }
  function rotR(y) { var x = y && y.l; if (!x) return y; y.l = x.r; x.r = y; return x; }
  function rotL(x) { var y = x && x.r; if (!y) return x; x.r = y.l; y.l = x; return y; }

  /* bf = altura(derecha) - altura(izquierda): si b > 1 la derecha pesa más y
     hay que rotar a la IZQUIERDA; si b < -1, a la DERECHA. */
  function avlFix(n) {
    if (!n) return null;
    n.l = avlFix(n.l); n.r = avlFix(n.r);
    var b = bf(n);
    if (b > 1) { if (n.r && bf(n.r) < 0) n.r = rotR(n.r); n = rotL(n); }
    else if (b < -1) { if (n.l && bf(n.l) > 0) n.l = rotL(n.l); n = rotR(n); }
    return n;
  }
  var seq = 0;

  /* ============================================================
     ARBOL BINARIO
     ============================================================ */
  V.arbolBinario = function (mount, opts) {
    opts = opts || {};
    var root = null;
    var stage = U.el('div', { class: 'viz-stage tree-stage' });
    var out = U.el('div', { class: 'viz-log', style: 'min-height:44px' });
    var inp = U.el('input', { type: 'number', placeholder: 'valor', style: 'width:96px' });
    var mode = 'bst'; // bst | general

    function render(st) { root ? drawTree(root, stage, st || {}) : (stage.innerHTML = '<span class="dim">árbol vacío</span>'); }

    function pre(n, a) { if (!n) return; a.push(n.v); pre(n.l, a); pre(n.r, a); }
    function ino(n, a) { if (!n) return; ino(n.l, a); a.push(n.v); ino(n.r, a); }
    function post(n, a) { if (!n) return; post(n.l, a); post(n.r, a); a.push(n.v); }
    function bfs(n, a) { if (!n) return; var q = [n]; while (q.length) { var x = q.shift(); a.push(x.v); if (x.l) q.push(x.l); if (x.r) q.push(x.r); } }
    function leaves(n, a) { if (!n) return; if (!n.l && !n.r) { a.push(n.v); return; } leaves(n.l, a); leaves(n.r, a); }

    function animated(order, fnName, st) {
      if (!root) return;
      var visited = [], orderMap = {}, i = 0;
      (function step() {
        if (i >= order.length) {
          out.textContent = fnName + '(raíz) → ' + order.join(', ');
          render({ visited: visited, order: orderMap });
          return;
        }
        visited.push(order[i]); orderMap[order[i]] = i + 1;
        render({ visited: visited, order: orderMap });
        out.textContent = fnName + ' — visiting "' + order[i] + '" (' + (i + 1) + '/' + order.length + ')';
        i++;
        setTimeout(step, 480);
      })();
    }

    function tSort() {
      if (!root) { U.toast('Cargá valores primero', 'err'); return; }
      var kind = ordSel.value;
      var a = [], vis = [], orderMap = {};
      if (kind === 'pre') pre(root, a);
      else if (kind === 'in') ino(root, a);
      else post(root, a);
      var i2 = 0;
      (function step() {
        if (i2 >= a.length) {
          out.textContent = nameOf(kind) + '(raíz) → ' + a.join(', ');
          render();
          EDD.progress.setVizDone(opts.unit || 'u3', 'arbolBinario');
          return;
        }
        vis.push(a[i2]); orderMap[a[i2]] = i2 + 1;
        render({ visited: vis.slice(), order: orderMap });
        out.textContent = nameOf(kind) + ' — visiting "' + a[i2] + '" (' + (i2 + 1) + '/' + a.length + ')';
        i2++;
        setTimeout(step, 480);
      })();
    }

    function nameOf(k) { return k === 'pre' ? 'preOrden' : k === 'in' ? 'inOrden' : 'postOrden'; }

    var btns = [
      ['Insertar (BST)', function () {
        var v = parseInt(inp.value, 10);
        if (isNaN(v)) return U.toast('Ingresá un número', 'err');
        root = ins(root, v); inp.value = '';
        out.textContent = 'insert(' + v + ')  →  O(log n) promedio, O(n) en el peor caso (arbol degenerado)';
        EDD.progress.setVizDone(opts.unit || 'u3', 'arbolBinario');
        render();
      }],
      ['Eliminar (BST)', function () {
        var v = parseInt(inp.value, 10);
        if (isNaN(v)) return U.toast('Ingresá un número', 'err');
        root = del(root, v); inp.value = '';
        out.textContent = 'delete(' + v + ')';
        render();
      }],
      ['Altura', function () { out.textContent = 'tree_height(raíz) = ' + height(root) + (root ? '   (O(n), una visita por nodo)' : ''); render(); }],
      ['¿Balanceado?', function () {
        function ok(n) { if (!n) return true; if (Math.abs(bf(n)) > 1) return false; return ok(n.l) && ok(n.r); }
        out.textContent = root ? (ok(root) ? 'Sí, está balanceado: en cada nodo |factor de balance| ≤ 1' : 'No: hay un nodo con factor de balance > 1 — habría que rotar') : 'árbol vacío';
        render();
      }],
      ['Nodos hoja', function () {
        var a = []; leaves(root, a);
        out.textContent = 'Hojas (sin hijos): ' + (a.length ? a.join(', ') : '—');
        var vis = a.slice();
        render({ visited: vis });
      }],
      ['Sumar hojas', function () {
        var a = []; leaves(root, a);
        out.textContent = 'Suma de las hojas = ' + a.reduce(function (s, x) { return s + x; }, 0);
        render({ visited: a.slice() });
      }]
    ];

    var ordSel = U.el('select', { class: 'btn', id: 'ord' });
    [['pre', 'preOrden (raíz-izq-der)'], ['in', 'inOrden (izq-raíz-der)'], ['post', 'postOrden (izq-der-raíz)']].forEach(function (o) {
      ordSel.appendChild(U.el('option', { value: o[0], text: o[1] }));
    });
    ordSel.addEventListener('change', tSort);

    function quick(arr, label) {
      root = null; seq = 0;
      arr.forEach(function (x) { root = ins(root, x); });
      out.textContent = label;
      render();
    }

    mount.appendChild(U.el('div', { class: 'viz' }, [
      stage,
      U.el('div', { class: 'viz-controls' }, [inp].concat(btns.map(function (b) {
        return U.el('button', { class: 'btn primary', text: b[0], onclick: b[1] });
      })).concat([
        U.el('button', { class: 'btn ok', text: 'Ordenar →', onclick: tSort }), ordSel
      ])),
      U.el('div', { class: 'viz-controls' }, [
        U.el('button', { class: 'btn sm', text: 'Ej: 50,30,70,20,40,60,80', onclick: function () { quick([50, 30, 70, 20, 40, 60, 80], 'Árbol de búsqueda binario balanceado — 8 BST balanceados posibles de 3 nodos, este es el "perfecto"'); } }),
        U.el('button', { class: 'btn sm', text: 'Ej: 1,2,3,4,5 (degen.)', onclick: function () { quick([1, 2, 3, 4, 5], 'Inserción monótona → el árbol "degenera" a una lista: altura n, todo O(n)'); } }),
        U.el('button', { class: 'btn sm', text: 'Vaciar', onclick: function () { root = null; render(); out.textContent = ''; } })
      ]),
      out,
      U.el('div', { class: 'viz-caption dim', html: 'En un <b>BST</b> todo lo del subárbol izquierdo es menor que el nodo, y todo lo de la derecha es mayor. Por eso el recorrido <b>inOrden</b> devuelve los valores ordenados de menor a mayor.' })
    ]));
    render();
    EDD.registerViz('arbolBinario');
  };

  /* ============================================================
     AVL con rotaciones
     ============================================================ */
  V.avl = function (mount, opts) {
    var root = null;
    var stage = U.el('div', { class: 'viz-stage tree-stage' });
    var out = U.el('div', { class: 'viz-log', style: 'min-height:44px' });
    var inp = U.el('input', { type: 'number', placeholder: 'clave', style: 'width:96px' });

    function bfMap(n, m) {
      if (!n) return m;
      m[n.uid] = bf(n);
      bfMap(n.l, m); bfMap(n.r, m);
      return m;
    }
    function render() {
      if (!root) { stage.innerHTML = '<span class="dim">árbol vacío</span>'; return; }
      var m = bfMap(root, {});
      var bad = Object.keys(m).filter(function (k) { return Math.abs(m[k]) > 1; }).map(Number);
      drawTree(root, stage, bad.length ? { hl: bad[0] } : {});
      var L = stage.querySelector('svg');
      var L2 = layout(root);
      var gNodes = L.querySelectorAll('.tree-node');
      var keys = Object.keys(m).sort(function (a, b) { return Number(a) - Number(b); });
      keys.forEach(function (k, i) {
        var p = L2.pos[k], g = gNodes[i];
        if (!p || !g) return;
        var t = svg('text', {
          x: p.px, y: p.py + 36,
          style: 'font:700 11px var(--mono);fill:' + (Math.abs(m[k]) > 1 ? 'var(--err)' : 'var(--fg-dim)') + ';text-anchor:middle'
        });
        t.textContent = (m[k] > 0 ? '+' : '') + m[k];
        L.appendChild(t);
      });
    }

    function snapshot(n) {
      var m = {};
      (function w(x) { if (!x) return; m[x.uid] = height(x); w(x.l); w(x.r); })(n);
      return m;
    }

    function insert(v) {
      var before = snapshot(root);
      root = ins(root, v);
      // Detectar la rotación comparando alturas de los ancestros
      var rotations = [];
      (function find(n) {
        if (!n) return;
        find(n.l); find(n.r);
        var b = bf(n);
        if (b > 1) rotations.push('rotación simple a la IZQUIERDA sobre ' + n.v + ' (factor ' + (b > 0 ? '+' : '') + b + ')');
        else if (b < -1) rotations.push('rotación simple a la DERECHA sobre ' + n.v + ' (factor ' + (b > 0 ? '+' : '') + b + ')');
      })(root);
      root = avlFix(root);
      out.textContent = 'insert(' + v + ') → ' +
        (rotations.length ? rotations.join('; ') : 'sin rotaciones: el factor de balance sigue dentro de [-1, 1]') +
        '.   Inserción y rotación: O(log n).';
      render();
    }

    var presets = [
      ['Rotación simple a la izquierda — 10, 20, 30', [10, 20, 30], 'Al insertar 30 el factor de balance de 20 pasa a -2: rotación izquierda. 30 pasa a ser la raíz.'],
      ['Rotación simple a la derecha — 30, 20, 10', [30, 20, 10], 'Al insertar 10 el factor de balance de 20 pasa a +2: rotación derecha. 20 pasa a ser la raíz.'],
      ['Rotación doble izquierda-derecha — 30, 10, 20', [30, 10, 20], 'Caso RL: primero rotación izquierda sobre 10, luego rotación derecha sobre 30.'],
      ['Rotación doble derecha-izquierda — 10, 30, 20', [10, 30, 20], 'Caso LR: primero rotación derecha sobre 30, luego rotación izquierda sobre 10.'],
      ['Equilibrado — 50,30,70,20,40,60,80', [50, 30, 70, 20, 40, 60, 80], 'Árbol AVL completo de 7 nodos: altura 3, todos los factores de balance en 0.']
    ];

    var wrap = U.el('div', { class: 'viz' }, [
      stage,
      U.el('div', { class: 'viz-controls' }, [
        inp,
        U.el('button', { class: 'btn primary', text: 'Insertar', onclick: function () {
          var v = parseInt(inp.value, 10);
          if (isNaN(v)) return U.toast('Ingresá un número', 'err');
          insert(v); inp.value = '';
          EDD.progress.setVizDone(opts.unit || 'u3', 'avl');
        } }),
        U.el('button', { class: 'btn', text: 'Vaciar', onclick: function () { root = null; seq = 0; out.textContent = ''; render(); } })
      ]),
      U.el('div', { class: 'viz-controls' }, presets.map(function (p) {
        return U.el('button', { class: 'btn sm', text: p[0], onclick: function () {
          root = null; seq = 0;
          p[1].forEach(function (x) { root = ins(root, x); });
          root = avlFix(root);
          out.textContent = p[2];
          render();
        } });
      })),
      out,
      U.el('div', { class: 'viz-caption dim', html: 'El número debajo de cada nodo es su <b>factor de balance</b> = altura(derecha) − altura(izquierda). Si supera 1 o baja de −1, el árbol se rota para recuperar el equilibrio. Mantenerlo balanceado garantiza <b>O(log n)</b> en insertar, buscar y eliminar.' })
    ]);
    mount.appendChild(wrap);
    render();
    EDD.registerViz('avl');
  };

  /* ============================================================
     ARBOL GENERAL (n-ario)
     ============================================================ */
  V.arbolGeneral = function (mount, opts) {
    var root = null, seq = 0;
    var cur = null;
    var stage = U.el('div', { class: 'viz-stage tree-stage' });
    var out = U.el('div', { class: 'viz-log', style: 'min-height:44px' });
    var nameIn = U.el('input', { type: 'text', placeholder: 'nombre del nodo', style: 'width:150px' });

    function layoutGeneral(r) {
      var pos = {}, i = 0, maxD = 0;
      (function walk(n, d) {
        if (!n) return;
        var k = n.kids.length;
        var x0 = i; i += k;
        var mid = k ? x0 + k / 2 - 0.5 : i;
        pos[n.uid] = { xi: mid, y: d };
        maxD = Math.max(maxD, d);
        n.kids.forEach(function (c) { walk(c, d + 1); });
      })(r, 0);
      var colW = 66, rowH = 76, padX = 46, padY = 38;
      var W = padX * 2 + (i || 1) * colW, H = padY * 2 + (maxD + 1) * rowH;
      Object.keys(pos).forEach(function (k) { pos[k].px = padX + pos[k].xi * colW + colW / 2; pos[k].py = padY + pos[k].y * rowH; });
      return { pos: pos, W: W, H: H, leaves: i };
    }

    function render() {
      if (!root) { stage.innerHTML = '<span class="dim">árbol vacío — creá la raíz</span>'; return; }
      var L = layoutGeneral(root);
      var s = svg('svg', { viewBox: '0 0 ' + L.W + ' ' + L.H, width: L.W, height: L.H });
      (function edges(n) {
        if (!n) return;
        var a = L.pos[n.uid];
        n.kids.forEach(function (c) {
          var b = L.pos[c.uid];
          var ln = svg('line', { x1: a.px, y1: a.py, x2: b.px, y2: b.py, class: 'tree-edge' + (cur && cur.uid === c.uid ? ' hl' : '') });
          s.appendChild(ln);
        });
        n.kids.forEach(function (c) { edges(c); });
      })(root);
      (function nodes(n) {
        if (!n) return;
        var p = L.pos[n.uid];
        var cls = 'tree-node' + (cur && cur.uid === n.uid ? ' hl' : '');
        var g = svg('g', { class: cls });
        g.appendChild(svg('circle', { cx: p.px, cy: p.py, r: 22, stroke: n.kids.length > 2 ? 'var(--u4)' : 'var(--brand)' }));
        var t = svg('text', { x: p.px, y: p.py });
        t.textContent = String(n.v);
        g.appendChild(t);
        if (n.kids.length) {
          var c2 = svg('text', { x: p.px, y: p.py + 36, style: 'font:700 11px var(--mono);fill:var(--fg-dim);text-anchor:middle' });
          c2.textContent = n.kids.length + ' hijos';
          g.appendChild(c2);
        }
        s.appendChild(g);
        n.kids.forEach(function (c) { nodes(c); });
      })(root);
      stage.innerHTML = '';
      stage.appendChild(s);
    }

    function mk(v) { return { v: v, kids: [], uid: ++seq }; }

/* Cada ejemplo es [etiqueta, valorRaíz, hijos] y cada hijo [valor, hijos] */
    var genome = [
      ['Genealogía: Abuelo', 'Abuelo', [
        ['Padre', [['Hijo 1', []], ['Hijo 2', []]]],
        ['Tía', [['Sobrino', []]]]
      ]],
      ['Archivos: /', 'root', [
        ['home', [['docs', []], ['img', []]]],
        ['usr', [['tmp', []]]]
      ]],
      ['Categorías', 'cat', [
        ['TECLADO', [['mecanico', []], ['optico', []]]],
        ['MOUSE', [['inalambrico', []]]],
        ['AUDIO', [['auriculares', []], ['parlante', []], ['microfono', []]]]
      ]]
    ];

    mount.appendChild(U.el('div', { class: 'viz' }, [
      stage,
      U.el('div', { class: 'viz-controls' }, [
        nameIn,
        U.el('button', { class: 'btn primary', text: 'Agregar hijo al seleccionado', onclick: function () {
          var v = nameIn.value.trim();
          if (!v) return U.toast('Escribí un nombre', 'err');
          if (!root) { root = mk(v); out.textContent = 'raíz creada: ' + v; }
          else { if (!cur) cur = root; cur.kids.push(mk(v)); out.textContent = 'add_child("' + v + '") sobre "' + cur.v + '"  →  ' + cur.kids.length + ' hijos'; }
          nameIn.value = ''; render();
          EDD.progress.setVizDone(opts.unit || 'u4', 'arbolGeneral');
        } }),
        U.el('span', { class: 'chip', text: 'Hacé clic en un nodo para seleccionarlo' })
      ]),
      U.el('div', { class: 'viz-controls' }, genome.map(function (g) {
        return U.el('button', { class: 'btn sm', text: g[0], onclick: function () {
          root = null; seq = 0;
          (function build(spec, parent) {
            var n = mk(spec[0]);
            if (parent) parent.kids.push(n); else root = n;
            spec[1].forEach(function (c) { build(c, n); });
          })([g[1], g[2]], null);
          render();
          out.textContent = 'Ejemplo cargado: ' + g[0];
        } });
      }).concat([
        U.el('button', { class: 'btn sm', text: 'Vaciar', onclick: function () { root = null; cur = null; render(); out.textContent = ''; } })
      ])),
      out,
      U.el('div', { class: 'viz-caption dim', html: 'Un <b>árbol general</b> (o n-ario) es un árbol donde cada nodo puede tener <b>cualquier cantidad</b> de hijos. El recorrido clásico es <b>en profundidad</b>: <code>mostrar_arbol(nodo, nivel)</code> imprime el nodo y después sus hijos, indentando <code>"  " * nivel</code> niveles.' })
    ]));
    stage.addEventListener('click', function (e) {
      var c = e.target.closest('.tree-node');
      if (!c) return;
      var idx = Array.prototype.indexOf.call(stage.querySelectorAll('.tree-node'), c);
      var found = null, k = 0;
      (function walk(n) { if (!n || found) return; if (k++ === idx) { found = n; return; } n.kids.forEach(walk); })(root);
      if (found) { cur = found; out.textContent = 'Seleccionado: "' + found.v + '"  (' + found.kids.length + ' hijos directos)'; render(); }
    });
    render();
    EDD.registerViz('arbolGeneral');
  };

})(window.EDD);