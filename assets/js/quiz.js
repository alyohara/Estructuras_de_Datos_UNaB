/* ============================================================
   EDD — Motor de quizzes
   Tipos: mcq (1 correcta) · multi (varias) · tf (V/F) · fill (completar)
          code (salida esperada de un fragmento) · order (ordenar)
   ============================================================ */
(function (EDD) {
  'use strict';

  var U = EDD.util, P = EDD.progress;

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  /* ------------------------------------------------------------
     Constructor de pregunta. Campos:
       q    : { t: 'texto', html: 'html alterno', k: 'clave', tag: 'etiqueta' }
       type : mcq | multi | tf | fill | code | order
       opts : ["opción A", ...]        (mcq/multi)
       ans  : 0            (mcq, índice correcto)
             | [0,2]       (multi, índices correctos)
             | true|false  (tf)
             | ["respuesta1","alt1"]  (fill, acepta cualquiera; case-insensitive)
       exp  : 'explicación'  (html)
       code : 'código a mostrar' (para type code)
     ------------------------------------------------------------ */
  function normalize(p) {
    var q = { type: 'mcq', tag: null, ans: [], opts: [] };
    for (var k in p) q[k] = p[k];
    if (q.t) {
      /* Se escapa todo y después se dejan pasar sólo las etiquetas en línea
         permitidas, para que los datos puedan usar <code> y <b> sin que se
         escapen literalmente ni se pueda inyectar HTML arbitrario. */
      var INLINE = { code: 1, b: 1, strong: 1, i: 1, em: 1, u: 1, sub: 1, sup: 1, br: 1, small: 1 };
      q.html = U.esc(q.t)
        .replace(/&lt;(\/?)([a-zA-Z][a-zA-Z0-9]*)(\s[^&]*?)?&gt;/g, function (m, slash, tag, attrs) {
          return INLINE[tag.toLowerCase()] ? '<' + slash + tag + (attrs || '') + '>' : m;
        })
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }
    if (q.html && !q.t) q.html = q.html;
    if (!Array.isArray(q.ans)) q.ans = [q.ans];
    if (!Array.isArray(q.opts)) q.opts = q.opts ? [q.opts] : [];
    return q;
  }

  /* --------------------------- render --------------------------- */
  function renderQuestion(p, i, state, onAnswer) {
    var q = normalize(p);
    var multi = q.type === 'multi';
    var locked = false;                 /* bloqueo por PREGUNTA, no global */
    var box = U.el('div', { class: 'q', 'data-i': i });

    var head = U.el('div', { class: 'q-head' }, [
      U.el('div', { class: 'q-num', text: String(i + 1) }),
      U.el('div', { class: 'q-text', html: q.html + (q.tag ? '<span class="q-tag">' + U.esc(q.tag) + '</span>' : '') })
    ]);
    box.appendChild(head);

    /* Un fragmento de código puede acompañar a cualquier tipo de pregunta:
       se muestra siempre que venga, no sólo en las de type 'code'. */
    if (q.code) box.appendChild(U.code(q.code, 'python'));

    if (q.type === 'fill') {
      var inp = U.el('input', { type: 'text', class: 'btn', placeholder: 'Escribí tu respuesta…', disabled: locked ? true : null });
      inp.style.width = '100%';
      inp.style.textAlign = 'left';
      inp.style.fontWeight = '400';
      inp.style.fontFamily = 'var(--mono)';
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { commit(); } });
      function commit() {
        if (locked) return;
        var v = inp.value;
        var ok = q.ans.some(function (a) { return U.norm(a) === U.norm(v); });
        state.answers[i] = { v: v, ok: ok };
        onAnswer(state.answers[i], i);
        locked = true;
        inp.disabled = true;
        showExp(box, q, ok ? '¡Correcto!' : 'Incorrecto', ok);
        box.classList.add(ok ? 'correct' : 'incorrect');
        box.appendChild(U.el('div', { class: 'small mt-1', html: ok ? '' : 'Tu respuesta: <code>' + U.esc(v || '(vacío)') + '</code>' }));
      }
      box.appendChild(U.el('div', { class: 'flex' }, [
        inp, U.el('button', { class: 'btn primary', text: 'Verificar', onclick: commit })
      ]));
    }
    else if (q.type === 'code') {
      box.appendChild(U.el('p', { class: 'small muted', html: '¿Qué imprime o devuelve este código?' }));
      var sel = U.el('select', { class: 'btn', disabled: locked ? true : null });
      q.opts.forEach(function (o, oi) { sel.appendChild(U.el('option', { value: oi, text: o })); });
      sel.addEventListener('change', function () {
        if (locked) return;
        locked = true;
        sel.disabled = true;
        var ok = Number(sel.value) === Number(q.ans[0]);
        state.answers[i] = { v: sel.value, ok: ok };
        onAnswer(state.answers[i], i);
        showExp(box, q, ok ? '¡Correcto!' : 'Incorrecto', ok);
        box.classList.add(ok ? 'correct' : 'incorrect');
      });
      box.appendChild(U.el('div', { class: 'flex' }, sel));
    }
    else if (q.type === 'order') {
      // q.opts: items en orden correcto (de arriba hacia abajo)
      var sel2 = [];
      var order = U.shuffle(q.opts).map(function (t, ix) { return { t: t, real: ix }; });
      var wrap = U.el('div', { class: 'opts' });
      order.forEach(function (o, oi) {
        var b = U.el('button', { class: 'opt', 'data-multi': '1' }, [
          U.el('span', { class: 'marker', text: String(oi + 1) }), U.el('span', { html: o.t })
        ]);
        b.addEventListener('click', function () {
          if (locked) return;
          var i2 = sel2.indexOf(oi);
          if (i2 >= 0) sel2.splice(i2, 1); else sel2.push(oi);
          sel2.sort(function (a, b2) { return a - b2; });
          U.qsa('.opt', wrap).forEach(function (e, k) {
            e.classList.toggle('sel', sel2.indexOf(k) >= 0);
            e.firstChild.textContent = sel2.indexOf(k) >= 0 ? String(sel2.indexOf(k) + 1) : String(k + 1);
          });
          if (sel2.length === order.length) {
            locked = true;
            var ok = sel2.every(function (v, k) { return order[v].real === k; });
            state.answers[i] = { v: sel2.join(','), ok: ok };
            onAnswer(state.answers[i], i);
            U.qsa('.opt', wrap).forEach(function (e, k) {
              var correctHere = order[k].real === sel2.indexOf(k);
              e.classList.add(correctHere ? 'right' : 'wrong');
              e.disabled = true;
            });
            showExp(box, q, ok ? '¡Correcto!' : 'Incorrecto', ok);
            box.classList.add(ok ? 'correct' : 'incorrect');
          }
        });
        wrap.appendChild(b);
      });
      box.appendChild(U.el('p', { class: 'small muted', html: 'Hacé clic en el orden correcto, de primero a último.' }));
      box.appendChild(wrap);
    }
    else {
      // mcq / multi / tf
      var opts = q.type === 'tf' ? ['Verdadero', 'Falso'] : q.opts;
      var list = U.el('div', { class: 'opts' });
      var chosen = [];
      opts.forEach(function (o, oi) {
        var b = U.el('button', { class: 'opt', 'data-multi': multi ? '1' : null, 'data-oi': oi }, [
          U.el('span', { class: 'marker', text: multi ? '' : LETTERS[oi] }),
          U.el('span', { class: 'k', text: q.type === 'tf' ? (oi === 0 ? 'V' : 'F') : '' }),
          U.el('span', { html: o })
        ]);
        b.addEventListener('click', function () {
          if (locked) return;
          if (!multi) {
            locked = true;
            chosen = [oi];
            U.qsa('.opt', list).forEach(function (e) {
              e.disabled = true;
              var idx = Number(e.getAttribute('data-oi'));
              if (q.ans.map(Number).indexOf(idx) >= 0) e.classList.add('right');
              else if (idx === oi) e.classList.add('wrong');
            });
            var ok = q.ans.map(Number).indexOf(oi) >= 0;
            state.answers[i] = { v: oi, ok: ok };
            onAnswer(state.answers[i], i);
            showExp(box, q, ok ? '¡Correcto!' : 'Incorrecto', ok);
            box.classList.add(ok ? 'correct' : 'incorrect');
          } else {
            var ix = chosen.indexOf(oi);
            if (ix >= 0) chosen.splice(ix, 1); else chosen.push(oi);
            b.classList.toggle('sel', chosen.indexOf(oi) >= 0);
            if (chosen.length === q.ans.length) {
              locked = true;
              var sorted = chosen.slice().sort();
              var okM = sorted.every(function (v, k) { return v === q.ans.map(Number).slice().sort()[k]; });
              U.qsa('.opt', list).forEach(function (e) {
                e.disabled = true;
                var idx = Number(e.getAttribute('data-oi'));
                if (q.ans.map(Number).indexOf(idx) >= 0) e.classList.add('right');
                else if (chosen.indexOf(idx) >= 0) e.classList.add('wrong');
              });
              state.answers[i] = { v: chosen.join(','), ok: okM };
              onAnswer(state.answers[i], i);
              showExp(box, q, okM ? '¡Correcto!' : 'Incorrecto', okM);
              box.classList.add(okM ? 'correct' : 'incorrect');
            }
          }
        });
        list.appendChild(b);
      });
      box.appendChild(list);
      if (multi) box.appendChild(U.el('p', { class: 'tiny dim', text: 'Seleccioná ' + q.ans.length + ' opciones. Se verifica al completar.' }));
    }

    return box;
  }

  function showExp(box, q, verdict, ok) {
    var e = U.el('div', { class: 'q-exp' });
    e.appendChild(U.el('span', { class: 't', text: verdict }));
    if (!ok && q.ansText) {
      e.appendChild(U.el('div', { html: '<strong>Respuesta:</strong> ' + q.ansText }));
    }
    if (q.exp) e.appendChild(U.el('div', { html: q.exp }));
    box.appendChild(e);
    setTimeout(function () { e.scrollIntoView({ block: 'nearest' }); }, 40);
  }

  /* --------------------------- Quiz --------------------------- */
  /**
   * EDD.quiz.render(mountEl, spec)
   * spec = { id, titulo, desc, preguntas:[], n (opcional: cuántas tomar), shuffle }
   */
  EDD.quiz = {
    render: function (mount, spec) {
      P.load();
      var all = spec.preguntas || [];
      var n = spec.n || all.length;
/* Cuando se toma un subconjunto (un examen) se baraja, para que no
         sea memorizable. Cuando se usan todas, se respeta el orden en que
         estan escritas salvo que se pida shuffle:true. */
      var pool = n < all.length ? U.sample(all, n) : (spec.shuffle ? U.shuffle(all) : all.slice());

      var state = { answers: [], locked: false };
      var wrap = U.el('div', { class: 'quiz' });

      var prev = P.quiz(spec.id);
      var head = U.el('div', { class: 'quiz-head' }, [
        U.el('div', { class: 'flex' }, [
          U.el('span', { class: 'chip brand' }, [prev && prev.done ? U.el('span', { class: 'dot' }) : null, prev && prev.done ? 'Mejor: ' + prev.score + '/' + prev.total : 'Sin responder']),
          U.el('span', { class: 'chip', text: pool.length + ' preguntas' })
        ]),
        U.el('button', { class: 'btn sm', text: '↻ Reiniciar', onclick: function () { mount.innerHTML = ''; EDD.quiz.render(mount, spec); mount.scrollIntoView({ block: 'start' }); } })
      ]);
      wrap.appendChild(head);

      var prog = U.el('div', { class: 'quiz-progress', text: '0 / ' + pool.length + ' respondidas' });
      wrap.appendChild(prog);
      wrap.appendChild(U.el('div', { class: 'bar mb-2' }, U.el('i', { style: 'width:0%' })));

      var boxes = [];
      pool.forEach(function (p, i) {
        var b = renderQuestion(p, i, state, function () {
          var done = Object.keys(state.answers).length;
          prog.textContent = done + ' / ' + pool.length + ' respondidas';
          U.qs('.bar > i', wrap).style.width = (done / pool.length * 100) + '%';
          if (done === pool.length) showResult();
        });
        boxes.push(b);
        wrap.appendChild(b);
      });

      var resultBox = U.el('div');
      wrap.appendChild(resultBox);

      function showResult() {
        var score = 0;
        state.answers.forEach(function (a) { if (a && a.ok) score++; });
        var pct = Math.round(score / pool.length * 100);
        P.setQuiz(spec.id, score, pool.length);
        var grade = pct >= 80 ? 'ok' : pct >= 60 ? 'warn' : 'err';
        var msg = pct >= 80 ? '¡Excelente! Dominás el tema.'
          : pct >= 60 ? 'Bien. Revisá los errores y volvé a intentarlo.'
          : pct >= 40 ? 'Vas encaminado. Volvé a leer la teoría y reintentá.'
          : 'Conviene repasar la teoría antes de seguir.';
        resultBox.innerHTML = '';
        resultBox.appendChild(U.el('div', { class: 'quiz-result' }, [
          U.el('div', { class: 'score ' + grade, html: score + ' <small>/ ' + pool.length + ' · ' + pct + '%</small>' }),
          U.el('p', { class: 'muted', text: msg }),
          U.el('div', { class: 'btn-row', style: 'justify-content:center' }, [
            U.el('button', { class: 'btn primary', text: '↻ Reintentar con otras preguntas', onclick: function () { mount.innerHTML = ''; EDD.quiz.render(mount, spec); } })
          ])
        ]));
        // Marca los paneles con error para repasar
        U.qsa('.q.incorrect', wrap).forEach(function (e) { e.style.outline = '2px dashed var(--err)'; });
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      mount.appendChild(wrap);
      EDD.registerQuiz({ id: spec.id, total: pool.length });
      return wrap;
    },

    /** Versión "bancada": todas las preguntas, sin límite, para repasar. */
    renderAll: function (mount, spec) { return EDD.quiz.render(mount, Object.assign({ shuffle: false }, spec)); }
  };

  EDD.q = normalize;

})(window.EDD);