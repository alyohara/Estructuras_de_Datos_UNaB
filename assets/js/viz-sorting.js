/* ============================================================
   EDD — Visualizador de ordenamiento
   Burbujeo · Selección · Inserción · Quicksort (con pivote) · Merge
   Cada algoritmo muestra: comparaciones, intercambios y complejidad real.
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util;
  var V = EDD.viz = EDD.viz || {};

  /* Cada algoritmo produce una lista de pasos:
     { a: copia del array, i, j, k, msg, pivot, sorted: [índices], hi } */
  var ALGOS = {
    burbujeo: {
      desc: 'Compara vecinos e intercambia si están desordenados. En cada pasada el elemento mayor "bubjea" hasta el final.',
      worst: 'O(n²)', best: 'O(n)', space: 'O(1)', stable: true,
      code: 'def burbujeo(lista):\n    for i in range(1, len(lista)):\n        for j in range(0, len(lista) - i):\n            if lista[j] > lista[j + 1]:\n                lista[j], lista[j + 1] = lista[j + 1], lista[j]\n    return lista',
      gen: function (a0) {
        var a = a0.slice(), st = [];
        var n = a.length;
        for (var i = 1; i < n; i++) {
          for (var j = 0; j < n - i; j++) {
            var swap = a[j] > a[j + 1];
            st.push({ a: a.slice(), i: i, j: j, msg: 'Compara ' + a[j] + ' con ' + a[j + 1] + ' → ' + (swap ? 'intercambian' : 'ya están en orden'), sorted: range(n - i, n), swap: swap });
            if (swap) { var t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; st.push({ a: a.slice(), i: i, j: j, msg: 'Intercambio en las posiciones ' + j + ' y ' + (j + 1), sorted: range(n - i, n), swap: true }); }
          }
        }
        st.push({ a: a.slice(), msg: 'Lista ordenada: [' + a.join(', ') + ']', sorted: range(n) });
        return st;
      }
    },
    seleccion: {
      desc: 'En cada pasada busca el mínimo del resto y lo intercambia con la posición i. Siempre hace n−1 comparaciones por pasada.',
      worst: 'O(n²)', best: 'O(n²)', space: 'O(1)', stable: false,
      code: 'def seleccion(lista):\n    for i in range(len(lista) - 1):\n        minimo = i\n        for j in range(i + 1, len(lista)):\n            if lista[j] < lista[minimo]:\n                minimo = j\n        lista[i], lista[minimo] = lista[minimo], lista[i]\n    return lista',
      gen: function (a0) {
        var a = a0.slice(), st = [], n = a.length;
        for (var i = 0; i < n - 1; i++) {
          var m = i;
          for (var j = i + 1; j < n; j++) {
            if (a[j] < a[m]) {
              st.push({ a: a.slice(), i: i, j: j, k: m, msg: a[j] + ' < ' + a[m] + ' → nuevo mínimo en la posición ' + j, sorted: range(i) });
              m = j;
            } else {
              st.push({ a: a.slice(), i: i, j: j, k: m, msg: a[j] + ' no es menor que ' + a[m], sorted: range(i) });
            }
          }
          if (m !== i) { var t = a[i]; a[i] = a[m]; a[m] = t; }
          st.push({ a: a.slice(), i: i, k: m, msg: 'El mínimo (' + a[i] + ') queda fijo en la posición ' + i, sorted: range(i + 1), swap: m !== i });
        }
        st.push({ a: a.slice(), msg: 'Lista ordenada: [' + a.join(', ') + ']', sorted: range(n) });
        return st;
      }
    },
    insercion: {
      desc: 'Como ordenar cartas: toma el elemento y lo inserta en el sub-arreglo ordenado que tiene a la izquierda. Muy rápido para listas casi ordenadas.',
      worst: 'O(n²)', best: 'O(n)', space: 'O(1)', stable: true,
      code: 'def insercion(lista):\n    for i in range(1, len(lista)):\n        aux = lista[i]\n        j = i - 1\n        while j >= 0 and lista[j] > aux:\n            lista[j + 1] = lista[j]\n            j -= 1\n        lista[j + 1] = aux\n    return lista',
      gen: function (a0) {
        var a = a0.slice(), st = [], n = a.length;
        for (var i = 1; i < n; i++) {
          var aux = a[i], j = i - 1;
          st.push({ a: a.slice(), i: i, j: j, msg: 'aux = ' + aux + '. Lo corro a la izquierda hasta su lugar', sorted: range(i + 1) });
          while (j >= 0 && a[j] > aux) {
            st.push({ a: a.slice(), i: i, j: j, msg: a[j] + ' > ' + aux + ' → desplazar a la derecha', sorted: range(i + 1), swap: true });
            a[j + 1] = a[j]; j--;
          }
          a[j + 1] = aux;
          st.push({ a: a.slice(), i: i, j: j + 1, msg: 'aux = ' + aux + ' queda en la posición ' + (j + 1), sorted: range(i + 1) });
        }
        st.push({ a: a.slice(), msg: 'Lista ordenada: [' + a.join(', ') + ']', sorted: range(n) });
        return st;
      }
    },
    quicksort: {
      desc: 'Divide y vencerás: elige un pivote y pone menores a la izquierda, mayores a la derecha. El pivote queda en su posición final.',
      worst: 'O(n²)', best: 'O(n log n)', space: 'O(log n)', stable: false,
      code: 'def quicksort(lista, primero=0, ultimo=len(lista)-1):\n    if primero < ultimo:\n        i, j, pivote = primero, ultimo, lista[ultimo]\n        while i <= j:\n            while lista[i] < pivote:\n                i += 1\n            while lista[j] > pivote:\n                j -= 1\n            if i <= j:\n                lista[i], lista[j] = lista[j], lista[i]\n                i, j = i + 1, j - 1\n        quicksort(lista, primero, j)\n        quicksort(lista, i, ultimo)\n    return lista',
      gen: function (a0) {
        var a = a0.slice(), st = [], n = a.length, depth = [];
        function part(prim, ult) {
          depth.push({ lo: prim, hi: ult, d: depth.length });
          st.push({ a: a.slice(), lo: prim, hi: ult, msg: 'Particionar el tramo [' + prim + '…' + ult + '] = [' + a.slice(prim, ult + 1).join(', ') + ']', hi: [ult], depth: depth.slice() });
          var piv = a[ult], i = prim, j = ult;
          while (i <= j) {
            while (i <= j && a[i] < piv) { i++; st.push({ a: a.slice(), i: i, lo: prim, hi: ult, msg: 'Avanzar i (buscando valor ≥ ' + piv + ')', depth: depth.slice() }); }
            while (i <= j && a[j] > piv) { j--; st.push({ a: a.slice(), j: j, lo: prim, hi: ult, msg: 'Retroceder j (buscando valor ≤ ' + piv + ')', depth: depth.slice() }); }
            if (i <= j) {
              if (i !== j) { var t = a[i]; a[i] = a[j]; a[j] = t; }
              st.push({ a: a.slice(), i: i, j: j, pivot: ult, lo: prim, hi: ult, msg: 'Colocar ' + piv + ' entre menores y mayores (i=' + i + ', j=' + j + ')', swap: i !== j, depth: depth.slice() });
              i++; j--;
            }
          }
          if (prim < j) part(prim, j);
          if (i < ult) part(i, ult);
        }
        part(0, n - 1);
        st.push({ a: a.slice(), msg: 'Lista ordenada: [' + a.join(', ') + ']', sorted: range(n) });
        return st;
      }
    },
    merge: {
      desc: 'Divide por la mitad, ordena cada mitad recursivamente y las <b>fusiona</b> moviendo el menor de los dos primeros elementos. Siempre O(n log n).',
      worst: 'O(n log n)', best: 'O(n log n)', space: 'O(n)', stable: true,
      code: 'def merge_sort(lista):\n    if len(lista) <= 1:\n        return lista\n    medio = len(lista) // 2\n    izq = merge_sort(lista[:medio])\n    der = merge_sort(lista[medio:])\n    return merge(izq, der)\n\ndef merge(izq, der):\n    res = []\n    i = j = 0\n    while i < len(izq) and j < len(der):\n        if izq[i] <= der[j]:\n            res.append(izq[i]); i += 1\n        else:\n            res.append(der[j]); j += 1\n    res.extend(izq[i:])\n    res.extend(der[j:])\n    return res\n\n# En memoria (in place) tambien se puede hacer con un auxiliar de O(n).\n# Complejidad: SIEMPRE O(n log n), sin importar el peor caso.',
      gen: function (a0) {
        var a = a0.slice(), st = [], n = a.length;
        function merge(lo, mid, hi) {
          var L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1), res = [], li = 0, ri = 0;
          while (li < L.length && ri < R.length) {
            if (L[li] <= R[ri]) { res.push(L[li]); li++; } else { res.push(R[ri]); ri++; }
            st.push({ a: res.concat(a.slice(lo + res.length, hi + 1)).concat([]), lo: lo, hi: hi, msg: 'Fusionando [' + L.join(', ') + '] con [' + R.join(', ') + '] → sofar ' + res.join(', '), mergeRange: [lo, lo + res.length - 1] });
          }
          while (li < L.length) { res.push(L[li]); li++; }
          while (ri < R.length) { res.push(R[ri]); ri++; }
          for (var k = 0; k < res.length; k++) a[lo + k] = res[k];
          st.push({ a: a.slice(), lo: lo, hi: hi, msg: 'Tramo [' + lo + '…' + hi + '] fusionado → [' + res.join(', ') + ']', sorted: range(hi + 1) });
        }
        function ms(lo, hi) {
          if (lo >= hi) return;
          var mid = Math.floor((lo + hi) / 2);
          st.push({ a: a.slice(), lo: lo, hi: hi, msg: 'Dividir [' + lo + '…' + hi + '] por la mitad (medio = ' + mid + ')', depth: [] });
          ms(lo, mid); ms(mid + 1, hi); merge(lo, mid, hi);
        }
        ms(0, n - 1);
        st.push({ a: a.slice(), msg: 'Lista ordenada: [' + a.join(', ') + ']', sorted: range(n) });
        return st;
      }
    }
  };

  function range(from, to) { var r = []; for (var i = Math.max(0, from); i < to; i++) r.push(i); return r; }

  V.ordenamiento = function (mount, opts) {
    opts = opts || {};
    var base = opts.datos ? opts.datos.slice() : [42, 7, 19, 3, 25, 19, 61, 14, 8, 33];
    var data = base.slice();

    var stage = U.el('div', { class: 'viz-stage', style: 'align-items:flex-end;min-height:150px' });
    var bar = U.el('div', { class: 'viz-log' });
    var stats = U.el('div', { class: 'stats' });
    var codeBox = U.el('div');
    var desc = U.el('div', { class: 'viz-caption' });
    var inp = U.el('input', { type: 'text', placeholder: '5,3,8,1', style: 'width:150px' });

    var pasos = [], k = 0, timer = null, sel = null, vis = null;

    sel = U.el('select', { class: 'btn' });
    Object.keys(ALGOS).forEach(function (k2) { sel.appendChild(U.el('option', { value: k2, text: k2[0].toUpperCase() + k2.slice(1) })); });
    vis = sel;

    function refreshMeta() {
      var A = ALGOS[vis.value];
      desc.innerHTML = A.desc;
      codeBox.innerHTML = '';
      codeBox.appendChild(U.code(A.code, 'python'));
      stats.innerHTML = '';
      stats.appendChild(U.el('div', { class: 'stat' }, [U.el('div', { class: 'v', text: A.best }), U.el('div', { class: 'k', text: 'mejor caso' })]));
      stats.appendChild(U.el('div', { class: 'stat' }, [U.el('div', { class: 'v', text: A.worst }), U.el('div', { class: 'k', text: 'peor caso' })]));
      stats.appendChild(U.el('div', { class: 'stat' }, [U.el('div', { class: 'v', text: A.space }), U.el('div', { class: 'k', text: 'memoria extra' })]));
      stats.appendChild(U.el('div', { class: 'stat' }, [U.el('div', { class: 'v', text: A.stable ? 'Sí' : 'No' }), U.el('div', { class: 'k', text: 'es estable' })]));
    }

    function draw(p) {
      stage.innerHTML = '';
      var a = p.a, max = Math.max.apply(null, a.concat([1]));
      var row = U.el('div', { class: 'sbars' });
      a.forEach(function (v, i) {
        var cls = 'sbar';
        if (p.sorted && p.sorted.indexOf(i) >= 0) cls += ' sorted';
        if (p.i === i) cls += ' i';
        if (p.j === i) cls += ' j';
        if (p.k === i) cls += ' k';
        if (p.pivot === i) cls += ' pivot';
        if (p.mergeRange && i >= p.mergeRange[0] && i <= p.mergeRange[1]) cls += ' merge';
        row.appendChild(U.el('div', { class: cls, style: 'height:' + Math.max(6, Math.round((v / max) * 100)) + '%' }, [
          U.el('span', { class: 'sbar-lbl', text: String(v) })
        ]));
      });
      stage.appendChild(row);
      bar.textContent = p.msg || 'Presioná ▶ para ver el paso a paso.';
    }

    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function go() {
      stop();
      var A = ALGOS[vis.value];
      pasos = A.gen(data);
      k = 0;
      draw(pasos[0]);
      bar.textContent = pasos[0].msg;
      var p = pasos[0];
      k = 1;
      timer = setInterval(function () {
        if (k >= pasos.length) { stop(); bar.textContent = '✓ ' + ALGOS[vis.value] + ' terminó: [' + data.slice().sort(function (x, y) { return x - y; }).join(', ') + ']  (' + pasos.length + ' pasos)'; EDD.progress.setVizDone(opts.unit || 'u6', 'ordenamiento'); return; }
        draw(pasos[k]); bar.textContent = pasos[k].msg;
        k++;
      }, 320);
      EDD.progress.setVizDone(opts.unit || 'u6', 'ordenamiento');
    }
    function step() {
      stop();
      var A = ALGOS[vis.value];
      if (!pasos.length || k >= pasos.length) { pasos = A.gen(data); k = 0; }
      draw(pasos[k]); bar.textContent = pasos[k].msg;
      k++;
    }
    function reset() { stop(); pasos = []; k = 0; draw({ a: data.slice(), msg: 'Lista cargada. Presioná ▶ o ▸| para avanzar.' }); bar.textContent = 'Lista: [' + data.join(', ') + ']'; }

    function setData(txt) {
      var arr = txt.split(/[\s,]+/).filter(Boolean).map(Number);
      if (!arr.length || arr.some(function (x) { return isNaN(x); })) return U.toast('Ingresá números separados por coma', 'err');
      if (arr.length > 14) return U.toast('Máximo 14 elementos para que se vean bien', 'err');
      data = arr; reset();
    }

    vis.addEventListener('change', function () { refreshMeta(); reset(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') setData(inp.value); });

    mount.appendChild(U.el('div', { class: 'viz' }, [
      U.el('div', { class: 'viz-controls' }, [
        vis,
        U.el('button', { class: 'btn primary', text: '▶ Ejecutar', onclick: go }),
        U.el('button', { class: 'btn', text: '▸| Paso', onclick: step }),
        U.el('button', { class: 'btn', text: '■ Detener', onclick: function () { stop(); } }),
        U.el('button', { class: 'btn', text: '↺ Reiniciar', onclick: function () { reset(); } })
      ]),
      U.el('div', { class: 'viz-controls' }, [
        inp,
        U.el('button', { class: 'btn sm', text: 'Usar lista', onclick: function () { setData(inp.value); } }),
        U.el('button', { class: 'btn sm', text: 'Datos del ejemplo', onclick: function () { data = base.slice(); reset(); } }),
        U.el('button', { class: 'btn sm', text: 'Ordenada', onclick: function () { data = base.slice().sort(function (a, b) { return a - b; }); reset(); } }),
        U.el('button', { class: 'btn sm', text: 'Invertida (peor caso)', onclick: function () { data = base.slice().sort(function (a, b) { return b - a; }); reset(); } })
      ]),
      desc, stats, stage, bar,
      codeBox,
      U.el('div', { class: 'viz-caption dim', html: 'Fijate en <b>cuántas comparaciones</b> hace cada uno con la misma lista: selección y burbujeo siempre hacen ~n²/2, quicksort y merge hacen ~n·log₂(n). Ese es el motivo de estudiar la <b>complejidad</b> (Unidad 6).' })
    ]));

    refreshMeta();
    reset();
    EDD.registerViz('ordenamiento');
  };

})(window.EDD);