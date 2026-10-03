/* ============================================================
   EDD — Visualizador de grafos
   DFS · BFS · Dijkstra (paso a paso, con cola/pila visible)
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util;
  var V = EDD.viz = EDD.viz || {};
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(t, a) { var e = document.createElementNS(SVGNS, t); Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }

  /* ---------------- Datos de ejemplo ---------------- */
  var GRAFO_BFS = {           // el dataset de DFS & BFS.md
    label: 'Grafo no ponderado — ejemplo de la clase (origen 0)',
    nodos: [0, 1, 2, 3, 4],
    pos: { 0: [160, 40], 1: [70, 150], 2: [250, 150], 3: [70, 265], 4: [250, 265] },
    aristas: [[0, 1], [0, 2], [1, 3], [1, 4]],
    dirigido: false
  };
  var GRAFO_MATRIZ = {        // matriz de adyacencia 5x5 equivalente
    label: 'Grafo no ponderado — verificado como matriz de adyacencia',
    nodos: [0, 1, 2, 3, 4],
    pos: { 0: [160, 40], 1: [70, 150], 2: [250, 150], 3: [70, 265], 4: [250, 265] },
    aristas: [[0, 1], [0, 2], [1, 3], [1, 4]],
    dirigido: false, matriz: [[0, 1, 1, 0, 0], [1, 0, 0, 1, 1], [1, 0, 0, 0, 0], [0, 1, 0, 0, 1], [0, 1, 0, 1, 0]]
  };
  var GRAFO_DIJKSTRA = {      // el dataset del Final ED 2024
    label: 'Grafo ponderado — Final ED 2024 (nodos 1..5)',
    nodos: [1, 2, 3, 4, 5],
    pos: { 1: [160, 45], 2: [70, 165], 3: [250, 165], 4: [95, 280], 5: [235, 285] },
    aristas: [[1, 2, 2], [1, 3, 4], [2, 3, 1], [2, 4, 7], [3, 5, 3], [4, 5, 1]],
    dirigido: true
  };
  var GRAFO_DIJKSTRA2 = {     // ejemplo con letras de Dijkstra.md
    label: "Grafo ponderado — ejemplo con letras (origen 'A')",
    nodos: ['A', 'B', 'C', 'D'],
    pos: { A: [150, 45], B: [70, 165], C: [230, 165], D: [150, 285] },
    aristas: [['A', 'B', 3], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 4]],
    dirigido: true
  };
  var GRAFO_CLAQUIS = {       // el grafo de la clase con vértices 1..6
    label: 'Grafo dirigido — ejemplo de grafo.py (6 vértices)',
    nodos: [1, 2, 3, 4, 5, 6],
    pos: { 1: [160, 40], 2: [70, 140], 3: [250, 140], 4: [70, 250], 5: [165, 250], 6: [265, 250] },
    aristas: [[1, 2], [1, 3], [2, 4], [4, 5], [4, 6], [5, 6]],
    dirigido: true
  };
  var GRAFO_CICLO = {
    label: 'Grafo con ciclo — para detectar ciclos y ver por qué BFS da el camino mínimo',
    nodos: ['A', 'B', 'C', 'D', 'E'],
    pos: { A: [160, 40], B: [65, 150], C: [255, 150], D: [80, 265], E: [245, 265] },
    aristas: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['C', 'E'], ['D', 'E'], ['E', 'A']],
    dirigido: false
  };

  /* ---------------- Motor ---------------- */
  V.grafo = function (mount, opts) {
    opts = opts || {};
    var G = GRAFO_BFS;
    var W = 320, H = 310;

    var stage = U.el('div', { class: 'viz-stage graph-stage' });
    var colDer = U.el('div', { class: 'graph-stage', style: 'min-height:170px;border-top:1px dashed var(--line);padding-top:14px;margin-top:12px' });
    var log = U.el('div', { class: 'viz-log' });
    var out = U.el('div', { class: 'viz-log', style: 'max-height:none' });

    var estado = { cls: {}, orden: [], visitados: [], dist: null, camino: [], heap: { kind: 'pila', items: [] } };

    /* --- build matrices/listas auxiliares --- */
    function ady(v) {
      return G.aristas.filter(function (e) { return e[0] === v; }).map(function (e) {
        return { v: e[1], w: e.length > 2 ? e[2] : 1 };
      });
    }
    function undy(v) {
      var out2 = [];
      G.aristas.forEach(function (e) {
        if (e[0] === v) out2.push({ v: e[1], w: e.length > 2 ? e[2] : 1 });
        else if (!G.dirigido && e[1] === v) out2.push({ v: e[0], w: e.length > 2 ? e[2] : 1 });
      });
      return out2;
    }
    function vecinos(v) { return G.dirigido ? ady(v) : undy(v); }

    /* ---------------- render ---------------- */
    function draw(container, w, h) {
      container.innerHTML = '';
      var s = svg('svg', { viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'xMidYMid meet' });
      // aristas
      G.aristas.forEach(function (e) {
        var a = G.pos[e[0]], b = G.pos[e[1]];
        if (!a || !b) return;
        var on = estado.camino.some(function (c) {
          return (c[0] === e[0] && c[1] === e[1]) || (!G.dirigido && c[0] === e[1] && c[1] === e[0]);
        });
        var ln = svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'gedge' + (on ? ' path' : '') });
        s.appendChild(ln);
        if (e.length > 2) {
          var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
          var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
          var off = 13;
          var t = svg('text', {
            x: mx - dy / L * off, y: my + dx / L * off,
            class: 'gedge-label'
          });
          t.textContent = e[2];
          t.setAttribute('style', 'paint-order:stroke;stroke:var(--bg-card);stroke-width:3px');
          s.appendChild(t);
        }
      });
      // nodos
      G.nodos.forEach(function (n) {
        var p = G.pos[n];
        if (!p) return;
        var cls = 'gnode';
        if (estado.cls[n] === 'cur') cls += ' cur';
        else if (estado.cls[n] === 'vis') cls += ' vis';
        else if (estado.cls[n] === 'inq') cls += ' inq';
        else if (estado.cls[n] === 'dist') cls += ' dist';
        var g = svg('g', { class: cls });
        g.appendChild(svg('circle', { cx: p[0], cy: p[1], r: 20 }));
        var t = svg('text', { x: p[0], y: p[1] });
        t.textContent = String(n);
        g.appendChild(t);
        if (estado.dist && estado.dist[n] != null && estado.dist[n] !== Infinity) {
          var d = svg('text', {
            x: p[0], y: p[1] + 33,
            style: 'font:700 11px var(--mono);fill:var(--warn);text-anchor:middle'
          });
          d.textContent = 'd=' + estado.dist[n];
          g.appendChild(d);
        }
        if (estado.orden.indexOf(n) >= 0) {
          var o = svg('text', { x: p[0] - 20, y: p[1] - 24, style: 'font:800 12px var(--mono);fill:var(--ok);text-anchor:middle' });
          o.textContent = estado.orden.indexOf(n) + 1;
          g.appendChild(o);
        }
        s.appendChild(g);
      });
      container.appendChild(s);
    }

    function render() {
      draw(stage, W, H);
      // panel de la estructura auxiliar (pila o cola)
      colDer.innerHTML = '';
      var esPila = estado.heap.kind === 'pila';
      var nombre = esPila ? 'Pila  (DFS — LIFO)' : estado.heap.kind === 'cola' ? 'Cola  (BFS — FIFO)' : 'Cola de prioridad  (Dijkstra)';
      colDer.appendChild(U.el('div', { class: 'chip brand mb-1', text: nombre }));
      var row = U.el('div', { class: 'flex', style: 'min-height:38px;gap:4px' });
      if (!estado.heap.items.length) row.appendChild(U.el('span', { class: 'dim small', text: '(vacía)' }));
      estado.heap.items.forEach(function (it, i) {
        var lbl = typeof it === 'object' ? it.n + ' (' + it.d + ')' : String(it);
        var first = esPila ? i === estado.heap.items.length - 1 : i === 0;
        row.appendChild(U.el('span', { class: 'nd' + (first ? ' head' : ''), text: lbl }));
        if (!esPila && i < estado.heap.items.length - 1) row.appendChild(U.el('span', { class: 'arrow', text: '→' }));
      });
      colDer.appendChild(row);

      // tabla de adyacencia
      var tbl = U.el('div', { class: 'table-wrap' });
      var t = U.el('table');
      t.appendChild(U.el('thead', null, U.el('tr', null, [U.el('th', { text: 'Vértice' }), U.el('th', { text: 'Lista de adyacencia' })])));
      var tb = U.el('tbody');
      G.nodos.forEach(function (n) {
        var l = vecinos(n).map(function (x) { return String(x.v) + (x.w !== 1 || G.aristas.some(function (e) { return e.length > 2; }) ? ' (' + x.w + ')' : ''); });
        tb.appendChild(U.el('tr', null, [
          U.el('td', null, U.el('b', { text: String(n) })),
          U.el('td', { html: l.length ? l.join(', ') + ' → None' : 'None' })
        ]));
      });
      t.appendChild(tb);
      tbl.appendChild(t);
      colDer.appendChild(U.el('div', { class: 'tiny dim mt-1', text: G.label }));
      colDer.appendChild(tbl);
    }

    /* ---------------- DFS ---------------- */
    function runDFS(inicio, RECORD) {
      inicio = Number(inicio);
      estado.cls = {}; estado.orden = []; estado.heap = { kind: 'pila', items: [] };
      estado.dist = null; estado.camino = [];
      var pila = [inicio];
      estado.cls[inicio] = 'cur';
      var visitados = {};
      render();
      var pasos = [];
      function paso() {
        if (!pila.length) {
          estado.cls = {};
          estado.orden.forEach(function (n) { estado.cls[n] = 'vis'; });
          out.textContent = 'DFS desde ' + inicio + ' → ' + estado.orden.join(' ');
          out.textContent += '\n' + pasos.slice(-6).join('\n');
          log.textContent = 'Pila vacía: se terminó el recorrido.';
          render();
          EDD.progress.setVizDone(opts.unit || 'u7', 'grafo');
          return;
        }
        var n = pila.pop();
        if (visitados[n]) { pasos.push('Se saca ' + n + ' de la pila pero ya estaba visitado → se descarta'); render(); setTimeout(paso, 380); return; }
        visitados[n] = 1;
        estado.orden.push(n);
        estado.cls = {};
        Object.keys(visitados).forEach(function (k) { estado.cls[k] = 'vis'; });
        estado.cls[n] = 'cur';
        pasos.push('Sacar ' + n + ' de la pila, marcarlo visitado. Sus vecinos sin visitar: ' +
          (vecinos(n).filter(function (x) { return !visitados[x.v]; }).map(function (x) { return x.v; }).join(', ') || 'ninguno'));
        pila.push.apply(pila, vecinos(n).filter(function (x) { return !visitados[x.v]; }).map(function (x) { return x.v; }).reverse());
        estado.heap.items = pila.slice();
        log.textContent = 'Pila: [' + pila.join(', ') + ']';
        render();
        setTimeout(paso, 700);
      }
      setTimeout(paso, 300);
    }

    /* ---------------- BFS ---------------- */
    function runBFS(inicio) {
      inicio = Number(inicio);
      estado.cls = {}; estado.orden = []; estado.heap = { kind: 'cola', items: [] };
      estado.dist = null; estado.camino = [];
      var cola = [inicio];
      var visitados = {};
      var dist = { }; dist[inicio] = 0;
      estado.cls[inicio] = 'cur';
      estado.dist = dist;
      var pasos = [];
      render();
      function paso() {
        if (!cola.length) {
          estado.cls = {};
          estado.orden.forEach(function (n) { estado.cls[n] = 'vis'; });
          out.textContent = 'BFS desde ' + inicio + ' → ' + estado.orden.join(' ');
          out.textContent += '\nDistancias (en aristas): ' + G.nodos.map(function (n) { return n + '=' + (dist[n] == null ? '\u221e' : dist[n]); }).join(', ');
          log.textContent = 'Cola vacía: se terminó el recorrido.';
          render();
          EDD.progress.setVizDone(opts.unit || 'u7', 'grafo');
          return;
        }
        var n = cola.shift();
        if (visitados[n]) { render(); setTimeout(paso, 250); return; }
        visitados[n] = 1;
        estado.orden.push(n);
        estado.cls = {};
        Object.keys(visitados).forEach(function (k) { estado.cls[k] = 'vis'; });
        estado.cls[n] = 'cur';
        var nuevos = vecinos(n).filter(function (x) { return !visitados[x.v]; });
        nuevos.forEach(function (x) { if (dist[x.v] == null) dist[x.v] = dist[n] + 1; });
        pasos.push('Desencolar ' + n + ' (distancia ' + dist[n] + '). Encolar sus vecinos no visitados: ' + (nuevos.map(function (x) { return x.v; }).join(', ') || 'ninguno'));
        cola.push.apply(cola, nuevos.map(function (x) { return x.v; }));
        estado.heap.items = cola.slice();
        log.textContent = 'Cola: [' + cola.join(', ') + ']';
        render();
        setTimeout(paso, 700);
      }
      setTimeout(paso, 300);
    }

    /* ---------------- Dijkstra ---------------- */
    function runDijkstra(origen) {
      origen = Number(origen);
      estado.cls = {}; estado.orden = []; estado.camino = [];
      var INF = 999999;
      var dist = {}, prev = {}, vis = {}, heap = [];
      G.nodos.forEach(function (n) { dist[n] = INF; });
      dist[origen] = 0;
      estado.dist = dist;
      estado.heap = { kind: 'pq', items: [] };
      estado.cls[origen] = 'cur';
      var pasos = [];
      render();

      function caminoDe(n) { var c = []; while (n != null) { c.push(n); n = prev[n]; } return c; }
      function pushH(n, d) {
        heap.push({ n: n, d: d });
        heap.sort(function (a, b) { return a.d - b.d; });
        estado.heap.items = heap.slice();
      }
      function popH() { return heap.shift(); }

      pushH(origen, 0);
      function paso() {
        if (!heap.length) {
          estado.cls = {};
          G.nodos.forEach(function (n) { if (dist[n] < INF) estado.cls[n] = 'vis'; });
          estado.camino = [];
          out.textContent = 'Dijkstra desde ' + origen + '\nDistancias mínimas: { ' +
            G.nodos.map(function (n) { return n + ': ' + (dist[n] < INF ? dist[n] : '∞'); }).join(', ') + ' }';
          out.textContent += '\nCaminos mínimos: ' + G.nodos.map(function (n) {
            return n + ' ← ' + caminoDe(n).reverse().join(' → ');
          }).join('     |     ');
          log.textContent = 'Cola de prioridad vacía: todos los nodos alcanzables fueron procesados.';
          render();
          EDD.progress.setVizDone(opts.unit || 'u7', 'grafo');
          return;
        }
        var cur = popH();
        estado.heap.items = heap.slice();
        var n = cur.n;
        if (vis[n]) { render(); setTimeout(paso, 180); return; }
        if (cur.d > dist[n]) { render(); setTimeout(paso, 250); return; }
        vis[n] = 1;
        estado.orden.push(n);
        estado.cls = {};
        Object.keys(vis).forEach(function (k) { estado.cls[k] = 'vis'; });
        estado.cls[n] = 'cur';
        pasos.push('Sacar el nodo con menor distancia provisional: ' + n + ' (d=' + dist[n] + '). Marcarlo como VISITADO: su camino ya es definitivo.');
        vecinos(n).forEach(function (x) {
          var alt = dist[n] + x.w;
          if (alt < dist[x.v]) {
            pasos.push('  Relajar ' + n + '→' + x.v + ' (peso ' + x.w + '): ' + alt + ' mejora el valor actual → dist[' + x.v + '] = ' + alt + ', previo = ' + n);
            dist[x.v] = alt; prev[x.v] = n;
            pushH(x.v, alt);
          } else {
            pasos.push('  Arista ' + n + '→' + x.v + ' (peso ' + x.w + '): ' + alt + ' no mejora el ' + (dist[x.v] < INF ? dist[x.v] : 'Infinity') + ' actual → se descarta');
          }
        });
        log.textContent = 'Cola de prioridad: [' + heap.map(function (h) { return h.n + '(' + h.d + ')'; }).join(', ') + ']';
        render();
        setTimeout(paso, 800);
      }
      setTimeout(paso, 350);
    }

    /* ---------------- UI ---------------- */
    var gSel = U.el('select', { class: 'btn' });
    [
      ['bfs', 'Grafo de la clase (no ponderado)'],
      ['matriz', 'El mismo grafo como matriz de adyacencia'],
      ['dijk', 'Grafo del Final ED 2024 (ponderado)'],
      ['dijk2', "Grafo con letras (ponderado)"],
      ['claquis', 'Grafo dirigido de grafo.py (6 vértices)'],
      ['ciclo', 'Grafo con ciclo']
    ].forEach(function (g) { gSel.appendChild(U.el('option', { value: g[0], text: g[1] })); });

    var nSel = U.el('select', { class: 'btn' });
    function fillNodos() {
      nSel.innerHTML = '';
      G.nodos.forEach(function (n) { nSel.appendChild(U.el('option', { value: String(n), text: 'origen = ' + n })); });
    }

    gSel.addEventListener('change', function () {
      var k = gSel.value;
      G = k === 'bfs' ? GRAFO_BFS : k === 'matriz' ? GRAFO_MATRIZ
        : k === 'dijk' ? GRAFO_DIJKSTRA : k === 'dijk2' ? GRAFO_DIJKSTRA2
        : k === 'claquis' ? GRAFO_CLAQUIS : GRAFO_CICLO;
      fillNodos();
      estado = { cls: {}, orden: [], visitados: [], dist: null, camino: [], heap: { kind: '', items: [] } };
      log.textContent = ''; out.textContent = '';
      render();
    });
    fillNodos();

    var wrap = U.el('div', { class: 'viz' }, [
      stage,
      U.el('div', { class: 'viz-controls' }, [
        gSel, nSel,
        U.el('button', { class: 'btn primary', text: '▶ DFS', onclick: function () { runDFS(nSel.value); } }),
        U.el('button', { class: 'btn primary', text: '▶ BFS', onclick: function () { runBFS(nSel.value); } }),
        U.el('button', { class: 'btn primary', text: '▶ Dijkstra', onclick: function () { runDijkstra(nSel.value); } })
      ]),
      log,
      colDer,
      out
    ]);
    mount.appendChild(wrap);
    render();
    EDD.registerViz('grafo');
  };

  /** Matriz de adyacencia vs lista, lado a lado */
  V.adyacencia = function (mount, opts) {
    opts = opts || {};
    var a = GRAFO_BFS;
    var filas = a.nodos.map(function (n, i) {
      return [String(n)].concat(a.nodos.map(function (m, j) {
        var v = a.aristas.some(function (e) { return (e[0] === n && e[1] === m) || (!a.dirigido && e[0] === m && e[1] === n); });
        return v ? '1' : '0';
      }));
    });
    mount.appendChild(U.el('div', { class: 'grid grid-2' }, [
      U.el('div', null, [
        U.el('h4', { text: 'Matriz de adyacencia' }),
        U.table([''].concat(a.nodos.map(String)), filas),
        U.el('div', { class: 'viz-caption', html: 'Celda <code>[i][j]</code> = 1 si hay arista. <b>Espacial O(V²)</b>, pero responder "¿hay arista entre i y j?" es O(1). Buena para grafos <b>densos</b>.' })
      ]),
      U.el('div', null, [
        U.el('h4', { text: 'Lista de adyacencia' }),
        U.table(['Vértice', 'Vecinos'], a.nodos.map(function (n) {
          var l = a.aristas.filter(function (e) { return e[0] === n; }).map(function (e) { return e[1]; });
          return [String(n), l.length ? l.join(' → ') + ' → None' : 'None'];
        })),
        U.el('div', { class: 'viz-caption', html: 'Un diccionario <code>{vértice: [vecinos]}</code>. <b>Espacial O(V + E)</b>, iteración proporcional a los grados. Buena para grafos <b>dispersos</b> y para DFS/BFS/Dijkstra.' })
      ])
    ]));
    EDD.registerViz('adyacencia');
    /* Es un visualizador informativo (sin interacción): se da por visto al abrirlo. */
    EDD.progress.setVizDone(opts.unit || 'u7', 'adyacencia');
  };

})(window.EDD);