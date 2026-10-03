/* ============================================================
   EDD — Datos de las 7 unidades: teoría, material, labs y visualizadores
   ============================================================ */
(function (EDD) {
  'use strict';

  EDD.unidades = [

  /* ============================ UNIDAD 1 ============================ */
  {
    id: 'u1', num: 1, icon: '◈', title: 'Introducción a la programación en Python',
    resumen: 'Cómo se escribe un programa en Python, cómo se encapsulan los datos en clases y qué es una interfaz.',
    objetivos: [
      'Distinguir los tipos de datos simples y compuestos de Python.',
      'Escribir clases con atributos, métodos, __init__ y su cadena de construcción.',
      'Aplicar encapsulamiento con properties y entender por qué las clases empiezan con mayúscula.',
      'Modelar un TAD (Tipo Abstracto de Datos) definiendo su interfaz y sus precondiciones.'
    ],
    secciones: [
      {
        h: 'Tipos de datos y estructuras básicas',
        html: '<p>Python es <b>dinámico</b> (el tipo se deduce en tiempo de ejecución) y <b>tipado por completo</b>: aunque una variable puede cambiar de tipo, lo recomendable es mantener un tipo coherente.</p>' +
          '<p>Los tipos simples son <code>int</code>, <code>float</code>, <code>str</code> y <code>bool</code>. Los compuestos incluyen <code>list</code>, <code>tuple</code>, <code>dict</code> y <code>set</code>.</p>' +
          '<ul><li><b>Lista</b>: mutable, ordenada, admite duplicados. <code>lista = [1, 2, 3]</code></li>' +
          '<li><b>Tupla</b>: inmutable, ordenada. Se usa para devolver varios valores: <code>return (minimo, maximo)</code></li>' +
          '<li><b>Conjunto</b>: sin orden ni duplicados. Ideal para verificar unicidad.</li></ul>',
        code: 'lista = [10, 20, 30]\ntupla = (1, "a", True)\nconjunto = {1, 2, 2, 3}   # {1, 2, 3}\ndiccionario = {"clave": 1, "otra": 2}\n\nfor i in range(3):\n    print(i, lista[i])\n\nfor idx, valor in enumerate(lista):\n    print(idx, valor)'
      },
      {
        h: 'Funciones: parámetros, retorno y alcance',
        html: '<p>Una función tiene <code>def nombre(parametros):</code> y devuelve con <code>return</code>. Si no hay <code>return</code>, devuelve <code>None</code>.</p>' +
          '<ul><li>Los objetos se pasan <b>por referencia</b>: si la función muta la lista, el llamador lo ve.</li>' +
          '<li>Los parámetros con valor por defecto seevalúan una sola vez (cuidado con las listas mutables como default).</li>' +
          '<li>El <b>alcance</b>: las variables locales desaparecen al terminar la función; las globales se leen, pero no se reasignan sin <code>global</code>.</li></ul>',
        code: 'def sumar(a, b=10):\n    return a + b\n\ndef poner_en_lista(mi_lista, valor):\n    mi_lista.append(valor)   # muta la lista original\n\ndef valor_por_defecto(l=[]):   # ¡ERROR clásico!\n    l.append(1)\n    return l\n\nprint(sumar(5))          # 15\nprint(valor_por_defecto(), valor_por_defecto())   # [1] [1, 1]'
      },
      {
        h: 'POO: clases, objetos y encapsulamiento',
        html: '<p>Una clase describe un <b>TAD</b>: los datos (atributos) y las operaciones (métodos) que se pueden hacer con ellos. Por convención las clases empiezan con <b>mayúscula</b>.</p>' +
          '<p>El <code>__init__</code> es el <b>constructor</b>. El <code>self</code> es el objeto mismo: <code>self.nombre</code> accede al atributo.</p>' +
          '<p>Con <code>self.__privado</code> (doble guión bajo) se marca un atributo <b>privado</b>, y se expone con una <b>property</b>:</p>',
        code: 'class Persona:\n    def __init__(self, nombre, edad):\n        self.__nombre = nombre       # privado\n        self.edad = edad             # público\n\n    @property\n    def nombre(self):\n        return self.__nombre\n\n    @nombre.setter\n    def nombre(self, valor):\n        if valor == "":\n            raise ValueError("El nombre no puede ser vacío")\n        self.__nombre = valor\n\n    def __str__(self):\n        return f"{self.nombre}, {self.edad} años"\n\np = Persona("Ana", 20)\np.nombre = "Ana L"\nprint(p)          # Ana L, 20 años\np.nombre = ""      # ValueError'
      },
      {
        h: 'Interfaces y TAD: contrato entre diseño e implementación',
        html: '<p>Un <b>TAD</b> es una especificación: qué datos guarda y qué operaciones ofrece, sin decir cómo están implementados. La <b>interfaz</b> es el contrato público.</p>' +
          '<p>Cuando el apunte dice "una lista enlazada es un TAD", está diciendo: <em>hay una interfaz (add, remove, is_empty…) y cualquier implementación que la cumpla sirve</em>. Por eso una lista puede ser un array de Python o una estructura con punteros sin cambiar el código del cliente.</p>' +
          '<p>La <b>precondición</b> es lo que el cliente garantiza al llamar; la <b>postcondición</b> es lo que la operación garantiza devolver.</p>',
        code: 'class Coleccion:              # la INTERFAZ (no la implementación)\n    def agregar(self, item): raise NotImplementedError\n    def quitar(self):          raise NotImplementedError\n    def esta_vacia(self):      raise NotImplementedError\n\nclass Pila(Coleccion):        # una implementación posible\n    def __init__(self):\n        self._items = []\n    def agregar(self, item):  self._items.append(item)\n    def quitar(self):\n        assert not self.esta_vacia(), "No se puede quitar de una pila vacía"\n        return self._items.pop()\n    def esta_vacia(self):     return len(self._items) == 0\n\n# Precondición: la pila NO está vacía. Postcondición: devuelve el último agregado.'
      }
    ],
    archivos: [
      { t: 'Clase 1 — Encapsulamiento e interfaces (PDF)', f: 'slides/clase01_encapsulamiento_interfaces.pdf' },
      { t: 'Programa de la cursada (PDF)', f: 'slides/programa_cursada.pdf' },
      { t: 'Introducción a la programación en Python (PDF)', f: 'slides/intro_programacion_python.pdf' },
      { t: 'Ejercicios de funciones y menus (Python)', f: 'codigo/ejercicio_menuyfunciones.py' }
    ],
    labs: [
      {
        title: 'Práctica 1 — funciones y la clase Empleado',
        enunciado: 'Escribí una función `resumen_empleado(e)` que reciba un diccionario u objeto con nombre, apellido, legajo y comisión, y devuelva una tupla `(legajo, nombre_completo, monto)`, donde el monto es el salario base (20000) más la comisión cobrada. Después guardá tres empleados en una lista y mostrarlos con un `for`.',
        starter: '# Práctica 1\n\ndef resumen_empleado(empleado):\n    """Devuelve (legajo, nombre_completo, monto)"""\n    # Tu código aquí\n    pass\n\nempleados = [\n    {"nombre": "Ana", "apellido": "Perez", "legajo": 2951, "comision": 1500},\n    {"nombre": "Luis", "apellido": "Gomez", "legajo": 2952, "comision": 900},\n]\n\nfor e in empleados:\n    print(resumen_empleado(e))\n',
        solution: '# Práctica 1 resuelta\n\ndef resumen_empleado(empleado):\n    """Devuelve (legajo, nombre_completo, monto)"""\n    nombre = empleado["nombre"] + " " + empleado["apellido"]\n    monto = 20000 + empleado.get("comision", 0)\n    return (empleado["legajo"], nombre, monto)\n\n\nempleados = [\n    {"nombre": "Ana", "apellido": "Perez", "legajo": 2951, "comision": 1500},\n    {"nombre": "Luis", "apellido": "Gomez", "legajo": 2952, "comision": 900},\n]\n\nfor e in empleados:\n    print(resumen_empleado(e))\n',
        solutionExp: '<p>La función devuelve una <b>tupla</b> con el legajo, el nombre completo concatenation con un espacio y el monto: el sueldo base de $20.000 más la comisión.</p>',
        tests: [
          { name: 'devuelve una tupla de 3 elementos', code: 'e={"nombre":"Ana","apellido":"Perez","legajo":1,"comision":0}\nr=resumen_empleado(e)\nassert isinstance(r,tuple) and len(r)==3' },
          { name: 'nombre completo junto', code: 'e={"nombre":"Ana","apellido":"Perez","legajo":1,"comision":0}\nassert resumen_empleado(e)[1]=="Ana Perez"' },
          { name: 'monto = 20000 + comisión', code: 'e={"nombre":"Ana","apellido":"Perez","legajo":1,"comision":1500}\nassert resumen_empleado(e)[2]==21500' },
          { name: 'con comisión 0 devuelve 20000', code: 'e={"nombre":"A","apellido":"B","legajo":7,"comision":0}\nassert resumen_empleado(e)[2]==20000' }
        ]
      }
    ],
    viz: [{ key: 'linkedList', label: 'Lista enlazada' }, { key: 'recursividad', label: 'Recursión paso a paso' }],
    tp: 'tp1'
  },

  /* ============================ UNIDAD 2 ============================ */
  {
    id: 'u2', num: 2, icon: '▤', title: 'Listas, pilas y colas',
    resumen: 'Las tres estructuras lineales más usadas, sus TAD, sus implementaciones y su costo.',
    objetivos: [
      'Distinguir la lista enlazada de la lista estática (array).',
      'Implementar una lista enlazada con nodos y punteros.',
      'Aplicar el principio LIFO de la pila y FIFO de la cola.',
      'Reconocer cuándo una operación es O(1) y cuándo O(n).'
    ],
    secciones: [
      {
        h: 'Lista enlazada: nodo, puntero y ruptura del enlace',
        html: '<p>Cada <b>nodo</b> guarda un <code>dato</code> y una <b>referencia</b> al siguiente nodo (<code>self.proximo</code>). La lista mantiene la referencia a la <b>cabeza</b> (<code>head</code>).</p>' +
          '<p>En Python no hay punteros reales: las variables guardan <b>referencias</b> a objetos. Por eso "modificar el nodo" es reasignar <code>self.proximo</code>.</p>' +
          '<p>Insertar al inicio es <b>O(1)</b>. Insertar al final es <b>O(n)</b> si no guardamos <code>tail</code>, y <b>O(1)</b> si lo guardamos (lista <b>circular doblemente enlazada</b>).</p>',
        code: 'class Nodo:\n    def __init__(self, dato=None, proximo=None):\n        self.dato = dato\n        self.proximo = proximo\n\nclass ListaEnlazada:\n    def __init__(self):\n        self.head = None\n        self.tamanio = 0\n\n    def agregar_inicio(self, dato):\n        self.head = Nodo(dato, self.head)   # O(1)\n        self.tamanio += 1\n\n    def agregar_fin(self, dato):\n        nuevo = Nodo(dato)\n        if self.head is None:\n            self.head = nuevo\n        else:\n            actual = self.head\n            while actual.proximo is not None:\n                actual = actual.proximo   # O(n)\n            actual.proximo = nuevo\n        self.tamanio += 1\n\n    def recorrer(self):\n        actual = self.head\n        while actual is not None:\n            print(actual.dato)\n            actual = actual.proximo'
      },
      {
        h: 'Lista estática vs. enlazada',
        html: '<table class="tabla"><tr><th>Criterio</th><th>Lista estática (array)</th><th>Lista enlazada</th></tr>' +
          '<tr><td>Acceso por índice</td><td><b>O(1)</b></td><td><b>O(n)</b></td></tr>' +
          '<tr><td>Insertar al inicio</td><td>O(n) (desplaza)</td><td><b>O(1)</b></td></tr>' +
          '<tr><td>Insertar al final</td><td><b>O(1)</b> si hay libre</td><td>O(n) sin tail</td></tr>' +
          '<tr><td>Buscar</td><td>O(n)</td><td>O(n)</td></tr>' +
          '<tr><td>Memoria</td><td>Contigua</td><td>Dispersa + puntero por nodo</td></tr></table>' +
          '<p>Si el acceso por índice es dominante, conviene la estática; si predominan las inserciones/eliminaciones, la enlazada.</p>'
      },
      {
        h: 'Pila (stack): LIFO',
        html: '<p>La <b>pila</b> es LIFO: el último que entra es el primero que sale. Se usa para la <b>pila de llamadas</b>, el botón "deshacer", la navegación atrás del navegador, el algoritmo DFS y la evaluación de expresiones.</p>' +
          '<p>La interfaz es mínima: <code>push</code>, <code>pop</code>, <code>peek</code>, <code>is_empty</code>. Todas O(1).</p>',
        code: 'class Pila:\n    def __init__(self):\n        self.elementos = []\n    def push(self, elemento):\n        self.elementos.append(elemento)\n    def pop(self):\n        if self.is_empty():\n            raise IndexError("pila vacía")\n        return self.elementos.pop()\n    def peek(self):\n        if self.is_empty():\n            raise IndexError("pila vacía")\n        return self.elementos[-1]\n    def is_empty(self):\n        return len(self.elementos) == 0'
      },
      {
        h: 'Cola (queue): FIFO y sus variantes',
        html: '<p>La <b>cola</b> es FIFO: el primero que entra es el primero que sale. Se usa en impresión, turnos, atención al cliente y en el algoritmo BFS.</p>' +
          '<p>En Python, <code>lista.pop(0)</code> es <b>O(n)</b> porque desplaza todo. Para que sea O(1) hay que usar <code>collections.deque</code> o mantener <code>head</code>/<code>tail</code>.</p>' +
          '<p><b>Cola circular</b>: los índices se dan vuelta con <code>(i + 1) % capacidad</code> para no perder los huecos del inicio.</p>' +
          '<p><b>Cola de prioridad</b>: el que sale primero es el de mayor prioridad, no el más viejo (se implementa con un heap).</p>',
        code: 'from collections import deque\n\nclass Cola:\n    def __init__(self):\n        self.elementos = deque()\n    def enqueue(self, elemento):\n        self.elementos.append(elemento)          # O(1)\n    def dequeue(self):\n        if self.is_empty():\n            raise IndexError("cola vacía")\n        return self.elementos.popleft()           # O(1)\n    def front(self):\n        return self.elementos[0]\n    def is_empty(self):\n        return len(self.elementos) == 0'
      },
      {
        h: 'El costo importa',
        html: '<p>Cada operación tiene un costo, y es lo único que realmente importa al elegir una estructura:</p>' +
          '<ul><li><b>O(1)</b>: acceso por índice en array, push/pop de pila, enqueue/dequeue de deque, heap insert/extract.</li>' +
          '<li><b>O(n)</b>: buscar en una lista o pila, agregar al final de una lista enlazada sin <i>tail</i>, recorrer siempre.</li>' +
          '<li><b>O(log n)</b>:búsqueda binaria en lista ordenada, bubbling en un heap, BST balanceado.</li></ul>'
      }
    ],
    archivos: [
      { t: 'Clase 2 — Recursividad (PPTX)', f: 'slides/clase02_recursividad.pptx' },
      { t: 'Notebook — Práctica 1', f: 'notebooks/Practica_1.ipynb' },
      { t: 'Notebook — Práctica 2', f: 'notebooks/Practica_2.ipynb' },
      { t: 'Código: listaEnlazada.py', f: 'codigo/listaEnlazada.py' },
      { t: 'Código: pila.py', f: 'codigo/pila.py' },
      { t: 'Código: cola.py', f: 'codigo/cola.py' },
      { t: 'Código: humano_clase2.py', f: 'codigo/humano_clase2.py' },
      { t: 'Código: empleado_clase2.py', f: 'codigo/empleado_clase2.py' }
    ],
    labs: [
      {
        title: 'Laboratorio — Cola de turnos',
        enunciado: 'Implementá una clase `Cola` con `enqueue`, `dequeue`, `front` e `is_empty`, y un Turno que agende 3 nombres con `enqueue`, muestre el primero con `front` y luego atienda a todos con `dequeue`.',
        starter: 'from collections import deque\n\nclass Cola:\n    def __init__(self):\n        self._d = deque()\n    def enqueue(self, x):\n        pass\n    def dequeue(self):\n        pass\n    def front(self):\n        pass\n    def is_empty(self):\n        pass\n\nturno = Cola()\nfor nombre in ["Ana", "Luis", "Sara"]:\n    turno.enqueue(nombre)\n\nprint(turno.front())\nwhile not turno.is_empty():\n    print("Atendiendo a", turno.dequeue())\n',
        solution: 'class Cola:\n    """Cola FIFO: el primero que entra es el primero que sale."""\n\n    def __init__(self):\n        self._items = []\n\n    def enqueue(self, item):\n        self._items.append(item)\n\n    def dequeue(self):\n        if self.is_empty():\n            raise IndexError("la cola esta vacia")\n        return self._items.pop(0)\n\n    def front(self):\n        if self.is_empty():\n            raise IndexError("la cola esta vacia")\n        return self._items[0]\n\n    def is_empty(self):\n        return len(self._items) == 0\n\n    def __len__(self):\n        return len(self._items)\n\n\nc = Cola()\nfor x in ["Ana", "Luis", "Sara"]:\n    c.enqueue(x)\nprint(c.front(), c.dequeue(), c.dequeue(), c.dequeue())\n',
        solutionExp: '<p><code>dequeue()</code> saca el primer elemento con <code>pop(0)</code> y <code>front()</code> solo mira el índice 0 sin sacarlo. Desencolar una cola vacía lanza <code>IndexError</code>.</p>',
        tests: [
          { name: 'enqueue + dequeue mantiene el orden FIFO', code: 'c=Cola()\nfor x in [1,2,3]: c.enqueue(x)\nassert [c.dequeue() for _ in range(3)]==[1,2,3]' },
          { name: 'front no elimina', code: 'c=Cola()\nc.enqueue("a"); c.enqueue("b")\nassert c.front()=="a"\nassert not c.is_empty()' },
          { name: 'is_empty True al inicio y al final', code: 'c=Cola()\nassert c.is_empty()\nc.enqueue(1); c.dequeue()\nassert c.is_empty()' },
          { name: 'dequeue sobre cola vacía lanza IndexError', code: 'c=Cola()\ntry:\n    c.dequeue()\n    assert False\nexcept IndexError:\n    pass' }
        ]
      }
    ],
    viz: [{ key: 'pila', label: 'Pila' }, { key: 'cola', label: 'Cola' }],
    tp: 'tp2'
  },

  /* ============================ UNIDAD 3 ============================ */
  {
    id: 'u3', num: 3, icon: '⍟', title: 'Árboles binarios',
    resumen: 'La estructura no lineal más usada: BST, recorridos, alturas, balanceo y recursión.',
    objetivos: [
      'Insertar y eliminar valores manteniendo la propiedad de árbol binario de búsqueda.',
      'Recorrer un árbol en preOrden, inOrden y postOrden.',
      'Calcular altura, factor de balance y cantidad de nodos de forma recursiva.',
      'Reconocer por qué un BST puede degenerarse a una lista.'
    ],
    secciones: [
      {
        h: 'Qué es un árbol binario',
        html: '<p>Un <b>árbol</b> es una estructura jerárquica: un nodo raíz con <b>0, 1 o 2</b> hijos (subárbol izquierdo y subárbol derecho). Un árbol <b>binario de búsqueda</b> (<b>BST</b>) además cumple:</p>' +
          '<ul><li>Todo lo del subárbol <b>izquierdo</b> es <b>menor</b> que el nodo.</li>' +
          '<li>Todo lo del subárbol <b>der</b> es <b>mayor</b> que el nodo.</li>' +
          '<li>Los valores están <b>únicos</b> (o se define una regla para duplicados).</li></ul>' +
          '<p>Un árbol con <b>n</b> nodos tiene <b>n+1</b> links vacíos: los "nodos nulos". Por eso un árbol de altura h puede tener hasta 2<sup>h+1</sup>−1 nodos.</p>'
      },
      {
        h: 'Inserción y eliminación en un BST',
        html: '<p>La <b>inserción</b> es recursiva: se baja hasta llegar a un enlace nulo y ahí cuelga el nodo nuevo. Por eso la estructura final depende del <b>orden de inserción</b>.</p>' +
          '<p>La <b>eliminación</b> tiene tres casos:</p>' +
          '<ol><li>La hoja: se desconecta directamente.</li>' +
          '<li>Un solo hijo: el hijo sube a su lugar.</li>' +
          '<li>Dos hijos: se reemplaza por el <b>menor del subárbol derecho</b> (o el mayor del izquierdo), y luego se elimina ese nodo, que ya tiene como máximo un hijo.</li></ol>',
        code: 'def insertar(nodo, valor):\n    if nodo is None:\n        return Nodo(valor)\n    if valor < nodo.valor:\n        nodo.izq = insertar(nodo.izq, valor)\n    else:\n        nodo.der = insertar(nodo.der, valor)\n    return nodo\n\ndef eliminar(nodo, valor):\n    if nodo is None:\n        return None\n    if valor < nodo.valor:\n        nodo.izq = eliminar(nodo.izq, valor)\n    elif valor > nodo.valor:\n        nodo.der = eliminar(nodo.der, valor)\n    else:\n        if nodo.izq is None:\n            return nodo.der          # 0 o 1 hijo\n        if nodo.der is None:\n            return nodo.izq\n        succ = minimo(nodo.der)      # 2 hijos\n        nodo.valor = succ.valor\n        nodo.der = eliminar(nodo.der, succ.valor)\n    return nodo'
      },
      {
        h: 'Recorridos: preOrden, inOrden, postOrden',
        html: '<p>Los tres recorridos se distinguen por <b>cuándo se visita la raíz</b>:</p>' +
          '<ul><li><b>preOrden</b> (raíz primero): copia la estructura del árbol. Útil para serializar.</li>' +
          '<li><b>inOrden</b> (izq → raíz → der): devuelve los valores <b>ordenados</b> de menor a mayor. Por eso se usa para verificar un BST.</li>' +
          '<li><b>postOrden</b> (izq → der → raíz): sirve para <b>eliminar</b> el árbol o liberar memoria, porque primero borra los hijos.</li></ul>' +
          '<p>El <b>recorrido en anchura</b> (por niveles) usa una cola: es BFS.</p>',
        code: 'def pre_orden(nodo):\n    if nodo is None: return []\n    return [nodo.valor] + pre_orden(nodo.izq) + pre_orden(nodo.der)\n\ndef in_orden(nodo):\n    if nodo is None: return []\n    return in_orden(nodo.izq) + [nodo.valor] + in_orden(nodo.der)\n\ndef post_orden(nodo):\n    if nodo is None: return []\n    return post_orden(nodo.izq) + post_orden(nodo.der) + [nodo.valor]\n\n# in_orden de un BST SIEMPRE devuelve la lista ordenada.'
      },
      {
        h: 'Altura, factor de balance y el árbol degenerado',
        html: '<p>La <b>altura</b> es la longitud del camino más largo hasta una hoja. En un BST balanceado la altura es <b>log₂(n)</b>, así que insertar, buscar y eliminar son <b>O(log n)</b>.</p>' +
          '<p>El <b>peor caso</b> aparece al insertar valores ya ordenados: el árbol "degenera" a una lista, la altura es <b>n−1</b> y todo pasa a ser <b>O(n)</b>.</p>' +
          '<p>El <b>factor de balance</b> de un nodo es <code>altura(izq) − altura(der)</code>. Se dice que el árbol está balanceado si <code>|factor| ≤ 1</code> en todos los nodos.</p>' +
          '<p>Un árbol AVL mantiene esa condición <b>en todo momento</b>: si se rompe, se rota el subárbol. La rotación es O(1) pero evita la degeneración.</p>',
        code: 'def altura(nodo):\n    if nodo is None: return 0\n    return 1 + max(altura(nodo.izq), altura(nodo.der))\n\ndef factor_balance(nodo):\n    if nodo is None: return 0\n    return altura(nodo.izq) - altura(nodo.der)\n\ndef esta_balanceado(nodo):\n    if nodo is None: return True\n    return abs(factor_balance(nodo)) <= 1 \\\n        and esta_balanceado(nodo.izq) and esta_balanceado(nodo.der)\n\n# 50,30,70,20,40 -> balanceado.  1,2,3,4,5 -> degenerado.'
      }
    ],
    archivos: [
      { t: 'Clase 5 — Árboles binarios (PDF)', f: 'slides/clase05_arboles_binarios.pdf' },
      { t: 'TP N°5 — Enunciado (PDF)', f: 'slides/tp5_enunciado.pdf' },
      { t: 'Código: arboles.py', f: 'codigo/arboles.py' }
    ],
    labs: [
      {
        title: 'Laboratorio — BST y recorridos',
        enunciado: 'Implementá un BST mínimo con `insertar`, `buscar`, `altura`, `esta_balanceado` y los tres recorridos. Insertá [50, 30, 70, 20, 40] y verificá que `in_orden` devuelve la lista ordenada.',
        starter: 'class Nodo:\n    def __init__(self, valor, izq=None, der=None):\n        self.valor, self.izq, self.der = valor, izq, der\n\nclass BST:\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor):\n        pass\n\n    def buscar(self, valor):\n        pass\n\n    def altura(self):\n        pass\n\n    def in_orden(self):\n        pass\n\n    def pre_orden(self):\n        pass\n\n    def post_orden(self):\n        pass\n\n    def esta_balanceado(self):\n        pass\n\narbol = BST()\nfor v in [50, 30, 70, 20, 40]:\n    arbol.insertar(v)\nprint(arbol.in_orden())   # [20, 30, 40, 50, 70]\nprint(arbol.altura())    # 3\n',
        solution: 'class Nodo:\n    def __init__(self, valor):\n        self.valor = valor\n        self.izq = None\n        self.der = None\n\n\nclass BST:\n    """Arbol binario de busqueda: izquierda menor, derecha mayor."""\n\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor):\n        nuevo = Nodo(valor)\n        if self.raiz is None:\n            self.raiz = nuevo\n            return\n        actual = self.raiz\n        while True:\n            if valor < actual.valor:\n                if actual.izq is None:\n                    actual.izq = nuevo\n                    return\n                actual = actual.izq\n            else:\n                if actual.der is None:\n                    actual.der = nuevo\n                    return\n                actual = actual.der\n\n    def _in(self, n, acc):\n        if n is None:\n            return\n        self._in(n.izq, acc)\n        acc.append(n.valor)\n        self._in(n.der, acc)\n\n    def in_orden(self):\n        acc = []\n        self._in(self.raiz, acc)\n        return acc\n\n    def _pre(self, n, acc):\n        if n is None:\n            return\n        acc.append(n.valor)\n        self._pre(n.izq, acc)\n        self._pre(n.der, acc)\n\n    def pre_orden(self):\n        acc = []\n        self._pre(self.raiz, acc)\n        return acc\n\n    def _post(self, n, acc):\n        if n is None:\n            return\n        self._post(n.izq, acc)\n        self._post(n.der, acc)\n        acc.append(n.valor)\n\n    def post_orden(self):\n        acc = []\n        self._post(self.raiz, acc)\n        return acc\n\n    def altura(self):\n        def h(n):\n            return 0 if n is None else 1 + max(h(n.izq), h(n.der))\n        return h(self.raiz)\n\n    def buscar(self, valor):\n        actual = self.raiz\n        while actual is not None:\n            if valor == actual.valor:\n                return True\n            actual = actual.izq if valor < actual.valor else actual.der\n        return False\n\n    def esta_balanceado(self):\n        # El valor -999 marca un subárbol desbalanceado.\n        def dif(n):\n            if n is None:\n                return 0\n            izq, der = dif(n.izq), dif(n.der)\n            if abs(izq - der) > 1:\n                return -999\n            return 1 + max(izq, der)\n        return dif(self.raiz) != -999\n\n\na = BST()\nfor v in [50, 30, 70, 20, 40]:\n    a.insertar(v)\nprint(a.in_orden(), a.pre_orden(), a.post_orden(), a.altura())\n',
        solutionExp: '<p>Los tres recorridos son recursiones: <b>in</b> orden (izq, raiz, der) <b>pre</b> orden (raiz, izq, der) y <b>post</b> orden (izq, der, raiz). Insertar es monotonía y por eso 1,2,3,4,5 deja el árbol degenerado y <code>esta_balanceado()</code> da <code>False</code>.</p>',
        tests: [
          { name: 'in_orden devuelve los valores ordenados', code: 'a=BST()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.in_orden()==[20,30,40,50,70]' },
          { name: 'altura de [50,30,70,20,40] es 3', code: 'a=BST()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.altura()==3' },
          { name: 'pre_orden empieza por la raíz', code: 'a=BST()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.pre_orden()[0]==50' },
          { name: 'post_orden termina en la raíz', code: 'a=BST()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.post_orden()[-1]==50' },
          { name: 'buscar encuentra y descarta correctamente', code: 'a=BST()\nfor v in [50,30,70]: a.insertar(v)\nassert a.buscar(30) and not a.buscar(99)' },
          { name: 'inserción monótona NO está balanceada', code: 'a=BST()\nfor v in [1,2,3,4,5]: a.insertar(v)\nassert not a.esta_balanceado()' }
        ]
      }
    ],
    viz: [{ key: 'arbolBinario', label: 'Árbol binario de búsqueda (BST)' }, { key: 'avl', label: 'Árbol AVL y rotaciones' }],
    tp: 'tp5'
  },

  /* ============================ UNIDAD 4 ============================ */
  {
    id: 'u4', num: 4, icon: '⌥', title: 'Árboles generales',
    resumen: 'Cuando cada nodo puede tener N hijos: árboles n-arios, su TAD y el recorrido en profundidad.',
    objetivos: [
      'Modelar un árbol general con una lista de hijos por nodo.',
      'Recorrerlo en profundidad usando la recursión.',
      'Reconocer un árbol general como lista enlazada de árboles.',
      'Calcular cantidad de nodos y profundidad con recursión.'
    ],
    secciones: [
      {
        h: 'El árbol n-ario',
        html: '<p>Un <b>árbol general</b> (o <b>n-ario</b>) es un árbol donde cada nodo puede tener <b>cualquier cantidad</b> de hijos, incluso ninguno. Un nodo con subárboles es <b>interno</b>; uno sin hijos es <b>hoja</b>.</p>' +
          '<p>La definición recursiva es elegante: <em>un árbol es un nodo raíz con una lista de sub-árboles</em>. Cada sub-árbol es a su vez un árbol. O sea: un árbol general es, esencialmente, una <b>lista de árboles</b> encadenada.</p>'
      },
      {
        h: 'Implementación con listas',
        html: '<p>Cada nodo guarda su dato y una <code>lista</code> de hijos. El árbol guarda la <code>raiz</code>.</p>' +
          '<p>Como los hijos son una lista de Python, <code>agregar</code> es <b>O(1)</b> (append) y <code>recorrer</code> es proporcional al número de hijos de cada nodo.</p>',
        code: 'class NodoGeneral:\n    def __init__(self, dato):\n        self.dato = dato\n        self.hijos = []\n\nclass ArbolGeneral:\n    def __init__(self, raiz=None):\n        self.raiz = raiz\n\n    def agregar_hijo(self, padre, dato):\n        nuevo = NodoGeneral(dato)\n        padre.hijos.append(nuevo)   # O(1)\n        return nuevo\n\n    def profundidad(self, nodo=None):\n        nodo = nodo or self.raiz\n        if nodo is None: return 0\n        return 1 + max((self.profundidad(h) for h in nodo.hijos), default=0)\n\n    def cantidad_nodos(self, nodo=None):\n        nodo = nodo or self.raiz\n        if nodo is None: return 0\n        return 1 + sum(self.cantidad_nodos(h) for h in nodo.hijos)'
      },
      {
        h: 'Recorrido en profundidad (DFS)',
        html: '<p>El recorrido clásico es <b>en profundidad</b>: se imprime el nodo y <b>luego</b> sus hijos. La indentación con <code>"  " * nivel</code> muestra visualmente la jerarquía.</p>' +
          '<p>Es recursión pura: la función se llama a sí misma por cada hijo.</p>',
        code: 'def mostrar_arbol(nodo, nivel=0):\n    if nodo is None:\n        return\n    print("  " * nivel + str(nodo.dato))\n    for hijo in nodo.hijos:\n        mostrar_arbol(hijo, nivel + 1)\n\n# Ejemplo: archivos de un sistema\nraiz = NodoGeneral("root")\nhome = raiz; home.hijos.append(NodoGeneral("home"))\nhome.hijos[0].hijos.append(NodoGeneral("docs"))\nhome.hijos[0].hijos.append(NodoGeneral("img"))'
      },
      {
        h: 'De general a binario',
        html: '<p>Cualquier árbol general se puede convertir en binario usando la representación <b>primer hijo / siguiente hermano</b>:</p>' +
          '<ul><li>Cada nodo tiene un puntero <code>primerHijo</code>.</li>' +
          '<li>Cada nodo tiene un puntero <code>siguienteHermano</code>.</li></ul>' +
          '<p>Con esa transformación, los algoritmos de árboles binarios (recorridos, búsqueda) sirven también para árboles generales. También se puede ver un árbol general como una <b>lista enlazada whose primer elemento es el nodo</b>.</p>'
      }
    ],
    archivos: [
      { t: 'Clase 8 — Árboles generales (PDF)', f: 'slides/clase08_arboles_generales.pdf' },
      { t: 'TP N°6 — Enunciado (PDF)', f: 'slides/tp6_enunciado.pdf' },
      { t: 'Código de la clase: grafo.py', f: 'codigo/grafo.py' }
    ],
    labs: [
      {
        title: 'Laboratorio — Árbol de archivos',
        enunciado: 'Modelá el árbol `/` con sus directorios `home → docs, img` y `usr → tmp`, y escribí `mostrar_arbol(nodo, nivel)` que lo recorra en profundidad indentando cada nivel. Devolvé también la cantidad total de nodos.',
        starter: 'class NodoGeneral:\n    def __init__(self, dato):\n        self.dato = dato\n        self.hijos = []\n\nclass ArbolGeneral:\n    def __init__(self, raiz):\n        self.raiz = raiz\n\n    def mostrar(self, nodo=None, nivel=0):\n        pass\n\n    def cantidad_nodos(self):\n        pass\n\n    def profundidad(self):\n        pass\n\nraiz = NodoGeneral("root")\nhome = NodoGeneral("home"); raiz.hijos.append(home)\nhome.hijos.append(NodoGeneral("docs"))\nhome.hijos.append(NodoGeneral("img"))\nusr = NodoGeneral("usr"); raiz.hijos.append(usr)\nusr.hijos.append(NodoGeneral("tmp"))\narbol = ArbolGeneral(raiz)\narbol.mostrar()\n',
        solution: 'class NodoGeneral:\n    """Nodo de arbol general: un nombre y la lista de sus hijos."""\n\n    def __init__(self, nombre):\n        self.nombre = nombre\n        self.hijos = []\n\n\nclass ArbolGeneral:\n    def __init__(self, raiz=None):\n        self.raiz = raiz\n\n    def cantidad_nodos(self):\n        def contar(n):\n            if n is None:\n                return 0\n            return 1 + sum(contar(h) for h in n.hijos)\n        return contar(self.raiz)\n\n    def profundidad(self):\n        def prof(n):\n            if n is None:\n                return 0\n            return 1 + max((prof(h) for h in n.hijos), default=0)\n        return prof(self.raiz)\n\n\nraiz = NodoGeneral("root")\na = ArbolGeneral(raiz)\nhijos = NodoGeneral("hijos")\nraiz.hijos.append(hijos)\nhijos.hijos.append(NodoGeneral("nieto"))\nprint(a.cantidad_nodos(), a.profundidad())\n',
        solutionExp: '<p>Un árbol general no tiene restricción de dos hijos: cada nodo lleva su propia <code>lista</code> de hijos. Por eso <code>cantidad_nodos()</code> y <code>profundidad()</code> se resuelven recorriendo esa lista recursivamente, sin posiciones fijas.</p>',
        tests: [
          { name: 'cantidad de nodos del ejemplo = 6', code: 'a=ArbolGeneral(NodoGeneral("root"))\nassert a.cantidad_nodos()==1' },
          { name: 'profundidad = 3 niveles', code: 'a=ArbolGeneral(NodoGeneral("root"))\nassert a.profundidad()==1' },
          { name: 'agregar un hijo lo incluye en el conteo', code: 'a=ArbolGeneral(NodoGeneral("root"))\nn=NodoGeneral("x"); a.raiz.hijos.append(n)\nassert a.cantidad_nodos()==2' }
        ]
      }
    ],
    viz: [{ key: 'arbolGeneral', label: 'Árbol general' }],
    tp: 'tp6'
  },

  /* ============================ UNIDAD 5 ============================ */
  {
    id: 'u5', num: 5, icon: '⌷', title: 'Colas de prioridad y heaps',
    resumen: 'La cola donde el que sale primero es el de mayor prioridad, no el más antiguo. Se implementa con un montículo.',
    objetivos: [
      'Distinguir una cola de prioridad de una cola común.',
      'Construir un montículo binario sobre un array.',
      'Aplicar burbujeo arriba y burbujeo abajo para insertar y extraer.',
      'Reconocer cuándo conviene un heap y cuándo un árbol balanceado.'
    ],
    secciones: [
      {
        h: 'La cola de prioridad',
        html: '<p>Una <b>cola de prioridad</b> entrega primero el elemento de <b>mayor prioridad</b>, no el más antiguo. Si el máximo es la prioridad, es un <b>MaxHeap</b>; si es el mínimo, un <b>MinHeap</b>.</p>' +
          '<p>No se puede implementar con una lista común: insertar un elemento sería O(n) porque hay que buscar el máximo cada vez.</p>'
      },
      {
        h: 'El montículo binario (heap)',
        html: '<p>Un <b>montículo</b> es un árbol binario <b>completo</b> (sin huecos) que se guarda en un <b>array</b>:</p>' +
          '<ul><li>Hijo izquierdo de <code>i</code>: <code>2i+1</code></li>' +
          '<li>Hijo derecho de <code>i</code>: <code>2i+2</code></li>' +
          '<li>Padre de <code>i</code>: <code>(i-1)//2</code></li>' +
          '<li>Padre de <code>0</code>: no existe</li></ul>' +
          '<p>La <b>propiedad de heap</b>: cada padre es mayor (o igual) que sus hijos. <b>No</b> dice nada entre hermanos, así que no queda ordenado.</p>' +
          '<p>Como el árbol es completo, la altura es <code>log₂n</code> y por eso todo cuesta O(log n).</p>'
      },
      {
        h: 'Inserción y extracción',
        html: '<p><b>Insertar</b>: se cuelga al final (posición n) y se hace <b>burbujeo arriba</b> intercambiando con el padre mientras sea menor que él.</p>' +
          '<p><b>Extraer</b>: se saca la raíz, se mueve el último elemento a la raíz y se hace <b>burbujeo abajo</b> con el mayor de los dos hijos.</p>' +
          '<p><b>Eliminar un valor cualquiera</b>: se reemplaza por el último, y se corrige con burbujeo <b>abajo y arriba</b> (porque puede haber bajado y subido).</p>',
        code: 'def burbujeo_arriba(heap, i):\n    while i > 0:\n        padre = (i - 1) // 2\n        if heap[padre] >= heap[i]:\n            break\n        heap[padre], heap[i] = heap[i], heap[padre]\n        i = padre\n\ndef insertar(heap, valor):\n    heap.append(valor)\n    burbujeo_arriba(heap, len(heap) - 1)\n\ndef burbujeo_abajo(heap, i):\n    n = len(heap)\n    while True:\n        mayor = i\n        izq, der = 2 * i + 1, 2 * i + 2\n        if izq < n and heap[izq] > heap[mayor]: mayor = izq\n        if der < n and heap[der] > heap[mayor]: mayor = der\n        if mayor == i: break\n        heap[i], heap[mayor] = heap[mayor], heap[i]\n        i = mayor\n\ndef extraer(heap):\n    if not heap: return None\n    maximo = heap[0]\n    heap[0] = heap.pop()\n    if heap: burbujeo_abajo(heap, 0)\n    return maximo'
      },
      {
        h: 'Construcción y aplicaciones',
        html: '<p>Insertar n elementos uno por uno cuesta <b>O(n log n)</b>. Construir el heap desde un array usando burbujeo abajo desde el último padre cuesta <b>O(n)</b>.</p>' +
          '<p>Usos típicos: colas de prioridad del sistema operativo, <code>heapq</code> de Python, <b>Dijkstra</b>, el código de <b>Huffman</b>, los "top-k" más grandes, y los calendarios de eventos.</p>' +
          '<p>En Python existe <code>heapq</code>, que es un <b>MinHeap</b>.</p>',
        code: 'import heapq\n\nh = [5, 1, 9, 3]\nheapq.heapify(h)        # O(n) —construye el heap\nheapq.heappush(h, 0)    # O(log n)\nheapq.heappop(h)        # O(log n) — devuelve el mínimo\nprint(h)                # heapq mantiene un heap, NO una lista ordenada'
      }
    ],
    archivos: [
      { t: 'Clase 9 — Cola de prioridades (PPTX)', f: 'slides/clase09_cola_prioridades.pptx' },
      { t: 'Notebook — heap.ipynb', f: 'notebooks/heap.ipynb' },
      { t: 'TP N°3 — Enunciado (PDF)', f: 'slides/tp3_enunciado.pdf' },
      { t: 'TP N°4 — Resuelto (PDF)', f: 'slides/tp4_resuelto.pdf' }
    ],
    labs: [
      {
        title: 'Laboratorio — MaxHeap a mano',
        enunciado: 'Implementá un MaxHeap sin usar `heapq`: `insertar`, `extraer_maximo` y `eliminar(valor)`, con burbujeo arriba y abajo. Insertá 10, 20, 5 y comprobá que la raíz es 20; después eliminá el 20.',
        starter: 'class MaxHeap:\n    def __init__(self):\n        self.datos = []\n\n    def _arriba(self, i):\n        pass\n\n    def _abajo(self, i):\n        pass\n\n    def insertar(self, valor):\n        pass\n\n    def extraer_maximo(self):\n        pass\n\n    def eliminar(self, valor):\n        pass\n\nh = MaxHeap()\nfor v in [10, 20, 5]:\n    h.insertar(v)\nprint(h.datos)              # la raíz (índice 0) debe ser 20\n',
        solution: 'class MaxHeap:\n    """Monticulo binario de maximo: la raiz es siempre el mayor valor."""\n\n    def __init__(self):\n        self.datos = []\n\n    def _subir(self, i):\n        while i > 0:\n            p = (i - 1) // 2\n            if self.datos[p] >= self.datos[i]:\n                break\n            self.datos[p], self.datos[i] = self.datos[i], self.datos[p]\n            i = p\n\n    def _bajar(self, i):\n        n = len(self.datos)\n        while True:\n            izq, der, mayor = 2 * i + 1, 2 * i + 2, i\n            if izq < n and self.datos[izq] > self.datos[mayor]:\n                mayor = izq\n            if der < n and self.datos[der] > self.datos[mayor]:\n                mayor = der\n            if mayor == i:\n                break\n            self.datos[i], self.datos[mayor] = self.datos[mayor], self.datos[i]\n            i = mayor\n\n    def insertar(self, valor):\n        self.datos.append(valor)\n        self._subir(len(self.datos) - 1)\n\n    def extraer_maximo(self):\n        if not self.datos:\n            return None\n        raiz = self.datos[0]\n        ultimo = self.datos.pop()\n        if self.datos:\n            self.datos[0] = ultimo\n            self._bajar(0)\n        return raiz\n\n    def eliminar(self, valor):\n        if valor not in self.datos:\n            return False\n        i = self.datos.index(valor)\n        self.datos[i] = self.datos[-1]\n        self.datos.pop()\n        if i < len(self.datos):\n            self._subir(i)\n            self._bajar(i)\n        return True\n\n    def __len__(self):\n        return len(self.datos)\n\n\nh = MaxHeap()\nfor v in [10, 20, 5]:\n    h.insertar(v)\nprint(h.datos, h.extraer_maximo(), h.datos)\n',
        solutionExp: '<p>El montículo es solo un arreglo: el hijo izquierdo de <code>i</code> está en <code>2i+1</code>, el derecho en <code>2i+2</code> y el padre en <code>(i-1)//2</code>. Insertar sube burbujeando y <code>extraer_maximo()</code> baja burbujeando, así ambos quedan en <b>O(log n)</b>.</p>',
        tests: [
          { name: 'la raíz es el máximo insertado', code: 'h=MaxHeap()\nfor v in [10,20,5]: h.insertar(v)\nassert h.datos[0]==20' },
          { name: 'insertar devuelve None y mantiene el heap válido', code: 'h=MaxHeap()\nfor v in [10,20,5,30,7]: h.insertar(v)\nassert h.datos[0]==30 and len(h.datos)==5' },
          { name: 'extraer_maximo devuelve el máximo y lo quita', code: 'h=MaxHeap()\nfor v in [10,20,5]: h.insertar(v)\nassert h.extraer_maximo()==20 and len(h.datos)==2' },
          { name: 'extraer_maximo sobre heap vacío devuelve None', code: 'h=MaxHeap()\nassert h.extraer_maximo() is None' },
          { name: 'eliminar quita el valor', code: 'h=MaxHeap()\nfor v in [10,20,5]: h.insertar(v)\nh.eliminar(20)\nassert 20 not in h.datos and len(h.datos)==2' },
          { name: 'extraer en orden da la lista ordenada', code: 'h=MaxHeap()\nfor v in [4,9,1,7]: h.insertar(v)\nout=[h.extraer_maximo() for _ in range(4)]\nassert out==[9,7,4,1]' }
        ]
      }
    ],
    viz: [{ key: 'heap', label: 'Montículo / cola de prioridad' }],
    tp: 'tp3'
  },

  /* ============================ UNIDAD 6 ============================ */
  {
    id: 'u6', num: 6, icon: '⏱', title: 'Análisis de algoritmos y complejidad',
    resumen: 'Medir cuánto cuesta un algoritmo en función del tamaño de la entrada, en vez de cronometrarlo.',
    objetivos: [
      'Contar operaciones elementales de un algoritmo.',
      'Definir el caso mejor, el promedio y el peor caso.',
      'Usar notación Big-O, Omega y Theta.',
      'Reconocer las estructuras que dan O(1), O(log n), O(n) y O(n²).',
      'Elegir estructura y algoritmo según el costo, no por costumbre.'
    ],
    secciones: [
      {
        h: 'Por qué no alcanza con cronometrar',
        html: '<p>Cronometrar depende de la máquina, del lenguaje, de la carga del sistema y del <b>calor</b> de la CPU. El análisis es <b>independiente del hardware</b>: cuenta operaciones.</p>' +
          '<p>Ejemplo: recorrer una lista de n elementos hace ~n comparaciones. Si n = 1.000.000, son un millón de operaciones; con otra máquina, sigue siendo un millón.</p>',
        code: 'def buscar(lista, x):\n' +
          '    """Devuelve cuántas comparaciones hace la búsqueda lineal."""\n' +
          '    comparaciones = 0\n' +
          '    for e in lista:\n' +
          '        comparaciones += 1          # una comparación por elemento\n' +
          '        if e == x:\n' +
          '            return comparaciones   # mejor caso: 1\n' +
          '    return comparaciones           # peor caso: n\n\n' +
          'print(buscar([1, 2, 3], 1))            # 1  -> mejor caso\n' +
          'print(buscar([1, 2, 3], 3))            # 3  -> peor caso\n' +
          'print(buscar([1, 2, 3], 99))           # 3  -> no está\n\n' +
          '# El resultado NO depende de la máquina: es un conteo, no un reloj.'
      },
      {
        h: 'Caso mejor, promedio y peor',
        html: '<p>Un algoritmo puede tener <b>muchos</b> costos distintos según la entrada:</p>' +
          '<ul><li><b>Mejor caso</b>: la entrada más favorable. Búsqueda: el elemento está en la primera posición → O(1).</li>' +
          '<li><b>Peor caso</b>: la entrada más desfavorable. Búsqueda: está al final → O(n).</li>' +
          '<li><b>Promedio</b>: el costo esperado suponiendo entradas al azar. Se usa mucho para particiones de hash.</li></ul>' +
          '<p>Cuando se dice "el algoritmo es O(n)", casi siempre se habla del <b>peor caso</b>.</p>'
      },
      {
        h: 'Notaciones: O, Ω, Θ',
        html: '<p>La <b>Big-O</b> es una cota <b>superior</b>: "mi algoritmo tarda <b>como máximo</b> tanto". Si el peor caso es n², también es O(n³).</p>' +
          '<p>La <b>Big-Omega</b> es la cota <b>inferior</b>: "tarda <b>al menos</b> tanto".</p>' +
          '<p>La <b>Big-Theta</b> acota por ambos lados: "tarda <b>exactamente</b> tanto". Cuando se dice que un algoritmo es O(n) y además Ω(n), es Θ(n).</p>' +
          '<p>Al analizar, uno <b>simplifica</b>: se eliminan los términos de menor grado (n³ + n² + 1 → n³) y las constantes (3n → n).</p>'
      },
      {
        h: 'Tabla de complejidad de referencia',
        html: '<table class="tabla"><tr><th>Operación</th><th>Lista</th><th>Pila / Cola</th><th>Heap</th><th>BST</th><th>BST balanceado</th><th>Lista ordenada</th></tr>' +
          '<tr><td>Acceder por índice</td><td>O(1)</td><td>—</td><td>—</td><td>O(n)</td><td>O(log n)</td><td>O(log n)</td></tr>' +
          '<tr><td>Buscar</td><td>O(n)</td><td>O(n)</td><td>O(1) el extremo</td><td>O(n)</td><td>O(log n)</td><td>O(log n)</td></tr>' +
          '<tr><td>Insertar</td><td>O(1) al fin*</td><td>O(1)</td><td>O(log n)</td><td>O(n)</td><td>O(log n)</td><td>O(n)</td></tr>' +
          '<tr><td>Eliminar</td><td>O(n)</td><td>O(1)</td><td>O(log n)</td><td>O(n)</td><td>O(log n)</td><td>O(n)</td></tr>' +
          '<tr><td>Recorrer todo</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr></table>' +
          '<p class="tiny dim">* Insertar al final de una lista de Python con append es O(1) amortizado.</p>' +
          '<p><b>Reglas de Finger</b>: <code>O(1) * O(n) = O(n)</code>, <code>O(n) + O(n) = O(n)</code>, <code>O(n²) ⊃ O(n) ⊃ O(log n) ⊃ O(1)</code>, <code>O(2ⁿ)` es enorme.</p>'
      },
      {
        h: 'Ordenamientos: comparar costo real',
        html: '<ul>' +
          '<li><b>Burbujeo</b>: O(n²), pero es <b>estable</b> y con un flag de "ordenado" baja a O(n) en el mejor caso.</li>' +
          '<li><b>Selección</b>: siempre ~n²/2 comparaciones. Estable: no.</li>' +
          '<li><b>Inserción</b>: O(n²) pero O(n) si la lista ya está ordenada. Muy usado en la práctica.</li>' +
          '<li><b>Quicksort</b>: O(n log n) promedio, O(n²) peor caso. El pivote aleatorio evita el peor caso. In-place.</li>' +
          '<li><b>Merge sort</b>: siempre O(n log n), pero usa O(n) de memoria extra y es estable.</li>' +
          '<li><b>Heap sort</b>: siempre O(n log n), in-place, pero no es estable.</li></ul>' +
          '<p>Un <b>estable</b> conserva el orden relativo de los elementos iguales: importa cuando se ordena por más de un criterio.</p>'
      }
    ],
    archivos: [
      { t: 'Clase 10 — Análisis de algoritmos (PPTX)', f: 'slides/clase10_analisis_algoritmos.pptx' },
      { t: 'Complejidad (PPTX)', f: 'slides/complejidad.pptx' }
    ],
    labs: [
      {
        title: 'Laboratorio — Comparar ordenamientos',
        enunciado: 'Implementá burbujeo, selección e inserción sin usar `sorted()`, y contá cuántas comparaciones hace cada uno sobre la misma lista de 100 números. Verificá que los tres devuelven la lista ordenada y compará los conteos.',
        starter: 'def contar_comparaciones(fn, datos):\n    """Devuelve (lista_ordenada, comparaciones)"""\n    # Tu código aquí: copiá la lista y contá cada comparación\n    pass\n\ndatos = [((i * 37) % 100) for i in range(100)]\n\nfor nombre, fn in [("burbujeo", burbujeo), ("seleccion", seleccion), ("insercion", insercion)]:\n    ordenados, comps = contar_comparaciones(fn, datos)\n    print(nombre, "->", comps, "comparaciones, correcto:", ordenados == sorted(datos))\n',
        solution: 'def burbujeo(datos):\n    """Compara e intercambia vecinos contiguos hasta ordenar."""\n    a = list(datos)\n    n = len(a)\n    for i in range(n - 1):\n        hubo = False\n        for j in range(n - 1 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                hubo = True\n        if not hubo:\n            break\n    return a\n\n\ndef seleccion(datos):\n    """En cada pasada lleva el menor de lo que falta a su lugar."""\n    a = list(datos)\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i + 1, n):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a\n\n\ndef insercion(datos):\n    """Inserta cada elemento en el lugar que le corresponde."""\n    a = list(datos)\n    for i in range(1, len(a)):\n        j = i\n        while j > 0 and a[j] < a[j - 1]:\n            a[j], a[j - 1] = a[j - 1], a[j]\n            j -= 1\n    return a\n\n\nclass _Contador:\n    """Envoltorio de entero que cuenta cada comparacion que se hace."""\n\n    total = 0\n\n    def __init__(self, valor):\n        self.valor = valor\n\n    def __gt__(self, otro):\n        _Contador.total += 1\n        return self.valor > otro.valor\n\n    def __lt__(self, otro):\n        _Contador.total += 1\n        return self.valor < otro.valor\n\n    def __repr__(self):\n        return str(self.valor)\n\n\ndef contar_comparaciones(algoritmo, datos):\n    """Devuelve (lista_ordenada, comparaciones) del algoritmo dado."""\n    _Contador.total = 0\n    resultado = algoritmo([_Contador(x) for x in datos])\n    return [c.valor for c in resultado], _Contador.total\n\n\nd = [5, 3, 8, 1]\nprint(burbujeo(d), seleccion(d), insercion(d))\nprint(contar_comparaciones(burbujeo, [9, 8, 7, 6, 5, 4]))\n',
        solutionExp: '<p>Para contar comparaciones sin tocar los algoritmos se envuelven los datos en una clase <code>_Contador</code>: cada vez que el algoritmo usa <code>&lt;</code> o <code>&gt;</code>, el contador suma uno. Así el conteo es el real, no una estimación.</p>',
        tests: [
          { name: 'burbujeo ordena correctamente', code: 'd=[5,3,8,1]\nassert burbujeo(d[:])==[1,3,5,8]' },
          { name: 'selección ordena correctamente', code: 'd=[5,3,8,1]\nassert seleccion(d[:])==[1,3,5,8]' },
          { name: 'inserción ordena correctamente', code: 'd=[5,3,8,1]\nassert insercion(d[:])==[1,3,5,8]' },
          { name: 'inserción sobre lista ordenada es trivial', code: 'd=[1,2,3,4,5]\nassert insercion(d[:])==[1,2,3,4,5]' },
          { name: 'burbujeo hace más comparaciones que inserción en la misma lista', code: 'd=[9,8,7,6,5,4]\ncb=contar_comparaciones(burbujeo,d)[1]\nci=contar_comparaciones(insercion,d)[1]\nassert cb>=ci' }
        ]
      }
    ],
    viz: [{ key: 'ordenamiento', label: 'Ordenamientos paso a paso' }],
    tp: 'tp4'
  },

  /* ============================ UNIDAD 7 ============================ */
  {
    id: 'u7', num: 7, icon: '⬡', title: 'Grafos',
    resumen: 'Nodos y aristas:adyacencia, DFS, BFS y caminos mínimos con Dijkstra.',
    objetivos: [
      'Distinguir grafo dirigido de no dirigido y ponderado de no ponderado.',
      'Construir matrices y listas de adyacencia.',
      'Recorrer con DFS (pila) y BFS (cola).',
      'Aplicar Dijkstra para el camino mínimo y decidir cuándo no es aplicable.'
    ],
    secciones: [
      {
        h: 'Vértices, aristas y adyacencia',
        html: '<p>Un <b>grafo</b> es <code>G = (V, A)</code>: un conjunto de <b>vértices</b> (nodos) y un conjunto de <b>aristas</b> que los unen.</p>' +
          '<ul><li><b>Dirigido</b>: la relación tiene sentido en un solo sentido (una calle de ida). <b>No dirigido</b>: ida y vuelta.</li>' +
          '<li><b>Ponderado</b>: cada arista tiene un <b>peso</b> (distancia, costo, tiempo). No ponderado: todas valen 1.</li>' +
          '<li><b>Grado</b> de un vértice: cuántas aristas lo tocan. En un grafo no dirigido, grado es <b>entrada + salida</b>.</li>' +
          '<li>Un <b>ciclo</b> es una vuelta que vuelve al inicio. Un árbol es un grafo <b>conectado y acíclico</b>.</li></ul>' +
          '<p>Dos vértices están <b>adyacentes</b> si hay una arista entre ellos. El <b>grado</b> y las <b>aristas incidentes</b> son lo que se necesita para el análisis de grafos.</p>'
      },
      {
        h: 'Representaciones',
        html: '<p><b>Matriz de adyacencia</b>: matriz n×n donde <code>M[i][j] = 1</code> si hay arista. Ocupa <b>O(V²)</b> pero responder "¿hay arista?" es <b>O(1)</b>. Buena para grafos densos.</p>' +
          '<p><b>Lista de adyacencia</b>: un diccionario <code>{vértice: [vecinos]}</code>. Ocupa <b>O(V + E)</b> y es la que se usa para DFS, BFS y Dijkstra. Buena para grafos dispersos.</p>',
        code: 'grafo = {\n    0: [1, 2],\n    1: [0, 3, 4],\n    2: [0],\n    3: [1],\n    4: [1],\n}\n\n# matriz de adyacencia\nn = len(grafo)\nmatriz = [[0]*n for _ in range(n)]\nfor v in grafo:\n    for w in grafo[v]:\n        matriz[v][w] = 1'
      },
      {
        h: 'DFS y BFS',
        html: '<p><b>DFS</b> (<i>Depth First Search</i>, búsqueda en profundidad) usa una <b>pila</b>: visita un vértice y se sumerge por la primera arista que encuentra. Recorre "hacia abajo" y en un grafo con ciclos necesita una marca de visitados.</p>' +
          '<p><b>BFS</b> (<i>Breadth First Search</i>) usa una <b>cola</b>: visita todos los vértices a distancia 1, después los de distancia 2, y así. Sirve para encontrar el <b>camino mínimo en número de aristas</b>.</p>' +
          '<p>Ambos tienen costo <b>O(V + E)</b>: se ve cada vértice una vez y cada arista dos veces. DFS puede implementarse también con <b>recursión</b>, que ya es una pila implícita.</p>' +
          '<p>Los <b>algoritmos de walks de Hamilton</b> y los problemas de grafos Hamiltonianos son NP-completos: no se conoce un algoritmo que los resuelva eficientemente.</p>',
        code: 'def bfs(grafo, origen):\n    visitados = {origen}\n    cola = [origen]\n    orden = []\n    while cola:\n        v = cola.pop(0)\n        orden.append(v)\n        for w in grafo[v]:\n            if w not in visitados:\n                visitados.add(w)\n                cola.append(w)\n    return orden\n\ndef dfs(grafo, origen, visitados=None):\n    if visitados is None:\n        visitados = set()\n    visitados.add(origen)\n    resultado = [origen]\n    for w in grafo[origen]:\n        if w not in visitados:\n            resultado += dfs(grafo, w, visitados)\n    return resultado'
      },
      {
        h: 'Dijkstra y caminos mínimos',
        html: '<p>Cuando las aristas tienen <b>pesos no negativos</b>, <b>Dijkstra</b> encuentra el camino más corto desde un origen a todos los vértices. Usa una <b>cola de prioridad</b> (heap):</p>' +
          '<ol><li>La distancia del origen es 0; las de los demás, infinito.</li>' +
          '<li>Se saca de la cola el vértice con <b>menor distancia provisional</b> y se marca <b>visitado</b>: su camino ya es definitivo.</li>' +
          '<li>Se <b>relajan</b> sus aristas: si llegar por él mejora la distancia de un vecino, se actualiza.</li></ol>' +
          '<p>Costo: <b>O(E log V)</b> con heap. <b>No funciona con pesos negativos</b> (para eso está Bellman-Ford).</p>' +
          '<p>Si todas las aristas valen 1, <b>BFS ya da el camino mínimo</b>: no hace falta Dijkstra.</p>',
        code: 'import heapq\n\ndef dijkstra(grafo, origen):\n    dist = {v: float("inf") for v in grafo}\n    dist[origen] = 0\n    cola = [(0, origen)]\n    while cola:\n        d, v = heapq.heappop(cola)\n        if d > dist[v]:        # entrada vieja\n            continue\n        for w, peso in grafo[v]:\n            if d + peso < dist[w]:\n                dist[w] = d + peso\n                heapq.heappush(cola, (dist[w], w))\n    return dist'
      },
      {
        h: 'Grafos en la vida real',
        html: '<ul>' +
          '<li><b>Redes sociales</b>: quién es amigo de quién (no dirigido).</li>' +
          '<li><b>Web</b>: páginas y links (dirigido, con pesos).</li>' +
          '<li><b>Mapa / GPS</b>: caminos mínimos (Dijkstra) y <b>A*</b>.</li>' +
          '<li><b>Dependencias</b> de paquetes: orden topológico para instalar.</li>' +
          '<li><b>Estado de un autómata</b>: autómatas finitos y máquinas de Turing.</li></ul>'
      }
    ],
    archivos: [
      { t: 'Clase 11 — Grafos (PPTX)', f: 'slides/clase11_grafos.pptx' },
      { t: 'Código: grafo.py', f: 'codigo/grafo.py' }
    ],
    labs: [
      {
        title: 'Laboratorio — BFS y Dijkstra sobre una lista de adyacencia',
        enunciado: 'Con el grafo `{1: [(2,2),(3,4)], 2: [(3,1),(4,7)], 3: [(5,3)], 4: [(5,1)], 5: []}`, implementá `bfs(grafo, origen)` y `dijkstra(grafo, origen)` y compará los resultados.',
        starter: 'import heapq\n\ngrafo = {\n    1: [(2, 2), (3, 4)],\n    2: [(3, 1), (4, 7)],\n    3: [(5, 3)],\n    4: [(5, 1)],\n    5: [],\n}\n\ndef bfs(grafo, origen):\n    """Orden de visita por niveles"""\n    pass\n\ndef dijkstra(grafo, origen):\n    """Diccionario nodo -> distancia mínima"""\n    pass\n\nprint(bfs(grafo, 1))            # [1, 2, 3, 4, 5]\nprint(dijkstra(grafo, 1))       # {1: 0, 2: 2, 3: 3, 4: 9, 5: 6}\n',
        solution: 'import heapq\n\ngrafo = {\n    1: [(2, 2), (3, 4)],\n    2: [(3, 1), (4, 7)],\n    3: [(5, 3)],\n    4: [(5, 1)],\n    5: [],\n}\n\n\ndef bfs(grafo, origen):\n    """Orden de visita por niveles, usando una cola."""\n    visitados = {origen}\n    orden = [origen]\n    cola = [origen]\n    while cola:\n        v = cola.pop(0)\n        for w, _ in grafo.get(v, []):\n            if w not in visitados:\n                visitados.add(w)\n                orden.append(w)\n                cola.append(w)\n    return orden\n\n\ndef dijkstra(grafo, origen):\n    """Diccionario nodo -> distancia minima, con heap y relaxation."""\n    dist = {origen: 0}\n    pendientes = [(0, origen)]\n    while pendientes:\n        d, v = heapq.heappop(pendientes)\n        if d > dist.get(v, float("inf")):\n            continue\n        for w, peso in grafo.get(v, []):\n            nuevo = d + peso\n            if nuevo < dist.get(w, float("inf")):\n                dist[w] = nuevo\n                heapq.heappush(pendientes, (nuevo, w))\n    return dist\n\n\nprint(bfs(grafo, 1))\nprint(dijkstra(grafo, 1))\n',
        solutionExp: '<p>BFS usa una <b>cola</b> y por eso sale por niveles. Dijkstra usa un <b>heap de prioridad</b>: saca siempre el vértice con la distancia tentatively mínima y <i>relaja</i> cada arista. Ojo con el nodo 5: por el 3 directo cuesta 7, pero ir 1→2→3→5 cuesta 6, y ese es el camino más barato.</p>',
        tests: [
          { name: 'BFS visita en orden de niveles', code: 'assert bfs(grafo,1)==[1,2,3,4,5]' },
          { name: 'Dijkstra: distancia al nodo 2 es 2', code: 'assert dijkstra(grafo,1)[2]==2' },
          { name: 'Dijkstra: al 3 se llega por el 2 (peso 1)', code: 'assert dijkstra(grafo,1)[3]==3' },
          { name: 'Dijkstra: al 5 el camino más barato es 1→2→3→5 = 6', code: 'assert dijkstra(grafo,1)[5]==6' },
          { name: 'Dijkstra: el origen queda en 0', code: 'assert dijkstra(grafo,1)[1]==0' }
        ]
      }
    ],
    viz: [{ key: 'grafo', label: 'Grafos: DFS, BFS y Dijkstra' }, { key: 'adyacencia', label: 'Matriz vs. lista de adyacencia' }],
    tp: 'tp4'
  },

  /* ============================ UNIDAD 8 ============================ */
  {
    id: 'u8', num: 8, icon: '⇉', title: 'Algoritmos de recorrido',
    resumen: 'Recorrer estructuras en profundidad y a lo ancho: DFS y BFS sobre listas enlazadas, árboles y grafos.',
    objetivos: [
      'Distinguir recorrido en profundidad (pila) de recorrido en anchura (cola).',
      'Implementar DFS y BFS con y sin recursión, y ver el orden en que se visita cada nodo.',
      'Aplicar recorrido en profundidad a árboles binarios y rboles generales.',
      'Reconstruir el camino recorrido con padres y marcas de tiempo.'
    ],
    secciones: [
      {
        h: 'Recorrer no es lo mismo que buscar',
        html: '<p>Un <b>recorrido</b> (<i>traversal</i>) visita <b>todos</b> los nodos alcanzables desde un inicio. Una <b>búsqueda</b> (<i>search</i>) intenta encontrar <b>uno</b> concreto y puede terminar antes.</p>' +
          '<p>Los dos recorridos universales usan una estructura auxiliar para decidir <b>qué procesar después</b>, y esa estructura es toda la diferencia:</p>' +
          '<ul>' +
          '<li><b>DFS</b> (<i>Depth First Search</i>): <b>pila</b> (LIFO). Se sumerge por la primera rama hasta el fondo y después retrocede.</li>' +
          '<li><b>BFS</b> (<i>Breadth First Search</i>): <b>cola</b> (FIFO). Termina una distancia completa antes de pasar a la siguiente.</li>' +
          '</ul>' +
          '<p>Regla mental: <b>si querés el camino con menos saltos, BFS; si querés exhaustivo un camino entero, DFS</b>.</p>'
      },
      {
        h: 'DFS: la pila implícita de la recursión',
        html: '<p>DFS se puede escribir de dos formas equivalentes. La <b>recursiva</b> usa la <i>pila de llamadas</i> gratis: cada llamada es un marco pendiente, y el <code>return</code> es el retroceso (<i>backtracking</i>).</p>' +
          '<p>La <b>iterativa</b> hace el mismo recorrido con una pila explícita. Es la misma idea con la estructura a la vista, y evita el límite de recursión de Python (~1000 niveles).</p>' +
          '<p>Orden de la versión iterativa: al apilar todos los vecinos de golpe, el <b>último</b> agregado es el primero que se visita. Para obtener el mismo orden que la versión recursiva hay que apilar los vecinos <b>en orden inverso</b>.</p>',
        code: '# Recursivo: la pila de llamadas hace de pila\ndef dfs(grafo, inicio, vistos=None):\n    if vistos is None:\n        vistos = set()\n    vistos.add(inicio)\n    orden = [inicio]\n    for w in grafo[inicio]:\n        if w not in vistos:\n            orden += dfs(grafo, w, vistos)\n    return orden\n\n# Iterativo: pila explícita, vecinos en orden inverso\ndef dfs_iter(grafo, inicio):\n    pila = [inicio]\n    vistos = set()\n    orden = []\n    while pila:\n        v = pila.pop()\n        if v in vistos:\n            continue\n        vistos.add(v)\n        orden.append(v)\n        for w in reversed(grafo[v]):\n            if w not in vistos:\n                pila.append(w)\n    return orden'
      },
      {
        h: 'BFS: la cola da el camino mínimo en saltos',
        html: '<p>BFS saca siempre el nodo <b>más viejo</b> de la cola. Como los nodos se ingresan por distancia creciente, cuando se visita un nodo su distancia ya es la mínima posible.</p>' +
          '<p>Por eso: <b>en un grafo no ponderado, el primer camino que BFS encuentra es un camino mínimo en número de aristas</b>. Si las aristas tienen pesos, BFS ya no sirve (ver Dijkstra, U7).</p>' +
          '<p>Se puede <b>reconstruir el camino</b> guardando el <b>padre</b> de cada nodo al descubrirlo, y luego siguiendo los padres hacia atrás.</p>',
        code: 'from collections import deque\n\ndef bfs_camino(grafo, inicio, destino):\n    padre = {inicio: None}\n    cola = deque([inicio])\n    while cola:\n        v = cola.popleft()\n        if v == destino:\n            break\n        for w in grafo[v]:\n            if w not in padre:      # "padre" tambien hace de marca de visitado\n                padre[w] = v\n                cola.append(w)\n    if destino not in padre:\n        return None, []            # no hay camino\n    camino = []\n    v = destino\n    while v is not None:\n        camino.append(v)\n        v = padre[v]\n    return camino[::-1], padre'
      },
      {
        h: 'DFS y BFS sobre un árbol binario',
        html: '<p>En un <b>árbol</b> (que es un grafo conexo y acíclico) los recorridos se simplifican porque no hay ciclos: alcanza con mirar el subárbol izquierdo y el derecho.</p>' +
          '<ul>' +
          '<li><b>Preorden</b> (DFS): raíz, izquierda, derecha. Serializa el árbol de forma única.</li>' +
          '<li><b>Inorden</b> (DFS): izquierda, raíz, derecha. En un <b>BST</b> entrega los datos <b>ordenados</b>: es la base de una búsqueda en O(n) sin comparaciones.</li>' +
          '<li><b>Postorden</b> (DFS): izquierda, derecha, raíz. Permite liberar o colapsar el árbol de abajo hacia arriba.</li>' +
          '<li><b>Por niveles</b> (BFS): todos los de profundidad 0, después los de profundidad 1... Da la altura mínima y el orden de la <b>vista por niveles</b>.</li>' +
          '</ul>' +
          '<p>Ambos son <b>O(n)</b>: cada nodo se visita una sola vez.</p>',
        code: 'def preorden(nodo):\n    if nodo is None:\n        return []\n    return [nodo.dato] + preorden(nodo.izq) + preorden(nodo.der)\n\ndef inorden(nodo):\n    if nodo is None:\n        return []\n    return inorden(nodo.izq) + [nodo.dato] + inorden(nodo.der)\n\ndef por_niveles(raiz):\n    if raiz is None:\n        return []\n    niveles, cola = [], deque([raiz])\n    while cola:\n        tam = len(cola)          # froze el nivel actual\n        niveles.append([])\n        for _ in range(tam):\n            n = cola.popleft()\n            niveles[-1].append(n.dato)\n            for h in (n.izq, n.der):\n                if h is not None:\n                    cola.append(h)\n    return niveles'
      },
      {
        h: 'Recorridos en otros TAD y en la vida real',
        html: '<ul>' +
          '<li><b>Lista enlazada</b>: es lineal, no hay decisión que tomar. <b>DFS</b> recorre de cabeza a cola; el recorrido inverso (de cola a cabeza) es <b>BFS</b> con una pila.</li>' +
          '<li><b>Árbol general</b>: el recorrido es <b>en anchura</b> (BFS) usando la <b>cola de hermanos</b> del nodo, que ya es una cola.</li>' +
          '<li><b>Problemas de laberinto</b>: DFS para <i>backtracking</i>, BFS para el camino más corto.</li>' +
          '<li><b>Dependencias de paquetes</b>, <b>sistemas de archivos</b> (recorrer carpetas) y <b>crawlers</b>: DFS con pila explícita, que no se desborda.</li>' +
          '<li><b>Ciclos</b>: en un grafo con ciclos, la marca de visitados es <b>obligatoria</b>; sin ella DFS y BFS no terminan nunca.</li>' +
          '</ul>'
      }
    ],
    archivos: [
      { t: 'Clase 12 — Algoritmos de recorrido (PDF)', f: 'slides/clase12_algoritmos_recorrido.pdf' },
      { t: 'Apunte: DFS & BFS (PDF)', f: 'apuntes/u7_dfs_bfs.pdf' },
      { t: 'Código: grafo.py', f: 'codigo/grafo.py' }
    ],
    labs: [
      {
        title: 'Laboratorio — DFS, BFS y reconstrucción del camino',
        enunciado: 'Con el grafo `{0:[1,2], 1:[0,3], 2:[0,3,4], 3:[1,2], 4:[2]}` implementá `dfs(grafo, inicio)`, `bfs(grafo, inicio)` y `camino(grafo, inicio, destino)` (devuelve la lista de vértices del camino mínimo en saltos, o `None` si no existe).',
        starter: 'from collections import deque\n\ngrafo = {\n    0: [1, 2],\n    1: [0, 3],\n    2: [0, 3, 4],\n    3: [1, 2],\n    4: [2],\n}\n\ndef dfs(grafo, inicio):\n    """Orden de visita en profundidad"""\n    pass\n\ndef bfs(grafo, inicio):\n    """Orden de visita en anchura (por niveles)"""\n    pass\n\ndef camino(grafo, inicio, destino):\n    """Camino con menos aristas de inicio a destino, o None"""\n    pass\n\nprint(dfs(grafo, 0))          # [0, 1, 3, 2, 4]\nprint(bfs(grafo, 0))          # [0, 1, 2, 3, 4]\nprint(camino(grafo, 0, 4))     # [0, 2, 4]\n',
        solution: 'from collections import deque\n\ngrafo = {\n    0: [1, 2],\n    1: [0, 3],\n    2: [0, 3, 4],\n    3: [1, 2],\n    4: [2],\n}\n\n\ndef dfs(grafo, inicio):\n    """DFS iterativo con pila explicita y vecinos en orden inverso."""\n    pila = [inicio]\n    vistos = set()\n    orden = []\n    while pila:\n        v = pila.pop()\n        if v in vistos:\n            continue\n        vistos.add(v)\n        orden.append(v)\n        for w in reversed(grafo.get(v, [])):\n            if w not in vistos:\n                pila.append(w)\n    return orden\n\n\ndef bfs(grafo, inicio):\n    """BFS con cola: los nodos salen por distancia creciente."""\n    cola = deque([inicio])\n    vistos = {inicio}\n    orden = []\n    while cola:\n        v = cola.popleft()\n        orden.append(v)\n        for w in grafo.get(v, []):\n            if w not in vistos:\n                vistos.add(w)\n                cola.append(w)\n    return orden\n\n\ndef camino(grafo, inicio, destino):\n    """BFS guardando el padre de cada nodo al descubrirlo."""\n    if inicio not in grafo:\n        return None\n    padre = {inicio: None}\n    cola = deque([inicio])\n    while cola:\n        v = cola.popleft()\n        if v == destino:\n            break\n        for w in grafo.get(v, []):\n            if w not in padre:\n                padre[w] = v\n                cola.append(w)\n    if destino not in padre:\n        return None\n    camino = []\n    v = destino\n    while v is not None:\n        camino.append(v)\n        v = padre[v]\n    camino.reverse()\n    return camino\n\n\nprint(dfs(grafo, 0))\nprint(bfs(grafo, 0))\nprint(camino(grafo, 0, 4))\n',
        solutionExp: '<p>El detalle que suele fallar es el <b>orden de los vecinos</b>: si apilás los vecinos en orden normal, la versión iterativa visita el último primero y no coincide con la recursiva. Por eso el <code>reversed(...)</code>.</p><p>En <code>camino</code> el diccionario <code>padre</code> cumple doble función: guarda de quién se descubrió cada nodo <b>y</b> marca de visitado. Reconstruir es seguir los padres hacia atrás y dar vuelta la lista.</p>',
        tests: [
          { name: 'DFS visita los 5 vértices', code: 'r=dfs(grafo,0)\nassert sorted(r)==[0,1,2,3,4] and len(r)==5' },
          { name: 'DFS empieza por el origen y no se repite', code: 'r=dfs(grafo,0)\nassert r[0]==0 and len(set(r))==len(r)' },
          { name: 'BFS sale por niveles', code: 'assert bfs(grafo,0)==[0,1,2,3,4]' },
          { name: 'BFS también visita los 5 vértices', code: 'r=bfs(grafo,0)\nassert sorted(r)==[0,1,2,3,4] and len(r)==5' },
          { name: 'DFS y BFS dan ordenes distintos', code: 'assert dfs(grafo,0)!=bfs(grafo,0)' },
          { name: 'camino 0→4 son 2 saltos', code: 'assert camino(grafo,0,4)==[0,2,4]' },
          { name: 'camino a sí mismo es un solo vértice', code: 'assert camino(grafo,0,0)==[0]' },
          { name: 'sin camino devuelve None', code: 'assert camino(grafo,3,4) is None or camino(grafo,3,4)==[3,2,4]' },
          { name: 'camino es una cadena válida de aristas', code: 'c=camino(grafo,0,4)\nassert c is not None and all(y in grafo[x] for x,y in zip(c,c[1:]))' }
        ]
      },
      {
        title: 'Laboratorio — Recorridos de un árbol binario',
        enunciado: 'Implementá `preorden`, `inorden`, `postorden` y `por_niveles` para el árbol ya construido abajo. `inorden` sobre un BST debe devolver los valores ordenados de menor a mayor.',
        starter: 'from collections import deque\n\nclass Nodo:\n    def __init__(self, dato, izq=None, der=None):\n        self.dato = dato\n        self.izq = izq\n        self.der = der\n\n#   50\n#  /  \\\n# 30   70\n# / \\   /\n#20 40 60\nraiz = Nodo(50, Nodo(30, Nodo(20), Nodo(40)), Nodo(70, Nodo(60)))\n\ndef preorden(nodo):\n    pass\n\ndef inorden(nodo):\n    pass\n\ndef postorden(nodo):\n    pass\n\ndef por_niveles(raiz):\n    pass\n\nprint(preorden(raiz))       # [50, 30, 20, 40, 70, 60]\nprint(inorden(raiz))        # [20, 30, 40, 50, 60, 70]\nprint(postorden(raiz))      # [20, 40, 30, 60, 70, 50]\nprint(por_niveles(raiz))    # [[50], [30, 70], [20, 40, 60]]\n',
        solution: 'from collections import deque\n\n\nclass Nodo:\n    def __init__(self, dato, izq=None, der=None):\n        self.dato = dato\n        self.izq = izq\n        self.der = der\n\n\nraiz = Nodo(50, Nodo(30, Nodo(20), Nodo(40)), Nodo(70, Nodo(60)))\n\n\ndef preorden(nodo):\n    """Raiz, izquierda, derecha."""\n    if nodo is None:\n        return []\n    return [nodo.dato] + preorden(nodo.izq) + preorden(nodo.der)\n\n\ndef inorden(nodo):\n    """Izquierda, raiz, derecha: en un BST sale ordenado."""\n    if nodo is None:\n        return []\n    return inorden(nodo.izq) + [nodo.dato] + inorden(nodo.der)\n\n\ndef postorden(nodo):\n    """Izquierda, derecha, raiz: se resuelve de abajo hacia arriba."""\n    if nodo is None:\n        return []\n    return postorden(nodo.izq) + postorden(nodo.der) + [nodo.dato]\n\n\ndef por_niveles(raiz):\n    """BFS: una lista por profundidad."""\n    if raiz is None:\n        return []\n    niveles = []\n    cola = deque([raiz])\n    while cola:\n        tam = len(cola)\n        nivel = []\n        for _ in range(tam):\n            n = cola.popleft()\n            nivel.append(n.dato)\n            for h in (n.izq, n.der):\n                if h is not None:\n                    cola.append(h)\n        niveles.append(nivel)\n    return niveles\n\n\nprint(preorden(raiz))\nprint(inorden(raiz))\nprint(postorden(raiz))\nprint(por_niveles(raiz))\n',
        solutionExp: '<p>Los tres recorridos en DFS se distinguen <b>solo por dónde va la raíz</b> en la concatenación: primero (preorden), en el medio (inorden), al final (postorden).</p><p>El resultado clave de la unidad: <code>inorden</code> de un BST da la secuencia <b>ordenada</b>, y en <code>por_niveles</code> hay que <b>congelar</b> <code>len(cola)</code> antes del bucle interno, porque la cola sigue creciendo mientras se la recorre.</p>',
        tests: [
          { name: 'preorden: raíz, izquierda, derecha', code: 'assert preorden(raiz)==[50,30,20,40,70,60]' },
          { name: 'inorden devuelve los valores ordenados (BST)', code: 'assert inorden(raiz)==[20,30,40,50,60,70]' },
          { name: 'inorden es lo inverso de preorden en este árbol', code: 'assert sorted(inorden(raiz))==sorted(preorden(raiz))' },
          { name: 'postorden: la raíz es el último', code: 'assert postorden(raiz)==[20,40,30,60,70,50]' },
          { name: 'postorden termina en la raíz', code: 'r=postorden(raiz)\nassert r[-1]==raiz.dato' },
          { name: 'por niveles: 3 niveles', code: 'assert por_niveles(raiz)==[[50],[30,70],[20,40,60]]' },
          { name: 'la suma de niveles es la cantidad de nodos', code: 'n=sum(len(x) for x in por_niveles(raiz))\nassert n==6' },
          { name: 'árbol vacío devuelve listas vacías', code: 'assert preorden(None)==[] and inorden(None)==[] and postorden(None)==[] and por_niveles(None)==[]' },
          { name: 'un solo nodo', code: 'u=Nodo(1)\nassert preorden(u)==[1] and inorden(u)==[1] and postorden(u)==[1] and por_niveles(u)==[[1]]' }
        ]
      }
    ],
    viz: [{ key: 'recursividad', label: 'Recursión paso a paso' }, { key: 'grafo', label: 'Grafos: DFS, BFS y Dijkstra' }],
    tp: 'tp4'
  },

  /* ============================ UNIDAD 9 ============================ */
  {
    id: 'u9', num: 9, icon: '⇅', title: 'Ordenamiento',
    resumen: 'Ordenar colecciones: selección, inserción, merge sort, quicksort y el costo detrás de cada estrategia.',
    objetivos: [
      'Implementar ordenamientos cuadráticos (burbujeo, selección, inserción) y medir su costo.',
      'Explicar por qué los ordenamientos por división y conquista bajan a O(n log n).',
      'Implementar merge sort y quicksort, y decir cuándo conviene cada uno.',
      'Analizar la estabilidad de un algoritmo y sus efectos.'
    ],
    secciones: [
      {
        h: 'Qué significa "ordenar" y por qué no alcanza con sort()',
        html: '<p><b>Ordenar</b> es reorganizar los elementos de una secuencia para que queden en <b>orden creciente o decreciente</b>, según un <b>criterio de comparación</b>.</p>' +
          '<p>En Python, <code>sorted()</code> y <code>lista.sort()</code> ya lo hacen, y usan <b>Timsort</b>: O(n log n) en el peor caso, <b>estable</b> y muy rápido con datos parcialmente ordenados. En la cursada hay que <b>escribir los algoritmos a mano</b> para entender qué hay detrás.</p>' +
          '<p>Dos conceptos que aparecen siempre:</p>' +
          '<ul>' +
          '<li><b>En el lugar (<i>in place</i>)</b>: no usa memoria auxiliar extra proporcional a n. Merge sort <b>no</b> lo es; los tres cuadráticos y quicksort sí.</li>' +
          '<li><b>Estabilidad</b>: un algoritmo es <b>estable</b> si mantiene el orden relativo de los elementos que se consideran iguales. Importa cuando el criterio no es una clave única (ordenar alumnos por apellido y después por nota).</li>' +
          '</ul>'
      },
      {
        h: 'Los tres cuadráticos',
        html: '<p>Ordenan con dos bucles anidados: comparan cada elemento contra muchos otros. Todos son O(n²) en el peor caso, pero se diferencian en la cantidad de comparaciones y en si son estables.</p>' +
          '<table><tr><th>Algoritmo</th><th>Idea</th><th>Comparaciones (peor)</th><th>Intercambios</th><th>Estable</th><th>Mejor caso</th></tr>' +
          '<tr><td>Burbujeo</td><td>Compara e intercambia vecinos contiguos; cada pasada lleva el máximo al final</td><td>O(n²)</td><td>O(n²)</td><td>Sí</td><td>O(n) con bandera</td></tr>' +
          '<tr><td>Selección</td><td>En cada pasada busca el mínimo de lo que falta y lo coloca</td><td>O(n²) siempre</td><td>O(n) — mucho menos</td><td>No</td><td>O(n²)</td></tr>' +
          '<tr><td>Inserción</td><td>Inserta cada elemento en su lugar dentro del prefijo ya ordenado</td><td>O(n²)</td><td>O(n²)</td><td>Sí</td><td>O(n)</td></tr></table>' +
          '<p><b>Cuándo brilla la inserción</b>: cuando la lista ya está casi ordenada. Por eso Timsort la usa como base: ordenar datos reales (casi ordenados) cuesta O(n).</p>',
        code: 'def insercion(a):\n    """Estable: nunca mueve un elemento mas alla de los iguales."""\n    for i in range(1, len(a)):\n        j = i\n        while j > 0 and a[j] < a[j - 1]:\n            a[j], a[j - 1] = a[j - 1], a[j]\n            j -= 1\n    return a\n\ndef seleccion(a):\n    """Solo O(n) intercambios, pero NO es estable."""\n    for i in range(len(a)):\n        m = i\n        for j in range(i + 1, len(a)):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a\n\ndef burbujeo(a):\n    """Estable. La bandera corta cuando ya no hubo intercambios."""\n    for i in range(len(a) - 1):\n        hubo = False\n        for j in range(len(a) - 1 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                hubo = True\n        if not hubo:\n            break\n    return a'
      },
      {
        h: 'División y conquista: merge sort',
        html: '<p><b>Merge sort</b> parte el problema en dos, ordena cada mitad y las <b>combina</b> (merge) en forma ordenada.</p>' +
          '<ol>' +
          '<li>Si la lista tiene 0 o 1 elementos, ya está ordenada.</li>' +
          '<li>Se divide por la mitad: <b>log₂n</b> niveles hasta llegar a listas de 1.</li>' +
          '<li>Se ordenan recursivamente las dos mitades.</li>' +
          '<li>Se <b>intercalan</b>: dos punteros recorren ambas mitades y van dejando el menor disponible. Es <b>O(n)</b> y es <b>estable</b>.</li>' +
          '</ol>' +
          '<p>El costo sale de multiplicar: <b>O(log n)</b> niveles por <b>O(n)</b> por nivel = <b>O(n log n)</b> <b>siempre</b>, incluso en el peor caso y sin importar el orden inicial.</p>' +
          '<p>Su punto débil: necesita un <b>arreglo auxiliar de O(n)</b>, así que <b>no</b> es in place. En Python se resuelve con slicing y concatenación, que crea listas nuevas.</p>',
        code: 'def merge_sort(a):\n    """O(n log n) siempre, estable, NO in place."""\n    if len(a) <= 1:\n        return list(a)\n    medio = len(a) // 2\n    izq = merge_sort(a[:medio])\n    der = merge_sort(a[medio:])\n    return merge(izq, der)\n\ndef merge(izq, der):\n    """Intercala dos listas ordenadas. Estable: ante empate gana la izquierda."""\n    salida = []\n    i = j = 0\n    while i < len(izq) and j < len(der):\n        if izq[i] <= der[j]:     # <= y no <: asi se conserva el orden relativo\n            salida.append(izq[i])\n            i += 1\n        else:\n            salida.append(der[j])\n            j += 1\n    salida.extend(izq[i:])\n    salida.extend(der[j:])\n    return salida'
      },
      {
        h: 'Quicksort y el particionado',
        html: '<p><b>Quicksort</b> también divide y conquista, pero <b>no necesita memoria auxiliar</b>: ordena los subproblemas <b>en el mismo arreglo</b>.</p>' +
          '<ol>' +
          '<li>Se elige un <b>pivote</b>. Si se elige <b>siempre el primero</b> y el arreglo ya está ordenado, el pivote es el menor y cada partición deja una mitad vacía: O(n²). Ese es su peor caso.</li>' +
          '<li>Se <b>particiona</b>: todo lo menor que el pivote a la izquierda, todo lo mayor a la derecha. Esa partición es <b>O(n)</b> y ocurre <b>una sola vez</b>, sin arrays extra.</li>' +
          '<li>Se repite sobre cada mitad. Con un pivote razonable el promedio es <b>O(n log n)</b>.</li>' +
          '</ol>' +
          '<p><b>Quicksort no es estable</b>: el particionado reordena elementos iguales entre sí.</p>' +
          '<p><b>Elección del pivote</b>: usar el primero es rápido pero frágil. La mediana de tres o el pivote <b>aleatorio</b> hacen el peor caso muy improbable.</p>',
        code: 'import random\n\ndef quicksort(a, lo=0, hi=None):\n    """In place. Pivote aleatorio: evita el peor caso de forma aleatoria."""\n    if hi is None:\n        hi = len(a) - 1\n    if lo >= hi:\n        return a\n    p = random.randint(lo, hi)\n    a[lo], a[p] = a[p], a[lo]\n    pivote = a[lo]\n    i = lo\n    for j in range(lo + 1, hi + 1):\n        if a[j] < pivote:\n            i += 1\n            a[i], a[j] = a[j], a[i]\n    a[lo], a[i] = a[i], a[lo]\n    quicksort(a, lo, i - 1)\n    quicksort(a, i + 1, hi)\n    return a'
      },
      {
        h: 'Comparación y guía de elección',
        html: '<table><tr><th>Algoritmo</th><th>Mejor</th><th>Promedio</th><th>Peor</th><th>Memoria</th><th>Estable</th></tr>' +
          '<tr><td>Burbujeo</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>Sí</td></tr>' +
          '<tr><td>Selección</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>No</td></tr>' +
          '<tr><td>Inserción</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>Sí</td></tr>' +
          '<tr><td>Merge sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Sí</td></tr>' +
          '<tr><td>Quicksort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) pila</td><td>No</td></tr>' +
          '<tr><td>Timsort (<code>sorted()</code>)</td><td>O(n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Sí</td></tr></table>' +
          '<p><b>Guía rápida</b>:</p>' +
          '<ul>' +
          '<li>Lista <b>casi ordenada</b> → inserción.</li>' +
          '<li>Se necesita <b>estabilidad</b> → merge sort (o Timsort).</li>' +
          '<li>Memoria <b>muy limitada</b> → quicksort o heapsort.</li>' +
          '<li>Datos <b>en disco</b> → heapsort, porque hace pocas escrituras.</li>' +
          '<li>En la práctica → <code>sorted()</code>.</li>' +
          '</ul>' +
          '<p><b>Costo de comparar claves:</b> si comparar dos elementos cuesta c, todas las cotas de arriba se multiplican por c. Con claves largas (comparar strings) ese término pesa.</p>',
        code: 'import random, time\n\ndatos = [random.randint(0, 100000) for _ in range(20000)]\n\nt = time.perf_counter(); burbujeo(list(datos)); print("burbujeo", round(time.perf_counter()-t, 3), "s")\nt = time.perf_counter(); sorted(datos);            print("sorted ", round(time.perf_counter()-t, 3), "s")'
      },
      {
        h: 'Ordenar estructuras propias',
        html: '<p>Cuando el TAD es propio, "ordenar" es <b>insertar en el lugar correcto</b> en vez de reordenar todo:</p>' +
          '<ul>' +
          '<li><b>Lista enlazada</b>: se recorre hasta el nodo que corresponde e se inserta. Insertar es <b>O(n)</b> (el recorrido) y no hay que mover nada.</li>' +
          '<li><b>Lista doble</b>: como tiene <code>ant</code>, se llega al nodo anterior en <b>O(1)</b> y se inserta en <b>O(1)</b> una vez que se está.</li>' +
          '<li><b>BST</b>: insertar ya deja el árbol <b>ordenado</b> en <b>O(h)</b>, donde h es la altura.</li>' +
          '<li><b>AVL</b>: además mantiene h = O(log n) con rotaciones, así que insertar sigue siendo O(log n) garantizado.</li>' +
          '</ul>' +
          '<p>En un BST, el <b>inorden</b> da la secuencia ordenada sin ordenar nada: ya está implícita en la estructura.</p>'
      }
    ],
    archivos: [
      { t: 'Clase 13 — Ordenamiento (PDF)', f: 'slides/clase13_ordenamiento.pdf' },
      { t: 'TP 4 resuelto (PDF)', f: 'slides/tp4_resuelto.pdf' }
    ],
    labs: [
      {
        title: 'Laboratorio — Merge sort y quicksort contra el mismo caso',
        enunciado: 'Implementá `merge_sort(lista)` y `quicksort(lista)` y verificá que devuelven la lista ordenada, que quicksort ordena <b>en el lugar</b> (la misma lista queda ordenada) y que merge sort devuelve una lista nueva sin tocar el original.',
        starter: 'import random\n\ndef merge(izq, der):\n    """Intercala dos listas ya ordenadas"""\n    pass\n\ndef merge_sort(a):\n    """Devuelve una lista nueva ordenada. NO modifica a"""\n    pass\n\ndef quicksort(a, lo=0, hi=None):\n    """Ordena EN EL LUGAR y devuelve a"""\n    pass\n\ndatos = [5, 3, 8, 1, 9, 2, 7]\nprint(merge_sort(datos))\nprint(quicksort(list(datos)))\nprint(sorted(datos))\n',
        solution: 'import random\n\n\ndef merge(izq, der):\n    """Intercala dos listas ordenadas. Estable: ante empate sale primero izq."""\n    salida = []\n    i = j = 0\n    while i < len(izq) and j < len(der):\n        if izq[i] <= der[j]:\n            salida.append(izq[i])\n            i += 1\n        else:\n            salida.append(der[j])\n            j += 1\n    salida.extend(izq[i:])\n    salida.extend(der[j:])\n    return salida\n\n\ndef merge_sort(a):\n    """Divide, ordena cada mitad y combina. Devuelve una lista nueva."""\n    if len(a) <= 1:\n        return list(a)\n    medio = len(a) // 2\n    return merge(merge_sort(a[:medio]), merge_sort(a[medio:]))\n\n\ndef quicksort(a, lo=0, hi=None):\n    """Particion en el lugar. Pivote aleatorio para no degradar a O(n^2)."""\n    if hi is None:\n        hi = len(a) - 1\n    if lo >= hi:\n        return a\n    p = random.randint(lo, hi)\n    a[lo], a[p] = a[p], a[lo]\n    pivote = a[lo]\n    i = lo\n    for j in range(lo + 1, hi + 1):\n        if a[j] < pivote:\n            i += 1\n            a[i], a[j] = a[j], a[i]\n    a[lo], a[i] = a[i], a[lo]\n    quicksort(a, lo, i - 1)\n    quicksort(a, i + 1, hi)\n    return a\n\n\ndatos = [5, 3, 8, 1, 9, 2, 7]\nprint(merge_sort(datos))\nprint(quicksort(list(datos)))\nprint(sorted(datos))\n',
        solutionExp: '<p>La diferencia importante entre los dos: <code>merge_sort</code> <b>devuelve una lista nueva</b> (necesita <code>O(n)</code> de memoria auxiliar para intercalar) mientras que <code>quicksort</code> <b>ordena la lista recibida</b> y no usa memoria proporcional a n.</p><p>En <code>quicksort</code>, después de particionar, el pivote queda en su posición final; por eso se puede dejar fijo y seguir con los dos tramos. Si el pivote fuera siempre el primero y el arreglo ya estuviera ordenado, cada partición dejaría una mitad vacía y el costo sería O(n²).</p>',
        tests: [
          { name: 'merge sort ordena correctamente', code: 'assert merge_sort([5,3,8,1,9,2,7])==[1,2,3,5,7,8,9]' },
          { name: 'quicksort ordena correctamente', code: 'assert quicksort([5,3,8,1,9,2,7])==[1,2,3,5,7,8,9]' },
          { name: 'quicksort ordena EN EL LUGAR (misma lista)', code: 'a=[5,3,8,1]\nquicksort(a)\nassert a==[1,3,5,8]' },
          { name: 'merge sort NO modifica la lista original', code: 'a=[5,3,8,1]\nmerge_sort(a)\nassert a==[5,3,8,1]' },
          { name: 'lista ya ordenada', code: 'assert merge_sort([1,2,3,4,5])==[1,2,3,4,5]\nassert quicksort([1,2,3,4,5])==[1,2,3,4,5]' },
          { name: 'lista al revés', code: 'assert merge_sort([5,4,3,2,1])==[1,2,3,4,5]\nassert quicksort([5,4,3,2,1])==[1,2,3,4,5]' },
          { name: 'casos borde: vacía, uno, dos', code: 'assert merge_sort([])==[] and merge_sort([7])==[7]\nassert quicksort([])==[] and quicksort([7])==[7]\nassert quicksort([2,1])==[1,2]' },
          { name: 'con duplicados', code: 'assert merge_sort([3,1,3,2,1])==[1,1,2,3,3]\nassert quicksort([3,1,3,2,1])==[1,1,2,3,3]' },
          { name: 'coincide con sorted() sobre 300 números al azar', code: 'import random as _r\nd=[_r.randint(0,50) for _ in range(300)]\nassert merge_sort(d)==sorted(d)\nassert quicksort(list(d))==sorted(d)' },
          { name: 'merge es estable: entre iguales sale primero el de la lista izquierda', code: 'class _E:\n    def __init__(s,k,n): s.k=k; s.n=n\n    def __le__(s,o): return s.k<=o.k\n    def __repr__(s): return str((s.k,s.n))\nr=merge([_E(3,"ana")],[_E(1,"bob"),_E(3,"carlos")])\nassert [x.n for x in r]==["bob","ana","carlos"]' },
          { name: 'merge entre dos listas de un solo elemento', code: 'assert merge([1],[2])==[1,2] and merge([2],[1])==[1,2]' }
        ]
      }
    ],
    viz: [{ key: 'ordenamiento', label: 'Ordenamientos paso a paso' }, { key: 'heap', label: 'Montículo / heapsort' }],
    tp: 'tp4'
  },

  /* ============================ UNIDAD 10 ============================ */
  {
    id: 'u10', num: 10, icon: '⌛', title: 'Problemas NP y camino mínimo',
    resumen: 'El problema del camino mínimo en general, por qué es intrínsecamente difícil y qué significa "NP".',
    objetivos: [
      'Formular el problema del camino mínimo y distinguir el camino minimo real de una heurística.',
      'Distinguir problemas P, NP, NP-completos y NP-difíciles.',
      'Reconocer NP-completos clásicos (viajante, Sudoku, coloreo) y sus reducciones.',
      'Explicar por qué los algoritmos de fuerza bruta son expoenenciales y cuándo son aceptables.'
    ],
    secciones: [
      {
        h: 'El problema del camino mínimo',
        html: '<p>Dado un grafo <b>dirigido</b> y ponderado (un ejemplo clásico: una tabla de distancias entre ciudades) se busca el camino más corto de un nodo origen a un destino.</p>' +
          '<p>El <b>camino mínimo</b> con pesos no negativos lo resuelve <b>Dijkstra</b> (U7) en O(E log V), y <b>Bellman-Ford</b> (abajo) lo resuelve en O(V·E) aunque haya pesos negativos. Ninguno de los dos es NP-difícil.</p>' +
          '<p>Lo que <b>sí</b> es NP-difícil (o al menos no se conoce solución polinomial) son las <b>variantes</b>:</p>' +
          '<ul>' +
          '<li><b>Camino mínimo simple más largo</b> (o ciclo más corto): con ciclos, el problema se vuelve NP-difícil.</li>' +
          '<li><b>Restricciones extra</b>: pasar por subconjuntos de nodos, evitar aristas,atisfacer cuotas.</li>' +
          '<li>En un grafo <b>no dirigido</b> con alguna arista de peso negativo hay <b>ciclo negativo</b>: el "camino más corto" se puede repetir indefinidamente y <b>no está definido</b>.</li>' +
          '</ul>' +
          '<p>En general, la estrategia es <b>Bellman-Ford</b>: relaja todas las aristas |V|−1 veces. Detecta ciclos negativos si en una pasada extra algo sigue improving. Su costo es <b>O(V·E)</b>.</p>',
        code: 'def bellman_ford(grafo, origen):\n    """Funciona con pesos negativos. Devuelve (distancias, hay_ciclo_negativo)."""\n    dist = {v: float("inf") for v in grafo}\n    dist[origen] = 0\n    aristas = [(u, v, p) for u in grafo for v, p in grafo[u]]\n    largo = len(grafo) - 1\n    for _ in range(largo):\n        cambio = False\n        for u, v, p in aristas:\n            if dist[u] != float("inf") and dist[u] + p < dist[v]:\n                dist[v] = dist[u] + p\n                cambio = True\n        if not cambio:\n            break\n    # Una pasada extra: si algo mejora, hay ciclo negativo\n    ciclo = any(dist[u] != float("inf") and dist[u] + p < dist[v] for u, v, p in aristas)\n    return dist, ciclo\n\n\n# No negados: Dijkstra es O(E log V), gana por lejos\n# Con negativos: Bellman-Ford, O(V * E)\n# Ciclo negativo: no hay camino mínimo definido (se puede repetir indefinidamente)'
      },
      {
        h: 'Qué significa NP',
        html: '<p>Aquí <b>NP</b> no es "no polinomial", sino <b>"tiempo polinomial no determinista"</b>: la clase de problemas cuya solución se puede <b>verificar</b> en tiempo polinomial.</p>' +
          '<table><tr><th>Clase</th><th>Significa</th><th>Ejemplo</th></tr>' +
          '<tr><td><b>P</b></td><td>Se puede <b>resolver</b> en tiempo polinomial</td><td>Ordenar, buscar en un BST, Dijkstra</td></tr>' +
          '<tr><td><b>NP</b></td><td>Se puede <b>verificar</b> en tiempo polinomial</td><td>Factorización, problema del camino más largo</td></tr>' +
          '<tr><td><b>NP-completo</b></td><td>Está en NP y es tan difícil como <b>todos</b> los de NP</td><td>Viajante, Sudoku, coloreo con 3 colores, SAT</td></tr>' +
          '<tr><td><b>NP-difícil</b></td><td>Al menos tan difícil como los NP-completos (no necesariamente en NP)</td><td>Optimización del problema del cli</td></tr></table>' +
          '<p><b>El gran misterio abierto</b>: <code>P = NP</code> o <code>P ≠ NP</code>. Si se probara que <code>P = NP</code>, la criptografía de clave pública se caería. Nadie lo ha logrado en décadas.</p>' +
          '<p><b>NP-completo en la práctica</b>: como muchos problemas reales se reducen a NP-completos, no tiene sentido buscar una solución exacta polinomial; se usan <b>heurísticas</b>.</p>'
      },
      {
        h: 'Reducción: la herramienta para demostrar NP-completos',
        html: '<p>Una <b>reducción</b> es una función que transforma cualquier instancia de un problema A en una instancia equivalente de un problema B, en tiempo polinomial. Si B ya es NP-completo, entonces A también lo es.</p>' +
          '<p>Es la forma de <b>sumar lo que ya se sabe</b>: el problema del camino más largo de una sola arista es NP-completo, y por reducción se prueba que casi todo lo interesante también lo es.</p>' +
          '<p><b>Probar que un problema es NP-difícil es mucho más fácil que probarlo NP-completo</b>: alcanza con reducir un NP-completo conocido a él.</p>'
      },
      {
        h: 'NP-completos clásicos',
        html: '<table><tr><th>Problema</th><th>Descripción</th><th>Costo de fuerza bruta</th></tr>' +
          '<tr><td><b>Viajante de salesman</b></td><td>Recorrer todas las ciudades con la menor distancia total</td><td>O(n!)</td></tr>' +
          '<tr><td><b>Problema del camino más largo</b></td><td>¿Hay un camino de largo ≥ k entre dos nodos?</td><td>O(n·m) por <i>k</i></td></tr>' +
          '<tr><td><b>SAT</b></td><td>¿Una fórmula booleana es satisfacible?</td><td>O(2<sup>n</sup>)</td></tr>' +
          '<tr><td><b>Sudoku</b></td><td>Completar la grilla respetando reglas</td><td>Espacial enorme</td></tr>' +
          '<tr><td><b>Coloreo</b></td><td>Colorear sin vecinos del mismo color (con 3, NP-completo)</td><td>O(3<sup>n</sup>)</td></tr>' +
          '<tr><td><b>Hamilton</b></td><td>¿Hay un recorrido que visite cada vértice una vez?</td><td>O(n!)</td></tr></table>' +
          '<p><b>La reducción del camino más largo a Hamilton</b>: si hubiera un algoritmo eficiente para Hamilton, se usaría su reverso para resolver el camino más largo. Por eso Hamilton es NP-completo.</p>'
      },
      {
        h: 'Heurísticas: cuando el exacto es imposible',
        html: '<p>En la práctica, las NP-completos se resuelven con métodos aproximados:</p>' +
          '<ul>' +
          '<li><b>Backtracking</b> (DFS): probar una decisión, si falla, deshacer. Poda cuando se detecta que no puede llegar a una solución.</li>' +
          '<li><b>Ramificar y podar</b> (branch and bound): explorar con un límite y cortar las ramas que no pueden mejorar el mejor resultado.</li>' +
          '<li><b>Programación dinámica</b>: memorizar subproblemas que se repiten. Ojo: no todos los NP-completos la admiten (el camino más largo no).</li>' +
          '<li><b>Algoritmos de aproximación</b>: Devuelven una solución dentro de un factor conocido del óptimo (el doble para el camino más largo).</li>' +
          '<li><b>Algoritmos metaheurísticos</b>:simulated annealing,hill climbing, algoritmos genéticos. Exploran sin garantía.</li>' +
          '</ul>' +
          '<p>El objetivo realista: <b>una solución suficientemente buena, rápido</b>.</p>'
      }
    ],
    archivos: [
      { t: 'Clase 14 — Problemas NP y camino mínimo (PDF)', f: 'slides/clase14_np_camino_minimo.pdf' }
    ],
    labs: [
      {
        title: 'Laboratorio — Bellman-Ford, ciclo negativo y rutas por fuerza bruta',
        enunciado: 'Implementá `bellman_ford(grafo, origen)` sobre una lista de adyacencia con pesos `(destino, peso)`: devuelve el diccionario de distancias y un booleano que indica si hay ciclo negativo. Después implementá `rutas(grafo, actual, destino)`, que cuenta cuántas <b>rutas simples</b> (sin repetir vértices) hay de `actual` a `destino`, usando backtracking. Contá las rutas de 0 a 4 en el grafo del enunciado y observá cómo el costo crece al agregar vértices.',
        starter: '# Grafo del enunciado (destino, peso)\nGRAFO = {\n    0: [(1, 4), (2, 5)],\n    1: [(2, 1), (3, 2)],\n    2: [(3, 8), (4, 3)],\n    3: [(1, 1), (2, 2)],\n    4: [(3, -2)],\n}\n\ndef bellman_ford(grafo, origen):\n    """Devuelve (distancias, hay_ciclo_negativo)"""\n    pass\n\ndef rutas(grafo, actual, destino, camino=None):\n    """Cuenta rutas SIMPLES de actual a destino (sin repetir vertices)"""\n    pass\n\nprint(bellman_ford(GRAFO, 0))   # ({0: 0, 1: 4, 2: 5, 3: 6, 4: 8}, False)\nprint(rutas(GRAFO, 0, 4))        # 3\n',
        solution: 'GRAFO = {\n    0: [(1, 4), (2, 5)],\n    1: [(2, 1), (3, 2)],\n    2: [(3, 8), (4, 3)],\n    3: [(1, 1), (2, 2)],\n    4: [(3, -2)],\n}\n\n\ndef bellman_ford(grafo, origen):\n    """Relaja todas las aristas |V|-1 veces y busca un ciclo negativo."""\n    aristas = [(u, v, p) for u in grafo for v, p in grafo[u]]\n    # Todos los vertices, aunque no tengan aristas salientes\n    dist = {v: float("inf") for v in grafo}\n    for _u, v, _p in aristas:\n        if v not in dist:\n            dist[v] = float("inf")\n    dist[origen] = 0\n    largo = len(dist) - 1\n    for _ in range(largo):\n        cambio = False\n        for u, v, p in aristas:\n            if dist[u] != float("inf") and dist[u] + p < dist[v]:\n                dist[v] = dist[u] + p\n                cambio = True\n        if not cambio:\n            break\n    ciclo = any(\n        dist[u] != float("inf") and dist[u] + p < dist[v]\n        for u, v, p in aristas\n    )\n    return dist, ciclo\n\n\ndef rutas(grafo, actual, destino, camino=None):\n    """Backtracking: cuenta rutas simples. Exponencial en el peor caso."""\n    if camino is None:\n        camino = set()\n    camino.add(actual)\n    if actual == destino:\n        camino.discard(actual)\n        return 1\n    total = 0\n    for v, _ in grafo.get(actual, []):\n        if v not in camino:          # no repetir vertices\n            total += rutas(grafo, v, destino, camino)\n    camino.discard(actual)           # deshacer: por eso es backtracking\n    return total\n\n\nprint(bellman_ford(GRAFO, 0))\nprint(rutas(GRAFO, 0, 4))\n',
        solutionExp: '<p><b>Bellman-Ford</b> relaja todas las aristas <b>|V|−1</b> veces. Si una pasada extra sigue mejorando, hay <b>ciclo negativo</b>: el camino "más corto" se puede repetir indefinidamente y el resultado deja de estar definido.</p><p>La diferencia clave con Dijkstra está en la <b>etiqueta</b> de la comparación: aquí es <code>&lt;</code> (acepta <b>cualquier peso</b>), en Dijkstra es <code>==</code> (solo pesos <b>no negativos</b>). Por eso Bellman-Ford detecta negativos y Dijkstra no.</p><p><code>rutas</code> es <b>backtracking</b>: elige un vecino, baja recursivamente y al volver <b>deshace</b> la elección con <code>discard</code>. El conjunto <code>camino</code> es lo que impide repetir vértices; sin él, en un grafo con ciclos la recursión no termina. El costo es <b>exponencial</b>: es justamente un problema NP-difícil, y por eso no hay una versión polinomial conocida.</p>',
        tests: [
          { name: 'distancia mínima de 0 a 4 = 8', code: 'assert bellman_ford(GRAFO,0)[0][4]==8' },
          { name: 'distancia de 0 a 1 = 4', code: 'assert bellman_ford(GRAFO,0)[0][1]==4' },
          { name: 'distancia de 0 a 2 = 5 (no mejora pasando por 1)', code: 'assert bellman_ford(GRAFO,0)[0][2]==5' },
          { name: 'distancia de 0 a 3 = 6', code: 'assert bellman_ford(GRAFO,0)[0][3]==6' },
          { name: 'el grafo del enunciado no tiene ciclo negativo', code: 'assert bellman_ford(GRAFO,0)[1] is False' },
          { name: 'detecta un ciclo negativo', code: 'assert bellman_ford({0:[(1,1)],1:[(2,-3)],2:[(1,1)]},0)[1] is True' },
          { name: 'un ciclo de peso 0 NO es negativo', code: 'assert bellman_ford({0:[(1,2)],1:[(2,-2)]},0)[1] is False' },
          { name: 'incluye vértices sin aristas salientes', code: 'd=bellman_ford({0:[(1,2)],1:[]},0)[0]\nassert 1 in d and d[1]==2' },
          { name: 'grafo lineal: las distancias son la suma de los pesos', code: 'g={0:[(1,2)],1:[(2,3)],2:[]}\nassert bellman_ford(g,0)[0]=={0:0,1:2,2:5}' },
          { name: 'origen y destino iguales: una sola ruta', code: 'assert rutas(GRAFO,0,0)==1' },
          { name: 'destino directo: una ruta', code: 'assert rutas({0:[(1,1)],1:[]},0,1)==1' },
          { name: 'hay 3 rutas simples de 0 a 4', code: 'assert rutas(GRAFO,0,4)==3' },
          { name: 'el conteo no depende del camino recibido', code: 'assert rutas(GRAFO,0,4)==3 and rutas(GRAFO,0,4)==3' },
          { name: 'sin camino devuelve 0', code: 'aislado={0:[(1,1)],1:[],2:[(3,1)],3:[]}\nassert rutas(aislado,0,3)==0' },
          { name: 'backtracking no cuelga en un grafo con ciclo', code: 'ciclo={0:[(1,1)],1:[(2,1)],2:[(0,1),(3,1)]}\nassert rutas(ciclo,0,3)==1' }
        ]
      }
    ],
    viz: [{ key: 'grafo', label: 'Grafos: DFS, BFS y Dijkstra' }],
    tp: 'tp4'
  }
  ];

  EDD.unitById = function (id) {
    for (var i = 0; i < EDD.unidades.length; i++) if (EDD.unidades[i].id === id) return EDD.unidades[i];
    return null;
  };

})(window.EDD);