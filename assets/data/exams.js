/* ============================================================
   EDD — Exámenes LPC: parcial, recuperatorios y finales
   Cada examen: teoría (quiz) + ejercicios de código + stack opcional.
   ============================================================ */
(function (EDD) {
  'use strict';

  EDD.examenes = [
    {
      id: 'parcial-jueves', tipo: 'Parcial', titulo: '1º Parcial (jueves)',
      detalle: 'Unidades 1 a 3 · Programación en Python, POO, estructuras lineales y árboles binarios.',
      unidades: ['u1', 'u2', 'u3'], preguntas: 12, duracion: '90 minutos',
      topics: [
        'Tipos de datos, funciones y recursión',
        'Clases, encapsulamiento, properties e interfaces',
        'Listas enlazadas, pilas y colas',
        'BST: inserción, eliminación, recorridos y altura'
      ],
      stack: {
        titulo: 'Stack — Estructuras lineales',
        consigna: 'Modelá un **Turno de atención** con una clase `Turno` que use internamente una `Cola` de tu propia implementación (no `collections.deque`). Methods: `agregar(nombre)`, `proximo()`, `atender()`, `cantidad()`, `esta_vacio()`.',
        starter: 'class Cola:\n    def __init__(self):\n        self._items = []\n        self._inicio = 0\n\n    def enqueue(self, x):\n        """append + avanza _inicio si hace falta: O(1) amortizado"""\n        pass\n\n    def dequeue(self):\n        pass\n\n    def front(self):\n        pass\n\n    def is_empty(self):\n        pass\n\nclass Turno:\n    def __init__(self):\n        self.cola = Cola()\n    def agregar(self, nombre): pass\n    def proximo(self): pass\n    def atender(self): pass\n    def cantidad(self): pass\n    def esta_vacio(self): pass\n',
        solution: 'class Turno:\n    """Turno de atencion: FIFO, como una cola."""\n\n    def __init__(self):\n        self._personas = []\n\n    def agregar(self, nombre):\n        self._personas.append(nombre)\n\n    def atender(self):\n        if self.esta_vacio():\n            raise IndexError("no hay nadie en el turno")\n        return self._personas.pop(0)\n\n    def proximo(self):\n        if self.esta_vacio():\n            raise IndexError("no hay nadie en el turno")\n        return self._personas[0]\n\n    def cantidad(self):\n        return len(self._personas)\n\n    def esta_vacio(self):\n        return len(self._personas) == 0\n\n\nt = Turno()\nfor n in ["Ana", "Luis", "Sara"]:\n    t.agregar(n)\nprint(t.cantidad(), t.proximo(), t.atender(), t.cantidad())\n',
        solutionExp: '<p>Un turno es una cola: se atiende el primero que llegó. <code>atender()</code> saca con <code>pop(0)</code> y lanza <code>IndexError</code> si no hay nadie; <code>proximo()</code> mira sin sacar.</p>',
        tests: [
          { name: 'agregar 3 y atender 3 da el mismo orden', code: 't=Turno()\nfor n in ["Ana","Luis","Sara"]: t.agregar(n)\nassert [t.atender() for _ in range(3)]==["Ana","Luis","Sara"]' },
          { name: 'proximo no elimina', code: 't=Turno()\nt.agregar("Ana")\nassert t.proximo()=="Ana" and t.cantidad()==1' },
          { name: 'atender sobre turno vacío lanza IndexError', code: 't=Turno()\ntry:\n    t.atender()\n    assert False\nexcept IndexError:\n    pass' },
          { name: 'cantidad y esta_vacio son coherentes', code: 't=Turno()\nassert t.esta_vacio() and t.cantidad()==0\nt.agregar("X")\nassert not t.esta_vacio() and t.cantidad()==1' }
        ]
      }
    },
    {
      id: 'recuperatorio-jueves', tipo: 'Recuperatorio', titulo: 'Recuperatorio 1º Parcial (jueves)',
      detalle: 'Mismo contenido del 1º parcial, con contenidos equivalentes.',
      unidades: ['u1', 'u2', 'u3'], preguntas: 12, duracion: '90 minutos',
      topics: [
        'POO: properties, validaciones y __str__',
        'Costo de las operaciones lineales',
        'BST: recorridos y balance'
      ],
      stack: {
        titulo: 'Stack — BST mínima',
        consigna: 'Implementá una `BST` con `insertar`, `buscar`, `in_orden`, `altura` y `esta_balanceado`, todo recursivo.',
        starter: 'class Nodo:\n    def __init__(self, valor):\n        self.valor = valor\n        self.izq = self.der = None\n\nclass BST:\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor): pass\n    def buscar(self, valor): pass\n    def in_orden(self): pass\n    def altura(self): pass\n    def esta_balanceado(self): pass\n',
        solution: 'class Nodo:\n    def __init__(self, valor):\n        self.valor = valor\n        self.izq = None\n        self.der = None\n\n\nclass BST:\n    """Arbol binario de busqueda minimo."""\n\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor):\n        nuevo = Nodo(valor)\n        if self.raiz is None:\n            self.raiz = nuevo\n            return\n        actual = self.raiz\n        while True:\n            if valor < actual.valor:\n                if actual.izq is None:\n                    actual.izq = nuevo\n                    return\n                actual = actual.izq\n            else:\n                if actual.der is None:\n                    actual.der = nuevo\n                    return\n                actual = actual.der\n\n    def _in(self, n, acc):\n        if n is None:\n            return\n        self._in(n.izq, acc)\n        acc.append(n.valor)\n        self._in(n.der, acc)\n\n    def in_orden(self):\n        acc = []\n        self._in(self.raiz, acc)\n        return acc\n\n    def altura(self):\n        def h(n):\n            return 0 if n is None else 1 + max(h(n.izq), h(n.der))\n        return h(self.raiz)\n\n    def buscar(self, valor):\n        actual = self.raiz\n        while actual is not None:\n            if valor == actual.valor:\n                return True\n            actual = actual.izq if valor < actual.valor else actual.der\n        return False\n\n\na = BST()\nfor v in [50, 30, 70, 20, 40]:\n    a.insertar(v)\nprint(a.in_orden(), a.altura())\n',
        solutionExp: '<p>Con el árbol balanceado, <code>buscar</code> descarta la mitad del árbol en cada paso, así que es <b>O(log n)</b>. El recorrido <code>in_orden</code> devuelve los valores ya ordenados de menor a mayor.</p>',
        tests: [
          { name: 'in_orden ordena los valores', code: 'a=BST()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.in_orden()==[20,30,40,50,70]' },
          { name: 'altura del ejemplo es 3', code: 'a=BST()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.altura()==3' },
          { name: 'buscar acierta y falla bien', code: 'a=BST()\nfor v in [8,3,10]: a.insertar(v)\nassert a.buscar(3) and not a.buscar(7)' }
        ]
      }
    },
    {
      id: 'recuperatorio-sabado', tipo: 'Recuperatorio', titulo: 'Recuperatorio 1º Parcial (sábado)',
      detalle: 'Alternate del recuperatorio del jueves, misma dificultad.',
      unidades: ['u1', 'u2', 'u3'], preguntas: 12, duracion: '90 minutos',
      topics: ['Funciones y recursión', 'Listas y pilas', 'Árboles binarios'],
      stack: {
        titulo: 'Stack — Pila de cadenas',
        consigna: 'Implementá una `Pila` con `apilar`, `desapilar`, `cima`, `es_vacia` y `tamano`. Devolver `None` (y no lanzar) cuando se desapila una pila vacía.',
        starter: 'class Pila:\n    def __init__(self):\n        self._items = []\n    def apilar(self, x): pass\n    def desapilar(self): pass\n    def cima(self): pass\n    def es_vacia(self): pass\n    def tamano(self): pass\n',
        solution: 'class Pila:\n    """Pila LIFO: el ultimo que entra es el primero que sale."""\n\n    def __init__(self):\n        self._items = []\n\n    def apilar(self, item):\n        self._items.append(item)\n\n    def desapilar(self):\n        if not self._items:\n            return None\n        return self._items.pop()\n\n    def cima(self):\n        if not self._items:\n            return None\n        return self._items[-1]\n\n    def tamano(self):\n        return len(self._items)\n\n    def esta_vacia(self):\n        return len(self._items) == 0\n\n\np = Pila()\nfor x in ["a", "b", "c"]:\n    p.apilar(x)\nprint(p.cima(), p.tamano(), p.desapilar(), p.desapilar())\n',
        solutionExp: '<p>La pila usa <code>append</code> y <code>pop</code> sobre el final de la lista, así que todas las operaciones son <b>O(1)</b>. <code>pop()</code> sobre lista vacía lanzaría <code>IndexError</code>; por eso primero se verifica y se devuelve <code>None</code>.</p>',
        tests: [
          { name: 'LIFO correcto', code: 'p=Pila()\nfor x in [1,2,3]: p.apilar(x)\nassert [p.desapilar() for _ in range(3)]==[3,2,1]' },
          { name: 'cima no desapila', code: 'p=Pila()\np.apilar("a")\nassert p.cima()=="a" and p.tamano()==1' },
          { name: 'desapilar vacía devuelve None', code: 'assert Pila().desapilar() is None' }
        ]
      }
    },
    {
      id: 'final-ed', tipo: 'Final', titulo: 'Final — Estructuras de Datos',
      detalle: 'Unidades 1 a 7 · Todos los contenidos, con heavier peso en grafos y heaps.',
      unidades: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'], preguntas: 20, duracion: '120 minutos',
      topics: [
        'Análisis de algoritmos y complejidad',
        'Colas de prioridad y montículos',
        'Grafos: DFS, BFS y Dijkstra',
        'Repaso integral de las 7 unidades'
      ],
      stack: {
        titulo: 'Stack — Dijkstra sobre lista de adyacencia',
        consigna: 'Dada la lista de adyacencia ponderada `grafo = {1: [(2,2),(3,4)], 2: [(3,1),(4,7)], 3: [(5,3)], 4: [(5,1)], 5: []}`, implementá `dijkstra(grafo, origen)` usando `heapq` y devolvé el diccionario de distancias mínimas.',
        starter: 'import heapq\n\ngrafo = {1: [(2,2),(3,4)], 2: [(3,1),(4,7)], 3: [(5,3)], 4: [(5,1)], 5: []}\n\ndef dijkstra(grafo, origen):\n    dist = {v: float("inf") for v in grafo}\n    dist[origen] = 0\n    cola = [(0, origen)]\n    while cola:\n        pass\n    return dist\n',
        solution: 'import heapq\n\ngrafo = {1: [(2,2),(3,4)], 2: [(3,1),(4,7)], 3: [(5,3)], 4: [(5,1)], 5: []}\n\n\ndef dijkstra(grafo, origen):\n    """Distancias minimas desde origen, con heap de prioridad."""\n    dist = {v: float("inf") for v in grafo}\n    dist[origen] = 0\n    cola = [(0, origen)]\n    while cola:\n        d, v = heapq.heappop(cola)\n        if d > dist[v]:\n            continue\n        for w, peso in grafo.get(v, []):\n            nuevo = d + peso\n            if nuevo < dist[w]:\n                dist[w] = nuevo\n                heapq.heappush(cola, (nuevo, w))\n    return dist\n\n\nprint(dijkstra(grafo, 1))\n',
        solutionExp: '<p>El <code>if d &gt; dist[v]: continue</code> descarta entradas viejas del heap: es la <i>lazy deletion</i>, necesaria para que Dijkstra funcione en <b>O((V+E) log V)</b>. El nodo 5 queda en 6 y no en 7 porque el camino 1→2→3→5 es más barato que ir directo.</p>',
        tests: [
          { name: 'distancia al nodo 3 es 3', code: 'assert dijkstra(grafo,1)[3]==3' },
          { name: 'distancia al nodo 5 es 6', code: 'assert dijkstra(grafo,1)[5]==6' },
          { name: 'distancia al nodo 4 es 9', code: 'assert dijkstra(grafo,1)[4]==9' },
          { name: 'el origen queda en 0', code: 'assert dijkstra(grafo,1)[1]==0' }
        ]
      }
    },
    {
      id: 'final-ayed', tipo: 'Final', titulo: 'Final — Análisis y Estructuras de Datos',
      detalle: 'Unidades 1 a 7 · Variante de AyED, foco en complejidad y estructuras no lineales.',
      unidades: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'], preguntas: 20, duracion: '120 minutos',
      topics: [
        'Complejidad: casos y notación asintótica',
        'Árboles binarios y generales',
        'Heaps y grafos',
        'Comparación de estructuras'
      ],
      stack: {
        titulo: 'Stack — MaxHeap y su costo',
        consigna: 'Implementá un `MaxHeap` sin `heapq` y una función `costo_insertar(n)` que devuelva la cantidad total de comparaciones al insertar n valores en orden creciente.',
        starter: 'class MaxHeap:\n    def __init__(self):\n        self.datos = []\n    def _arriba(self, i): pass\n    def insertar(self, valor):\n        self.datos.append(valor)\n        self._arriba(len(self.datos) - 1)\n\ndef costo_insertar(n):\n    """Comparaciones totales al insertar 1..n en un MaxHeap"""\n    pass\n',
        solution: 'import math\n\n\nclass MaxHeap:\n    """MaxHeap implementado a mano, sin heapq."""\n\n    def __init__(self):\n        self.datos = []\n        self.comparaciones = 0\n\n    def _subir(self, i):\n        while i > 0:\n            p = (i - 1) // 2\n            self.comparaciones += 1\n            if self.datos[p] >= self.datos[i]:\n                break\n            self.datos[p], self.datos[i] = self.datos[i], self.datos[p]\n            i = p\n\n    def insertar(self, valor):\n        self.datos.append(valor)\n        self._subir(len(self.datos) - 1)\n\n    def extraer_maximo(self):\n        if not self.datos:\n            return None\n        raiz = self.datos[0]\n        ultimo = self.datos.pop()\n        if self.datos:\n            self.datos[0] = ultimo\n            n = len(self.datos)\n            i = 0\n            while True:\n                izq, der, mayor = 2 * i + 1, 2 * i + 2, i\n                self.comparaciones += 2\n                if izq < n and self.datos[izq] > self.datos[mayor]:\n                    mayor = izq\n                if der < n and self.datos[der] > self.datos[mayor]:\n                    mayor = der\n                if mayor == i:\n                    break\n                self.datos[i], self.datos[mayor] = self.datos[mayor], self.datos[i]\n                i = mayor\n        return raiz\n\n    def eliminar(self, valor):\n        if valor not in self.datos:\n            return False\n        i = self.datos.index(valor)\n        self.datos[i] = self.datos[-1]\n        self.datos.pop()\n        if i < len(self.datos):\n            self._subir(i)\n        return True\n\n\ndef costo_insertar(n):\n    """Comparaciones al insertar 1..n en orden creciente.\n\n    Cada valor nuevo es el maximo, asi que sube toda la altura del arbol.\n    La altura al insertar el valor i es i.bit_length() = floor(log2 i) + 1.\n    Sumando para i = 1..n da Theta(n log n).\n    """\n    return sum(i.bit_length() for i in range(1, n + 1))\n\n\nh = MaxHeap()\nfor v in range(1, 9):\n    h.insertar(v)\nprint(h.datos, h.comparaciones, costo_insertar(8))\n',
        solutionExp: '<p>Insertar en un MaxHeap es <b>O(log n)</b> porque el valor nuevo sube como máximo la altura del árbol, y la altura de un montículo con n elementos es <code>floor(log2 n) + 1</code>. Al insertar en orden creciente cada valor llega hasta la raíz, que es el peor caso: <code>costo_insertar(n)</code> es <b>Theta(n log n)</b>.</p>',
        tests: [
          { name: 'la raíz es el máximo', code: 'h=MaxHeap()\nfor v in [10,20,5]: h.insertar(v)\nassert h.datos[0]==20' },
          { name: 'insertar 1..8 no explota', code: 'h=MaxHeap()\nfor v in range(1,9): h.insertar(v)\nassert h.datos[0]==8 and len(h.datos)==8' },
          { name: 'costo_insertar(8) es un entero positivo', code: 'c=costo_insertar(8)\nassert isinstance(c,int) and c>0' }
        ]
      }
    }
  ];

  EDD.examenById = function (id) {
    for (var i = 0; i < EDD.examenes.length; i++) if (EDD.examenes[i].id === id) return EDD.examenes[i];
    return null;
  };

})(window.EDD);