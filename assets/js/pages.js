/* ============================================================
   EDD — Constructores de páginas (unidad, TP, exámenes, descargas)
   ============================================================ */
(function (EDD) {
  'use strict';
  var U = EDD.util, P = EDD.progress;

  function h(html) { var d = document.createElement('div'); d.innerHTML = html; return d; }
  function mountOf() { return U.qs('main') || document.body; }
  function vizSlot(key) { return U.qs('#vizslot-' + key); }

  /* Se construye el catálogo una sola vez, apenas están cargados los datos.
     Así el progreso global tiene denominador aunque la página actual no monte
     ningún quiz ni laboratorio (por ejemplo, el inicio). */
  var catalogDone = false;
  function ensureCatalog() {
    if (catalogDone) return;
    catalogDone = true;
    try { EDD.buildCatalog(); } catch (e) { console.error('[EDD] catálogo', e); }
  }

  /* ---------------- Página de inicio ---------------- */
  EDD.homePage = function () {
    var main = mountOf();
    main.innerHTML = '';
    ensureCatalog();
    P.load();

    main.appendChild(U.el('div', { class: 'eyebrow', text: 'UNAB' }));
    main.appendChild(U.el('h1', { text: 'Estructuras de Datos' }));
    main.appendChild(U.el('p', { class: 'lead', text: 'Recorré las ' + EDD.unidades.length + ' unidades con teoría, visualizadores animados, laboratorios de Python que corren en el navegador, los trabajos prácticos y los exámenes.' }));

    /* Acciones */
    main.appendChild(U.el('div', { class: 'btn-row' }, [
      U.el('a', { class: 'btn primary', href: U.link('u1/index.html'), text: 'Empezar por la Unidad 1 →' }),
      U.el('a', { class: 'btn', href: U.link('exams/index.html'), text: 'Practicar exámenes' }),
      U.el('button', { class: 'btn', text: '◔ Mi progreso', onclick: function () { EDD.shell.openProgressModal(); } })
    ]));

    /* Progreso */
var st = P.stats();
    var prog = U.el('div', { class: 'card', id: 'progreso' });
    prog.appendChild(U.el('h3', { html: '<span class="h-num">◔</span>Tu recorrido' }));
    prog.appendChild(U.el('div', { class: 'bar' }, U.el('i')));
    prog.appendChild(U.el('p', { class: 'small mt-1', id: 'prog-txt' }));
    main.appendChild(prog);

/* Tarjetas de unidades */
    var grid = U.el('div', { class: 'grid grid-units' });
    var bars = [];
    EDD.unidades.forEach(function (u) {
      var card = U.el('a', { class: 'card unit-card unit-' + u.num, href: U.link(u.id + '/index.html') }, [
        U.el('div', { class: 'flex between' }, [
          U.el('span', { class: 'unit-num', text: 'U' + u.num }),
          U.el('span', { class: 'chip', text: (u.viz || []).length + ' visualizador' + ((u.viz || []).length === 1 ? '' : 'es') })
        ]),
        U.el('h3', { class: 'mt-1', text: u.title }),
        U.el('p', { class: 'small', text: u.resumen }),
        U.el('div', { class: 'bar sm' }, U.el('i')),
        U.el('div', { class: 'tiny dim' })
      ]);
      bars.push({ id: u.id, fill: U.qs('.bar > i', card), txt: U.qs('.tiny.dim', card) });
      grid.appendChild(card);
    });
    main.appendChild(U.el('h2', { class: 'mt-3', text: 'Las ' + EDD.unidades.length + ' unidades' }));
    main.appendChild(grid);

    /* TP y exámenes */
    var grid2 = U.el('div', { class: 'grid grid-3' }, [
      U.el('a', { class: 'card', href: U.link('tp/index.html') }, [
        U.el('h3', { text: 'Trabajos prácticos' }),
        U.el('p', { class: 'small', text: 'TP 1 a TP 6 con enunciado, plantilla, solucionarios y tests automáticos en Python.' })
      ]),
      U.el('a', { class: 'card', href: U.link('exams/index.html') }, [
        U.el('h3', { text: 'Exámenes LPC' }),
        U.el('p', { class: 'small', text: 'Parciales, recuperatorios y finales: teoría autoevaluada y stack de código.' })
      ]),
      U.el('a', { class: 'card', href: U.link('downloads/index.html') }, [
        U.el('h3', { text: 'Descargas' }),
        U.el('p', { class: 'small', text: 'Clases, apuntes, exámenes con solucionario, código Python y notebooks.' })
      ])
    ]);
    main.appendChild(grid2);

    main.appendChild(U.el('div', { class: 'notice mt-3', html: location.protocol === 'file:'
      ? '<b>Nota:</b> los laboratorios de Python usan <a href="https://pyodide.org" target="_blank" rel="noopener">Pyodide</a> dentro del navegador. Para usarlos, serví la carpeta por HTTP (<code>python -m http.server 8000</code>) en lugar de abrir los archivos con doble clic. Tu código nunca sale de tu máquina.'
      : '<b>Nota:</b> los laboratorios de Python usan <a href="https://pyodide.org" target="_blank" rel="noopener">Pyodide</a> dentro del navegador. La primera vez se descarga el intérprete (~13 MB) y después queda en caché. Tu código nunca sale de tu máquina.' }));

EDD.shell.mount({});

    /* Un solo lugar que redibuja todas las barras y textos de progreso. */
    function refresh() {
      var s = P.stats();
      var pct = s.pct();
      var fill = U.qs('.bar > i', prog);
      if (fill) fill.style.width = pct + '%';
      U.qs('#prog-txt', prog).textContent = pct + '% completado · ' +
        s.quizzes + '/' + s.quizzesTotal + ' autoevaluaciones · ' +
        s.labs + '/' + (P.labTotalCount ? P.labTotalCount() : EDD.labTotal) + ' laboratorios con tests';
      bars.forEach(function (b) {
        var up = P.unitPct(b.id);
        if (b.fill) b.fill.style.width = up + '%';
        if (b.txt) b.txt.textContent = up + '% de la unidad';
      });
    }
    refresh();
    P.on(refresh);
  };

  /* ---------------- Visualizadores ---------------- */
EDD.montarVizzes = function () {
    var yaMontado = {};
    (EDD.unidades.reduce(function (a, u) { return a.concat(u.viz || []); }, [])).forEach(function (v) {
      /* Varias unidades comparten clave (p.ej. "ordenamiento" en U6 y U9,
         "grafo" en U7/U8/U10). Sin este filtro el visualizador se montaba
         una vez por unidad y se duplicaba dentro del mismo slot. */
      if (yaMontado[v.key]) return;
      yaMontado[v.key] = true;
var slot = vizSlot(v.key);
      if (!slot || !EDD.viz[v.key]) return;
      /* Idempotente: si la pagina se vuelve a renderizar (hashchange, refresco
         de la seccion) el visualizador no debe duplicarse dentro del slot. */
      if (slot.getAttribute('data-viz') === v.key) return;
      slot.setAttribute('data-viz', v.key);
      slot.innerHTML = '';
      var owner = EDD.unidades.filter(function (u) { return (u.viz || []).some(function (x) { return x.key === v.key; }); })[0];
      try { EDD.viz[v.key](slot, { unit: owner.id }); }
      catch (e) { slot.appendChild(U.el('p', { class: 'small', text: 'No se pudo montar el visualizador: ' + e.message })); console.error(e); }
    });
  };

  /* ---------------- Página de unidad ---------------- */
  EDD.unitPage = function (id) {
    var u = EDD.unitById(id);
    var main = mountOf();
    if (!u) { main.appendChild(U.el('h2', { text: 'Unidad no encontrada' })); return; }
    ensureCatalog();
    P.load();
    P.visitUnit(id);

    document.title = 'U' + u.num + ' — ' + u.title;
    var main2 = main;
    main2.innerHTML = '';

    var toc = [];
    main2.appendChild(U.el('div', { class: 'eyebrow', text: 'Unidad ' + u.num + ' de ' + EDD.unidades.length }));
    main2.appendChild(U.el('h1', { text: u.title }));
    main2.appendChild(U.el('p', { class: 'lead', text: u.resumen }));

    /* Objetivos */
    main2.appendChild(section('objetivos', '🎯', 'Qué vas a poder hacer', [
      U.el('ul', null, u.objetivos.map(function (o) { return U.el('li', { html: o }); })),
      U.el('div', { class: 'nav-units' }, navPrev(u), navNext(u))
    ]));

/* Teoría. `code` acepta un string (un bloque) o un array de bloques:
       los apuntes del docente traen varios ejemplos por sección. */
    var secs = u.secciones.map(function (s, i) {
      var box = U.el('div', { class: 'card', id: 'teoria-' + i });
      box.appendChild(U.el('h3', { html: '<span class="h-num">' + (i + 1) + '</span>' + s.h }));
      box.appendChild(h(s.html));
      var codes = s.code ? [].concat(s.code) : [];
      codes.forEach(function (c) { box.appendChild(U.code(c, 'python')); });
      toc.push({ id: 'teoria-' + i, label: s.h, group: 'Teoría' });
      return box;
    });
    main2.appendChild(U.el('h2', { class: 'sr', text: 'Teoría' }));
    var wrap = U.el('div', { class: 'stack', id: 'teoria' });
    secs.forEach(function (b) { wrap.appendChild(b); });
    main2.appendChild(wrap);

    /* Visualizadores */
    if (u.viz && u.viz.length) {
      main2.appendChild(U.el('h2', { class: 'mt-3', text: 'Visualizadores interactivos' }));
      u.viz.forEach(function (v) {
        var box = U.el('div', { class: 'card', id: 'viz-' + v.key });
        box.appendChild(U.el('h3', { html: '<span class="h-num">▶</span>' + v.label }));
        box.appendChild(U.el('div', { id: 'vizslot-' + v.key }));
        main2.appendChild(box);
      });
    }

    /* Laboratorios */
    if (u.labs && u.labs.length) {
      main2.appendChild(U.el('h2', { class: 'mt-3', text: 'Laboratorios de código' }));
      u.labs.forEach(function (l, i) { main2.appendChild(labCard(l, u.id, i)); });
    }

/* Quiz */
    var q = EDD.quizzes[id];
    if (q) {
      main2.appendChild(U.el('h2', { class: 'mt-3', text: 'Autoevaluación' }));
      var qbox = U.el('div', { class: 'card', id: 'quiz-' + id });
      main2.appendChild(qbox);
      toc.push({ id: 'quiz-' + id, label: 'Autoevaluación', group: 'Practicar' });
      EDD.quiz.render(qbox, { id: 'quiz-' + id, titulo: q.titulo, preguntas: q.preguntas });
    }

    /* Material */
    if (u.archivos && u.archivos.length) {
      main2.appendChild(U.el('h2', { class: 'mt-3', text: 'Material de la unidad' }));
      main2.appendChild(U.el('div', { class: 'grid grid-files' }, u.archivos.map(function (a) {
        return U.el('a', { class: 'file', href: U.link('downloads/') + a.f, download: '' }, [
          U.el('span', { class: 'ext', text: (a.f.split('.').pop() || '').toUpperCase() }),
          U.el('span', { text: a.t })
        ]);
      })));
    }

    main2.appendChild(U.el('div', { class: 'nav-units' }, navPrev(u), navNext(u)));
    EDD.shell.mount({ toc: toc });
    EDD.montarVizzes();
  };

  function section(id, icon, titulo, children) {
    var s = U.el('section', { class: 'card', id: id });
    if (icon) s.appendChild(U.el('h3', { html: '<span class="h-num">' + icon + '</span>' + titulo }));
    else s.appendChild(U.el('h3', { text: titulo }));
    (Array.isArray(children) ? children : [children]).forEach(function (c) { s.appendChild(c); });
    return s;
  }

  function navPrev(u) {
    var i = EDD.unidades.findIndex(function (x) { return x.id === u.id; });
    var p = EDD.unidades[i - 1];
    return p ? U.el('a', { class: 'btn', href: U.link(p.id + '/index.html'), text: '← ' + p.title }) : U.el('span');
  }
  function navNext(u) {
    var i = EDD.unidades.findIndex(function (x) { return x.id === u.id; });
    var n = EDD.unidades[i + 1];
    return n ? U.el('a', { class: 'btn primary', href: U.link(n.id + '/index.html'), text: n.title + ' →' })
             : U.el('a', { class: 'btn primary', href: U.link('tp/index.html'), text: 'Trabajos prácticos →' });
  }

  /* ---------------- Laboratorio con tests ---------------- */
  function labCard(l, unit, i) {
    var box = U.el('div', { class: 'card', id: 'lab-' + unit + '-' + i });
    box.appendChild(U.el('h3', { html: '<span class="h-num">⌨</span>' + l.title }));
    box.appendChild(U.el('p', { html: l.enunciado }));
    var slot = U.el('div', { id: 'labslot-' + unit + '-' + i });
    box.appendChild(slot);
    EDD.py.lab(slot, {
      id: 'lab-' + unit + '-' + i,
      titulo: l.title,
      starter: l.starter || '',
      setup: l.setup || '',
      input: l.input,
      inputLabel: l.inputLabel,
      tests: l.tests || [],
      solution: l.solution || '',
      solutionExp: l.solutionExp || '',
      hints: l.hints,
      unit: unit
    });
    return box;
  }

  /* ---------------- Página de TP ---------------- */
  EDD.tpPage = function () {
    var main = mountOf();
    main.innerHTML = '';
    ensureCatalog();
    P.load();
    document.title = 'Trabajos prácticos';
    main.appendChild(U.el('div', { class: 'eyebrow', text: 'Prácticas' }));
    main.appendChild(U.el('h1', { text: 'Trabajos prácticos' }));
    main.appendChild(U.el('p', { class: 'lead', text: 'Seis trabajos con enunciado, plantilla y tests automáticos que corren en el navegador con Python real.' }));

    main.appendChild(U.el('div', { class: 'notice', html: '<b>Cómo usar el laboratorio:</b> editás el código a la izquierda, tocás <b>▶ Ejecutar</b> para ver la salida y <b>▶ Correr tests</b> para comprobar los casos. El Python corre dentro de tu navegador (Pyodide): no se envía nada a ningún servidor.' }));

    var toc = [];
    EDD.tps.forEach(function (tp) {
      toc.push({ id: tp.id, label: 'TP ' + tp.num, group: 'Trabajos' });
      main.appendChild(U.el('h2', { class: 'mt-3', text: 'TP ' + tp.num + ' — ' + tp.titulo.replace(/^TP \d+ — /, '') }));
      var card = U.el('div', { class: 'card', id: tp.id });
      card.appendChild(U.el('p', { class: 'lead', text: tp.resumen }));
      card.appendChild(U.el('h4', { text: 'Enunciado' }));
      card.appendChild(U.el('p', { html: tp.enunciado }));
      card.appendChild(U.el('h4', { text: 'Consignas' }));
      card.appendChild(U.el('ol', null, tp.consignas.map(function (c) { return U.el('li', { html: c }); })));
      card.appendChild(U.el('h4', { text: 'Temas' }));
      card.appendChild(U.el('div', { class: 'chips' }, tp.temas.map(function (t) { return U.el('span', { class: 'chip', text: t }); })));
      if (tp.archivo) {
        card.appendChild(U.el('a', { class: 'btn mt-1', href: U.link('downloads/') + tp.archivo, text: '↓ ' + (tp.archivoTexto || 'Enunciado en PDF') }));
      }
      card.appendChild(U.el('h4', { class: 'mt-2', text: 'Laboratorio' }));
      var slot = U.el('div');
      card.appendChild(slot);
      main.appendChild(card);
      EDD.py.lab(slot, {
        id: tp.id,
        titulo: 'TP ' + tp.num,
        starter: tp.plantilla || '',
        setup: tp.setup || '',
        input: tp.input,
        inputLabel: tp.inputLabel,
        tests: tp.tests || [],
        solution: tp.solution || '',
        solutionExp: tp.solutionExp || '',
        unit: null
      });
    });
    EDD.shell.mount({ toc: toc });
  };

  /* ---------------- Página de exámenes ---------------- */
  EDD.examsPage = function (id) {
    var main = mountOf();
    main.innerHTML = '';
    ensureCatalog();
    P.load();
    if (!id) {
      document.title = 'Exámenes';
      main.appendChild(U.el('div', { class: 'eyebrow', text: 'LPC' }));
      main.appendChild(U.el('h1', { text: 'Exámenes' }));
      main.appendChild(U.el('p', { class: 'lead', text: 'Parciales, recuperatorios y finales: teoría para practicar y un stack de código con tests para autoevaluarte.' }));
      var toc = [];
      EDD.examenes.forEach(function (x) {
        toc.push({ id: x.id, label: x.titulo, group: x.tipo });
        var card = U.el('div', { class: 'card exam-card', id: x.id });
        card.appendChild(U.el('div', { class: 'flex between' }, [
          U.el('span', { class: 'chip ' + (x.tipo === 'Final' ? 'accent' : 'brand'), text: x.tipo }),
          U.el('span', { class: 'small dim', text: x.duracion + ' · ' + x.preguntas + ' preguntas' })
        ]));
        card.appendChild(U.el('h3', { class: 'mt-1', text: x.titulo }));
        card.appendChild(U.el('p', { text: x.detalle }));
        card.appendChild(U.el('div', { class: 'chips' }, x.unidades.map(function (u) {
          var un = EDD.unitById(u);
          return U.el('span', { class: 'chip', text: 'U' + un.num });
        })));
        card.appendChild(U.el('div', { class: 'btn-row' }, [
          U.el('a', { class: 'btn primary', href: U.link('exams/index.html') + '#' + x.id, text: 'Practicar teoría' }),
          U.el('a', { class: 'btn', href: U.link('exams/index.html') + '#' + x.id + '-stack', text: 'Resolver el stack' })
        ]));
        main.appendChild(card);
      });
      EDD.shell.mount({ toc: toc });
      return;
    }

    var x = EDD.examenById(id);
    if (!x) { main.appendChild(U.el('h2', { text: 'Examen no encontrado' })); return; }
    document.title = x.titulo;
    main.appendChild(U.el('a', { class: 'btn sm', href: U.link('exams/index.html'), text: '← Volver a exámenes' }));
    main.appendChild(U.el('h1', { text: x.titulo }));
    main.appendChild(U.el('p', { class: 'lead', text: x.detalle }));

    /* Teoría: se toman preguntas de las unidades del examen */
    var pool = [];
    x.unidades.forEach(function (uid) {
      var q = EDD.quizzes[uid];
      if (q) pool = pool.concat(q.preguntas);
    });
    var qcard = U.el('div', { class: 'card', id: 'teoria' });
    main.appendChild(U.el('h2', { text: 'Parte de teoría' }));
    main.appendChild(qcard);
EDD.quiz.render(qcard, { id: 'exam-teoria-' + x.id, titulo: x.titulo + ' — teoría', preguntas: pool, n: Math.min(x.preguntas, pool.length) });

    main.appendChild(U.el('h2', { class: 'mt-3', text: 'Stack de programación' }));
    main.appendChild(U.el('div', { class: 'card', id: x.id + '-stack' }, [
      U.el('h3', { html: '<span class="h-num">⌨</span>' + x.stack.titulo }),
      U.el('p', { html: x.stack.consigna })
    ]));
    var slot = U.el('div');
    main.appendChild(slot);
    EDD.py.lab(slot, {
      id: 'stack-' + x.id,
      titulo: x.stack.titulo,
      starter: x.stack.starter,
      setup: x.stack.setup,
      input: x.stack.input,
      inputLabel: x.stack.inputLabel,
      tests: x.stack.tests,
      solution: x.stack.solution || '',
      solutionExp: x.stack.solutionExp || '',
      unit: null
    });

    EDD.shell.mount({});
  };

  /* ---------------- Página de descargas ---------------- */
  EDD.downloadsPage = function () {
    var main = mountOf();
    main.innerHTML = '';
    ensureCatalog();
    P.load();
    document.title = 'Descargas';
    main.appendChild(U.el('div', { class: 'eyebrow', text: 'Material' }));
    main.appendChild(U.el('h1', { text: 'Descargas' }));
main.appendChild(U.el('p', { class: 'lead', text: 'Todo el material público de la cursada: clases, apuntes, exámenes con sus solucionarios, código y notebooks.' }));

    /* Cada grupo lista archivos reales de web/downloads. La extensión y la
       carpeta se deducen del nombre para no mantener dos listas que se
       desincronicen. */
    var grupos = [
      { t: 'Clases (presentaciones)', d: 'Slides de cada clase.', items: [
        'slides/intro_programacion_python.pdf', 'slides/clase01_encapsulamiento_interfaces.pdf',
        'slides/clase02_recursividad.pptx', 'slides/clase05_arboles_binarios.pdf',
        'slides/clase08_arboles_generales.pdf', 'slides/clase09_cola_prioridades.pptx',
        'slides/clase10_analisis_algoritmos.pptx', 'slides/clase11_grafos.pptx',
        'slides/clase12_algoritmos_recorrido.pdf', 'slides/clase13_ordenamiento.pdf',
        'slides/clase14_np_camino_minimo.pdf', 'slides/complejidad.pptx',
        'slides/programa_cursada.pdf'
      ]},
      { t: 'Apuntes', d: 'Apuntes de teoría y ejercicios en PDF.', items: [
        'apuntes/u1_apunte_clases.pdf', 'apuntes/u1_clase1_resumen.pdf',
        'apuntes/u2_listas_pilas_colas.pdf', 'apuntes/u2_arboles_y_grafos.pdf',
        'apuntes/u5_heap.pdf', 'apuntes/u6_complejidad_temporal.pdf',
        'apuntes/u7_grafos.pdf', 'apuntes/u7_dfs_bfs.pdf', 'apuntes/u7_dijkstra.pdf',
        'apuntes/u1_ejercicios_basicos.pdf', 'apuntes/u2_ejercicios.pdf',
        'apuntes/u2_tp4_resuelto.pdf'
      ]},
      { t: 'Exámenes y solucionarios', d: 'Parciales, recuperatorios, finales y sus soluciones.', items: [
        'examenes/parcial1_jueves.pdf', 'examenes/parcial1_jueves_con_estructuras.pdf',
        'examenes/recuperatorio1_jueves.pdf', 'examenes/recuperatorio1_sabado.pdf',
        'examenes/final_ed_diciembre2024.pdf', 'examenes/final_ed_diciembre2024_solucionario.pdf',
        'examenes/final_ayed_diciembre2024.pdf', 'examenes/final_ayed_diciembre2024_solucionario.pdf',
        'examenes/programa_catedra.pdf'
      ]},
      { t: 'Trabajos prácticos', d: 'Enunciados y soluciones.', items: [
        'slides/tp1_enunciado.pdf', 'slides/tp2_enunciado.pdf', 'slides/tp3_enunciado.pdf',
        'slides/tp5_enunciado.pdf', 'slides/tp6_enunciado.pdf', 'slides/tp3_resuelto.pdf',
        'slides/tp4_resuelto.pdf', 'tp/tp1_respuestas.pdf', 'tp/tp2_resuelto.pdf', 'tp/tp2_adicional_resuelto.pdf',
        'tp/ejercicios_basicos_resueltos.pdf',
        'tp/ejercicios_listas_resueltos.pdf', 'tp/tp_final_pautas.pdf'
      ]},
      { t: 'Código Python', d: 'Implementaciones de ejemplo de la cursada.', items: [
        'codigo/clase02.py', 'codigo/empleado_clase2.py', 'codigo/humano_clase2.py',
        'codigo/ejercicio_menuyfunciones.py', 'codigo/listaEnlazada.py', 'codigo/pila.py',
        'codigo/cola.py', 'codigo/arbol_binario.py', 'codigo/arboles.py',
        'codigo/tad_arbol.py', 'codigo/TAD_Arbol_General corregido.py',
        'codigo/tad_cola.py', 'codigo/grafo.py'
      ]},
      { t: 'Notebooks', d: 'Prácticas en Jupyter.', items: [
        'notebooks/Ejemplos_recursion.ipynb', 'notebooks/heap.ipynb',
        'notebooks/Practica_1.ipynb', 'notebooks/Practica_2.ipynb'
      ]},
      { t: 'Diagramas', d: 'Imágenes de referencia de la cursada.', items: [
        'imagenes/lista_enlazada.png', 'imagenes/lista_doble.png', 'imagenes/lista_circular.png',
        'imagenes/pila.png', 'imagenes/pila_telefono.png',
        'imagenes/cola.png', 'imagenes/cola_telefono.png',
        'imagenes/grafo.png', 'imagenes/grafo_telefono.png'
      ]}
    ];

    var n = 0;
    grupos.forEach(function (g) {
      main.appendChild(U.el('h2', { class: 'mt-3', text: g.t }));
      if (g.d) main.appendChild(U.el('p', { class: 'small dim', text: g.d }));
      var d = U.el('div', { class: 'grid grid-files' });
      g.items.forEach(function (f) {
        var partes = f.split('/');
        var nombre = partes.pop();
        var ext = (nombre.split('.').pop() || '').toUpperCase();
        n++;
        d.appendChild(U.el('a', { class: 'file', href: U.link('downloads/') + f, download: '' }, [
          U.el('span', { class: 'ext', text: ext }),
          U.el('span', {}, [
            U.el('span', { class: 'file-name', text: nombre }),
            U.el('span', { class: 'tiny dim', text: ' ' + partes.join(' / ') })
          ])
        ]));
      });
      main.appendChild(d);
    });
    main.appendChild(U.el('p', { class: 'small dim mt-3', text: n + ' archivos. Material de la cátedra, disponible para estudiar sin conexión.' }));
    EDD.shell.mount({});
  };

})(window.EDD);