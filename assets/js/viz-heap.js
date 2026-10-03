/* ============================================================
   EDD — Visualizador de Montículo (Heap) / Cola de Prioridades
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util;
  var V = EDD.viz = EDD.viz || {};
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(t, a) { var e = document.createElementNS(SVGNS, t); Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }

  V.heap = function (mount, opts) {
    opts = opts || {};
    var arr = [];
    var maxMode = opts.mode !== 'min';   // MaxHeap por defecto (como el apunte)
    var h = [];

    var treeStage = U.el('div', { class: 'viz-stage tree-stage', style: 'min-height:200px' });
    var arrStage = U.el('div', { class: 'viz-stage', style: 'flex-direction:column;gap:10px;align-items:center;justify-content:center' });
    var log = U.el('div', { class: 'viz-log' });
    var inp = U.el('input', { type: 'number', placeholder: 'prioridad', style: 'width:110px' });

    function cmp(a, b) { return maxMode ? a > b : a < b; }
    function extreme() { return maxMode ? 'máximo' : 'mínimo'; }

    function idxP(i) { return Math.floor((i - 1) / 2); }
    function idxL(i) { return 2 * i + 1; }
    function idxR(i) { return 2 * i + 2; }

    /* burbujeo arriba */
    function up(i, trace) {
      while (i > 0) {
        var p = idxP(i);
        if (!cmp(arr[i], arr[p])) break;
        if (trace) trace.push('El valor de la posición ' + i + ' (' + arr[i] + ') es ' + (maxMode ? 'mayor' : 'menor') + ' que su padre en ' + p + ' (' + arr[p] + ') → intercambian');
        var t = arr[i]; arr[i] = arr[p]; arr[p] = t;
        i = p;
      }
    }
    /* burbujeo abajo */
    function down(i, trace) {
      var n = arr.length;
      for (;;) {
        var l = idxL(i), r = idxR(i), big = i;
        if (l < n && cmp(arr[l], arr[big])) big = l;
        if (r < n && cmp(arr[r], arr[big])) big = r;
        if (big === i) break;
        if (trace) trace.push('En la posición ' + i + ' hay ' + arr[i] + ', pero su hijo en ' + big + ' tiene ' + arr[big] + ' → intercambian');
        var t = arr[i]; arr[i] = arr[big]; arr[big] = t;
        i = big;
      }
    }

    function insert(v, animate) {
      var trace = [];
      arr.push(v);
      var wasRoot = arr.length === 1;
      up(arr.length - 1, trace);
      log.textContent = 'insert(' + v + '): se agrega al final (posición ' + (arr.length - 1) + ') y sube por burbujeo hasta su lugar. → ' + arr.slice().join(', ');
      if (trace.length) log.textContent += '\n' + trace.join('\n');
      render(animate ? 'new' : null);
      return wasRoot;
    }

    function extract() {
      if (!arr.length) { log.textContent = 'El heap está vacío → se devuelve None'; return null; }
      var ext = arr[0];
      var last = arr.pop();
      if (arr.length) { arr[0] = last; }
      var trace = [];
      if (arr.length) down(0, trace);
      log.textContent = 'extract_' + (maxMode ? 'max' : 'min') + '(): se saca la raíz (' + ext + '), se sube el último (' + last + ') y baja por burbujeo. → ' + (arr.length ? arr.slice().join(', ') : '[]');
      if (trace.length) log.textContent += '\n' + trace.join('\n');
      render('root');
      return ext;
    }

    function removeVal(v) {
      var i = arr.indexOf(v);
      if (i < 0) { log.textContent = 'El valor ' + v + ' no está en el heap.'; return false; }
      arr[i] = arr[arr.length - 1];
      arr.pop();
      down(i, []); up(i, []);
      log.textContent = 'eliminar(' + v + '): estaba en la posición ' + i + '; se reemplaza por el último elemento y se corrige con burbujeo abajo y arriba. → ' + (arr.length ? arr.slice().join(', ') : '[]');
      render();
      return true;
    }

    function render(hl) {
      /* Array */
      arrStage.innerHTML = '';
      var row = U.el('div', { class: 'heap-array' });
      arr.forEach(function (v, i) {
        var cls = 'heap-cell' + (i === 0 ? ' root' : '');
        if (hl === 'new' && i === 0 && arr.length > 1) cls += ' cmp';
        if (hl === 'root' && i === 0) cls += ' cmp';
        var c = U.el('div', { class: cls }, [
          U.el('span', { class: 'ix', text: 'i=' + i }),
          String(v)
        ]);
        if (hl === 'new' && arr.length > 1 && i === arr.length - 1) c.classList.add('swapping');
        row.appendChild(c);
      });
      if (!arr.length) row.appendChild(U.el('span', { class: 'dim small', text: '[] — heap vacío' }));
      arrStage.appendChild(U.el('div', { class: 'small dim', text: 'El heap se guarda como una lista. La raíz (índice 0) es siempre el ' + extreme() + '.' }));
      arrStage.appendChild(row);
      arrStage.appendChild(U.el('div', { class: 'tiny dim', style: 'font-family:var(--mono)', text: arr.length ? '[' + arr.join(', ') + ']' : '' }));
      arrStage.appendChild(U.el('div', { class: 'tiny dim', style: 'font-family:var(--mono)', text: 'padre = (i-1)//2   hijo izq = 2i+1   hijo der = 2i+2' }));

      /* Árbol */
      treeStage.innerHTML = '';
      if (!arr.length) { treeStage.appendChild(U.el('span', { class: 'dim', text: 'árbol vacío' })); return; }
      var pos = [], n = arr.length;
      var depth = function (i) { var d = 0; while (i > 0) { i = idxP(i); d++; } return d; };
      var maxd = 0; for (var k = 0; k < n; k++) maxd = Math.max(maxd, depth(k));
      var colW = 58, rowH = 68, padX = 46, padY = 40;
      var used = [], lv = {};
      for (var k = 0; k < n; k++) { var d = depth(k); (lv[d] = lv[d] || []).push(k); }
      Object.keys(lv).forEach(function (d) { lv[d].forEach(function (ix, j) { used.push([d, j, lv[d].length, ix]); }); });
      used.forEach(function (u) { pos[u[3]] = { px: padX + (u[1] - (u[2] - 1) / 2) * colW + 30, py: padY + u[0] * rowH }; });
      var W = padX * 2 + (used.length ? Math.max.apply(null, used.map(function (u) { return u[1]; })) : 0) * colW + 60;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + (padY * 2 + (maxd + 1) * rowH), width: W, height: padY * 2 + (maxd + 1) * rowH });
      for (var k = 0; k < n; k++) {
        var p = pos[k];
        [idxL(k), idxR(k)].forEach(function (c) {
          if (c >= n || !pos[c]) return;
          s.appendChild(svg('line', { x1: p.px, y1: p.py, x2: pos[c].px, y2: pos[c].py, class: 'tree-edge' + (hl === 'new' && c === arr.length - 1 ? ' hl' : '') }));
        });
      }
      for (var k = 0; k < n; k++) {
        var p2 = pos[k];
        var g = svg('g', { class: 'tree-node' + (k === 0 && arr.length > 1 ? ' hl' : '') });
        g.appendChild(svg('circle', { cx: p2.px, cy: p2.py, r: 22 }));
        var t = svg('text', { x: p2.px, y: p2.py }); t.textContent = String(arr[k]);
        g.appendChild(t);
        s.appendChild(g);
      }
      treeStage.appendChild(s);
    }

    function preset(vals, msg) {
      arr = [];
      vals.forEach(function (v) { arr.push(v); up(arr.length - 1, []); });
      log.textContent = msg || ('Cargado: insertando ' + vals.join(', '));
      render();
    }

    function demoTrace() {
      arr = [];
      var lines = [];
      ['insertar 10', 'insertar 20', 'insertar 5', 'extraer el máximo (20)', 'extraer el máximo (10)', 'extraer el máximo (5)'].forEach(function (stepTxt, si) {
        var trace = [];
        if (si < 3) {
          var v = [10, 20, 5][si];
          arr.push(v);
          up(arr.length - 1, trace);
          lines.push(stepTxt + '  →  [' + arr.join(', ') + ']');
        } else {
          var ext = arr[0], last = arr.pop();
          if (arr.length) { arr[0] = last; down(0, trace); }
          lines.push(stepTxt + '  →  [' + arr.join(', ') + ']');
        }
        if (trace.length) lines.push('    ' + trace.join('\n    '));
      });
      /* Dejamos el heap en el estado final del ejemplo y mostramos la traza. */
      log.textContent = 'Traza completa del ejemplo del apunte:\n' + lines.join('\n');
      render();
    }

    function demoDelete() {
      preset([10, 20, 5], 'Partimos de [20, 10, 5] (después de insertar 10, 20 y 5).');
      setTimeout(function () { removeVal(20); }, 900);
    }

    var modeSel = U.el('select', { class: 'btn' }, [
      U.el('option', { value: 'max', text: 'MaxHeap (máximo arriba)', selected: maxMode }),
      U.el('option', { value: 'min', text: 'MinHeap (mínimo arriba)' })
    ]);
    var extractBtn = U.el('button', { class: 'btn', text: 'extract_' + (maxMode ? 'max' : 'min'), onclick: function () { extract(); EDD.progress.setVizDone(opts.unit || 'u5', 'heap'); } });
    modeSel.addEventListener('change', function () {
      maxMode = modeSel.value === 'max';
      /* Al cambiar de modo hay que reordenar: si no, el arreglo ya no cumple la propiedad. */
      var vals = arr.slice();
      arr = [];
      vals.forEach(function (x) { arr.push(x); up(arr.length - 1, []); });
      extractBtn.textContent = 'extract_' + (maxMode ? 'max' : 'min');
      log.textContent = vals.length
        ? 'Modo ' + (maxMode ? 'MaxHeap' : 'MinHeap') + ': el mismo conjunto de valores, reordenado para cumplir la nueva propiedad → [' + arr.join(', ') + ']'
        : '';
      render();
    });

    mount.appendChild(U.el('div', { class: 'viz' }, [
      U.el('h4', { class: 'mt-0', text: 'Cola de prioridad — Montículo binario' }),
      treeStage, arrStage,
      U.el('div', { class: 'viz-controls' }, [
        inp, modeSel,
        U.el('button', { class: 'btn primary', text: 'insert', onclick: function () {
          var v = parseInt(inp.value, 10);
          if (isNaN(v)) return U.toast('Ingresá un número', 'err');
          insert(v, true); inp.value = '';
          EDD.progress.setVizDone(opts.unit || 'u5', 'heap');
        } }),
        U.el('button', { class: 'btn', text: 'eliminar(valor)', onclick: function () {
          var v = parseInt(inp.value, 10);
          if (isNaN(v)) return U.toast('Ingresá un número', 'err');
          removeVal(v);
        } }),
        extractBtn,
        U.el('button', { class: 'btn', text: 'Vaciar', onclick: function () { arr = []; log.textContent = ''; render(); } })
      ]),
      U.el('div', { class: 'viz-controls' }, [
        U.el('button', { class: 'btn sm', text: '▶ Traza del ejemplo (10, 20, 5)', onclick: demoTrace }),
        U.el('button', { class: 'btn sm', text: '▶ Ejemplo de eliminación', onclick: demoDelete })
      ]),
      log,
      U.el('div', { class: 'viz-caption dim', html: 'Un <b>montículo</b> es un árbol binario <em>completo</em> que se representa con un <code>array</code>: los hijos del índice <code>i</code> están en <code>2i+1</code> y <code>2i+2</code>, y el padre en <code>(i-1)//2</code>. La propiedad es que cada padre es ' + (maxMode ? 'mayor o igual' : 'menor o igual') + ' que sus hijos. <b>Inserción</b> y <b>extracción</b> cuestan <b>O(log n)</b>; acceder al extremo es <b>O(1)</b>.' })
    ]));
    render();
    EDD.registerViz('heap');
  };

})(window.EDD);