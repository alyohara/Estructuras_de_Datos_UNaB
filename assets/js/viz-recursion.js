/* ============================================================
   EDD — Trazador de recursión
   Muestra la pila de llamadas, el caso base y el valor devuelto.
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util;
  var V = EDD.viz = EDD.viz || {};

  /* Cada función es unSmall modelo declarativo: recibe n y devuelve
     { casoBase: bool, nuevoN: number, ret: valor, etiqueta } */
  var MODELOS = {
    factorial: {
      nombre: 'factorial(n)',
      desc: 'Caso base en n == 0 (o n == 1). Multiplica por el resultado de la llamada recursiva con n−1.',
      init: 'factorial',
      code: 'def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\nprint(factorial(5))   # 120 = 1*2*3*4*5',
      n: 5,
      f: function (n) {
        return { base: n === 0 || n === 1, child: n - 1, label: 'n=' + n, ret: n <= 1 ? 1 : null };
      }
    },
    fibonacci: {
      nombre: 'fibonacci(n)',
      desc: 'Dos llamadas recursivas por paso. Caso base en n == 0 y n == 1. Es O(2ⁿ) porque recalcula lo mismo muchas veces.',
      code: 'def fibonacci(n):\n    if n == 0 or n == 1:\n        return n\n    else:\n        return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10))   # 55',
      n: 10,
      f: function (n) { return { base: n <= 1, child: n - 1, extra: n - 2, label: 'n=' + n, ret: n <= 1 ? n : null }; }
    },
    triangulares: {
      nombre: 'triangulares(t)',
      desc: 'Suma acumulada: 1 + 2 + 3 + … + t. Caso base t == 0.',
      code: 'def triangulares(t):\n    if t == 0:\n        return 0\n    return t + triangulares(t - 1)\n\nprint(triangulares(6))   # 21',
      n: 6,
      f: function (n) { return { base: n === 0, child: n - 1, label: 't=' + n, ret: n === 0 ? 0 : null }; }
    },
    sucesivo: {
      nombre: 'funcion_sucesivo(n)',
      desc: 'Recursión que IMPRIME en vez de devolver. Caso base n > 10: no imprime nada.',
      code: 'def funcion_sucesivo(n):\n    if n > 10:\n        return\n    print(n, end=", ")\n    funcion_sucesivo(n + 1)\n\nfuncion_sucesivo(6)   # 6, 7, 8, 9, 10,',
      n: 6,
      f: function (n) { return { base: n > 10, child: n + 1, label: 'n=' + n, ret: null, imprime: n <= 10 ? n : null }; }
    },
    capicua: {
      nombre: 'es_capicua_recursivo(numero)',
      desc: 'Compara el número (tratado como string) con su reverso, quitando los extremos y recurriendo sobre el medio.',
      code: 'def es_capicua_recursivo(numero):\n    numero = str(numero)\n    if len(numero) <= 1:\n        return True\n    if numero[0] != numero[-1]:\n        return False\n    return es_capicua_recursivo(numero[1:-1])\n\nprint(es_capicua_recursivo(21512))   # True',
      n: 21512,
      f: function (s) {
        s = String(s);
        return { base: s.length <= 1, child: s.slice(1, -1), label: '"' + s + '"', ret: s.length <= 1 ? true : null };
      }
    },
    serie: {
      nombre: 'serie(n) = 1 + 1/2 + 1/3 + … + 1/n',
      desc: 'Serie armónica. Caso base n == 1.',
      code: 'def serie(n):\n    if n == 1:\n        return 1.0\n    return 1/n + serie(n - 1)\n\nprint(round(serie(5), 4))   # 2.2833',
      n: 5,
      f: function (n) { return { base: n === 1, child: n - 1, label: 'n=' + n, ret: n === 1 ? 1.0 : null }; }
    },
    mcd: {
      nombre: 'mcd(a, b) — algoritmo de Euclides',
      desc: 'El algoritmo más famoso de recursión. El caso base es b == 0.',
      code: 'def mcd(a, b):\n    if b == 0:\n        return a\n    return mcd(b, a % b)\n\nprint(mcd(48, 18))   # 6',
      n: 48,
      extra: 18,
      f: function (a, b) { return { base: b === 0, child: b, extra: a % b, label: 'mcd(' + a + ', ' + b + ')', ret: b === 0 ? a : null }; }
    },
    hanoi: {
      nombre: 'hanoi(n, origen, auxiliar, destino)',
      desc: 'Torres de Hanói. El caso base es n == 0 (no hay nada que mover).',
      code: 'def hanoi(n, o, a, d):\n    if n == 0:\n        return\n    hanoi(n - 1, o, d, a)\n    print("mover", n, "de", o, "a", d)\n    hanoi(n - 1, a, o, d)\n\nhanoi(3, "A", "B", "C")',
      n: 3,
      f: function (n) { return { base: n === 0, child: n - 1, label: 'hanoi(' + n + ')', ret: null }; }
    }
  };

  V.recursividad = function (mount, opts) {
    opts = opts || {};
    var sel = U.el('select', { class: 'btn' });
    Object.keys(MODELOS).forEach(function (k) { sel.appendChild(U.el('option', { value: k, text: MODELOS[k].nombre })); });

    var nIn = U.el('input', { type: 'text', value: '5', style: 'width:90px' });
    var stage = U.el('div', { class: 'viz-stage tree-stage', style: 'min-height:230px' });
    var traceBox = U.el('div', { class: 'viz-log', style: 'max-height:260px' });
    var desc = U.el('div', { class: 'viz-caption' });
    var codeBox = U.el('div');
    var out = U.el('div', { class: 'viz-log' });

    var modelo = MODELOS.factorial;
    var seq = 0, nodos = {};

    function reset() {
      seq = 0; nodos = {};
      traceBox.textContent = '';
      out.textContent = '';
    }

    function build(key, n) {
      reset();
      modelo = MODELOS[key];
      desc.innerHTML = modelo.desc;
      codeBox.innerHTML = '';
      codeBox.appendChild(U.code(modelo.code, 'python'));
      nIn.value = modelo.n;
      run();
    }

    function run() {
      reset();
      var key = sel.value;
      modelo = MODELOS[key];
      var arg = key === 'capicua' ? nIn.value.trim() : parseInt(nIn.value, 10);
      if (isNaN(arg)) { U.toast('Ingresá un número válido', 'err'); return; }
      if (key === 'capicua' && !/^-?\d+$/.test(String(arg))) { U.toast('Para capicúa ingresá sólo dígitos', 'err'); return; }
      if (key === 'mcd') {
        var b = parseInt(modelo.extra, 10);
        // mcd muestra dos argumentos: usar n y n-18 como aproximacion
        b = Math.max(1, Math.floor(arg / 3));
        execMCD(arg, b);
        return;
      }
      if (arg > 16) { U.toast('Usá un valor ≤ 16 para que no explote el navegador', 'err'); return; }
      if (key === 'fibonacci' && arg > 13) { U.toast('Fibonacci con n > 13 tarda demasiado. Usá n ≤ 13.', 'err'); return; }

      var raiz = { id: ++seq, label: modelo.f(arg, modelo.extra).label, depth: 0, parent: null, kids: [], ret: null, st: 'call', n: arg };
      nodos[raiz.id] = raiz;
      var lines = [];
      var t0 = performance.now();

      (function step(node) {
        node.st = 'call';
        draw();
        push(lines, node, 'call');
        traceBox.textContent = lines.join('\n');
        var info = modelo.f(node.n, modelo.extra);
        if (info.base) {
          node.st = 'base';
          node.ret = info.ret;
          setTimeout(function () {
            push(lines, node, 'base', info.ret);
            traceBox.textContent = lines.join('\n');
            draw();
            up(node);
          }, 420);
        } else {
          node.st = 'run';
          var a = node.kids[0] || { id: ++seq, kids: [], ret: null, st: 'call', depth: node.depth + 1, side: 0 };
          a.parent = node; a.n = info.child; a.depth = node.depth + 1; a.side = 0;
          a.label = modelo.f(a.n, modelo.extra).label;
          node.kids[0] = a; nodos[a.id] = a;
          setTimeout(function () { step(a); }, 470);
        }
      })(raiz);

      /* Sube desde un nodo ya resuelto hacia su padre. Si el modelo define una
         segunda llamada recursiva (info.extra, p. ej. fibonacci(n-2)), se
         dispara recién cuando terminó la primera: así se ve el árbol binario
         completo y no una cadena lineal. */
      function up(node) {
        if (!node.parent) {
          out.textContent = 'Resultado: ' + (node.ret === null ? 'la función no devuelve nada, solo imprime' : node.ret);
          out.textContent += '\nLlamadas totales: ' + seq + '   ·   Profundidad máxima: ' + maxDepth(raiz) + '   ·   ' + (performance.now() - t0).toFixed(0) + ' ms';
          if (node.doble) {
            out.textContent += '\nOjo: ' + seq + ' llamadas para un problema que se resuelve con ' +
              (modelo.extra ? 'memoización O(n)' : 'un bucle O(n)') + '. Por eso la recursión ingenua es O(2ⁿ).';
          }
          draw();
          EDD.progress.setVizDone(opts.unit || 'u1', 'recursividad');
          return;
        }
        var p = node.parent;
        var info = modelo.f(p.n, modelo.extra);
        var dosLlamadas = info.extra !== undefined && info.extra !== null;

        if (dosLlamadas && node.side === 0 && !p.kids[1]) {
          var b = { id: ++seq, kids: [], ret: null, st: 'call', parent: p, n: info.extra, depth: p.depth + 1, side: 1 };
          b.label = modelo.f(b.n, modelo.extra).label;
          p.kids[1] = b; nodos[b.id] = b;
          p.doble = true;
          lines.push('    '.repeat(p.depth) + '⇢ segunda llamada recursiva: ' + b.label);
          traceBox.textContent = lines.join('\n');
          draw();
          setTimeout(function () { step(b); }, 470);
          return;
        }

        p.ret = dosLlamadas
          ? (p.kids[0].ret || 0) + (p.kids[1].ret || 0)
          : calc(p, node, node.ret);
        p.st = 'done';
        push(lines, p, 'ret', p.ret);
        traceBox.textContent = lines.join('\n');
        draw();
        setTimeout(function () { up(p); }, 300);
      }
      function calc(p, node, v) {
        var m = modelo.f(p.n, modelo.extra);
        if (modelo === MODELOS.factorial) return p.n * v;
        if (modelo === MODELOS.triangulares) return p.n + v;
        if (modelo === MODELOS.serie) return 1 / p.n + v;
        if (modelo === MODELOS.capicua) return String(p.n)[0] === String(p.n).slice(-1) ? v : false;
        return v;
      }
    }

    function execMCD(a, b) {
      reset();
      modelo = MODELOS.mcd;
      nIn.value = a;
      desc.innerHTML = modelo.desc;
      codeBox.innerHTML = '';
      codeBox.appendChild(U.code('def mcd(a, b):\n    if b == 0:\n        return a\n    return mcd(b, a % b)\n\nprint(mcd(' + a + ', ' + b + '))   # ' + mcdJS(a, b), 'python'));
      var raiz = { id: ++seq, label: 'mcd(' + a + ', ' + b + ')', depth: 0, parent: null, kids: [], ret: null, st: 'call', n: a, m: b };
      nodos[raiz.id] = raiz;
      var lines = [];
      (function step(node) {
        node.st = 'call';
        push(lines, node, 'call');
        traceBox.textContent = lines.join('\n');
        draw();
        if (node.m === 0) {
          node.st = 'base'; node.ret = node.n;
          setTimeout(function () {
            push(lines, node, 'base', node.n);
            traceBox.textContent = lines.join('\n');
            up(node);
          }, 420);
        } else {
          node.st = 'run';
          var c = { id: ++seq, label: 'mcd(' + node.m + ', ' + (node.n % node.m) + ')', depth: node.depth + 1, parent: node, kids: [], n: node.m, m: node.n % node.m, st: 'call' };
          node.kids[0] = c; nodos[c.id] = c;
          setTimeout(function () { step(c); }, 470);
        }
      })(raiz);
      function up(node) {
        if (!node.parent) {
          out.textContent = 'Resultado: mcd(' + a + ', ' + b + ') = ' + node.ret + '\nLlamadas: ' + seq;
          draw();
          EDD.progress.setVizDone(opts.unit || 'u1', 'recursividad');
          return;
        }
        var p = node.parent;
        p.ret = node.ret; p.st = 'done';
        push(lines, p, 'ret', p.ret);
        traceBox.textContent = lines.join('\n');
        draw();
        setTimeout(function () { up(p); }, 280);
      }
    }

    function push(lines, node, kind, val) {
      var ind = '    '.repeat(node.depth);
      if (kind === 'call') lines.push(ind + '↓ ' + node.label + (node.depth === 0 ? '' : '   (llamada recursiva, pila +1)'));
      else if (kind === 'base') lines.push(ind + '★ CASO BASE → devuelve ' + val);
      else lines.push(ind + '↑ ' + node.label + ' devuelve ' + val);
      var t = lines[lines.length - 1];
      if (lines.length > 1) lines[lines.length - 2] = lines[lines.length - 2];
    }

    function maxDepth(n) { if (!n) return 0; return 1 + Math.max(maxDepth(n.kids[0]), n.kids.length > 1 ? maxDepth(n.kids[1]) : 0); }
    function mcdJS(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

    function draw() {
      stage.innerHTML = '';
      var all = Object.keys(nodos).map(function (k) { return nodos[k]; });
      if (!all.length) return;
      var maxd = Math.max.apply(null, all.map(function (n) { return n.depth; }));
      // layout horizontal en zigzag, como pila de llamadas
      var colW = 118, rowH = 60, padX = 30, padY = 30;
      var byDepth = {};
      all.forEach(function (n) { (byDepth[n.depth] = byDepth[n.depth] || []).push(n); });
      var maxW = Math.max.apply(null, Object.keys(byDepth).map(function (d) { return byDepth[d].length; }));
      var W = padX * 2 + maxW * colW, H = padY * 2 + (maxd + 1) * rowH;
      var SVGNS = 'http://www.w3.org/2000/svg';
      function svg(t, a) { var e = document.createElementNS(SVGNS, t); Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H });
      all.forEach(function (n) {
        var arr = byDepth[n.depth], i = arr.indexOf(n);
        n._x = W / 2 + (i - (arr.length - 1) / 2) * colW;
        n._y = padY + n.depth * rowH;
      });
      all.forEach(function (n) {
        var p = nodos[n.parent];
        if (!p) return;
        s.appendChild(svg('line', { x1: p._x, y1: p._y, x2: n._x, y2: n._y, class: 'tree-edge' + (n.st === 'call' ? ' hl' : '') }));
      });
      all.forEach(function (n) {
        var col = n.st === 'base' ? 'var(--accent)' : n.st === 'done' ? 'var(--ok)' : n.st === 'call' ? 'var(--brand)' : 'var(--fg-dim)';
        var g = svg('g', { class: 'tree-node' + (n.st === 'call' ? ' hl' : n.st === 'base' ? ' inpath' : n.st === 'done' ? ' visited' : '') });
        g.appendChild(svg('circle', { cx: n._x, cy: n._y, r: 30, fill: 'var(--bg-card)', stroke: col, 'stroke-width': 2.5 }));
        var t = svg('text', { x: n._x, y: n._y, style: 'font:700 12px var(--mono);fill:var(--fg)' });
        t.textContent = n.label.replace('mcd', '');
        g.appendChild(t);
        if (n.ret !== null && n.ret !== undefined) {
          var r = svg('text', { x: n._x, y: n._y + 43, style: 'font:700 11px var(--mono);fill:var(--ok);text-anchor:middle' });
          r.textContent = '= ' + n.ret;
          g.appendChild(r);
        }
        s.appendChild(g);
      });
      stage.appendChild(s);
    }

    sel.addEventListener('change', function () { build(sel.value, nIn.value); });
    nIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });

    mount.appendChild(U.el('div', { class: 'viz' }, [
      U.el('div', { class: 'viz-controls' }, [
        sel, nIn,
        U.el('button', { class: 'btn primary', text: '▶ Trazar', onclick: run }),
        U.el('button', { class: 'btn', text: 'Cargar ejemplo', onclick: function () { build(sel.value, null); } })
      ]),
      desc,
      stage,
      U.el('div', { class: 'grid grid-2 mt-1' }, [
        U.el('div', null, [U.el('h4', { text: 'Traza de llamadas' }), traceBox]),
        U.el('div', null, [U.el('h4', { text: 'Código' }), codeBox])
      ]),
      out,
      U.el('div', { class: 'viz-caption dim', html: 'Leé la traza de abajo hacia arriba. Cada <b>↓</b> es una llamada que se apila; cada <b>★</b> es un caso base que empieza a devolver; cada <b>↑</b> es el retorno que se desapila. Sin <b>caso base</b> la recursión no termina: es <b>desbordamiento de pila</b> (<code>RecursionError</code>).' })
    ]));
    EDD.registerViz('recursividad');
    build('factorial', 5);
  };

})(window.EDD);