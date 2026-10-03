/* ============================================================
   EDD — Trabajos prácticos (TP 1 a 6)
   Cada TP: enunciado, pistas, plantilla y tests automáticos.
   ============================================================ */
(function (EDD) {
  'use strict';

  EDD.tps = [
    {
      id: 'tp1', num: 1, titulo: 'TP 1 — Introducción a Python',
      archivo: 'slides/tp1_enunciado.pdf',
      resumen: 'Primeros ejercicios: variables, condicionales, bucles y funciones.',
      enunciado: 'Resolver los ejercicios del enunciado usando estructuras de control y funciones. Entregar el código en un archivo .py con las salidas por pantalla.',
      temas: ['Variables y tipos', 'Condicionales', 'Bucles for y while', 'Funciones', 'Listas y tuplas'],
      consignas: [
        'Un programa que pida tres notas por teclado y devuelva el promedio, indicating si aprobó.',
        'Una función que reciba una lista de números y devuelva el mayor, el menor y el promedio como tupla.',
        'Un programa que imprima las tablas de multiplicar del 1 al 9 usando un `for` anidado.',
        'Una función recursiva que calcule el factorial de un número.'
      ],
      plantilla: '# TP 1\n\ndef promedio(notas):\n    """Devuelve el promedio de una lista de notas"""\n    pass\n\ndef tabla(n):\n    """Imprime la tabla de multiplicar de n (1..9)"""\n    pass\n\ndef factorial(n):\n    """Factorial recursivo"""\n    pass\n\nif __name__ == "__main__":\n    notas = [float(input("Nota: ")) for _ in range(3)]\n    print("Promedio:", promedio(notas))\n',
      solution: 'def promedio(nums):\n    """Promedio de una lista de numeros."""\n    return sum(nums) / len(nums)\n\n\ndef factorial(n):\n    """Producto de 1 a n. factorial(0) vale 1."""\n    resultado = 1\n    for i in range(2, n + 1):\n        resultado *= i\n    return resultado\n\n\nprint(promedio([6, 8, 10]))\nprint(factorial(5))\n',
      solutionExp: '<p><code>promedio</code> divide la suma por la cantidad de elementos; <code>factorial</code> multiplica desde 2 hasta n. Si n es 0 el ciclo no corre y queda el 1, que es el factorial correcto.</p>',
      tests: [
        { name: 'promedio de [6, 8, 10] es 8', code: 'assert promedio([6,8,10])==8' },
        { name: 'factorial(5) es 120', code: 'assert factorial(5)==120' },
        { name: 'factorial(0) es 1', code: 'assert factorial(0)==1' }
      ]
    },
    {
      id: 'tp2', num: 2, titulo: 'TP 2 — Clases y encapsulamiento',
      archivo: 'slides/tp2_enunciado.pdf',
      resumen: 'Modelar entidades con clases, atributos privados y properties.',
      enunciado: 'Definir clases que representen las entidades del dominio, encapsulando los datos y exponiendo una interfaz clara.',
      temas: ['Clases y objetos', 'Atributos privados', 'Properties', 'Métodos de instancia', '__str__'],
      consignas: [
        'Crear una clase `Empleado` con nombre, apellido, legajo y comisión; el salario se calcula como 20000 + comisión.',
        'El nombre debe ser inmutable desde afuera: usar property y lanzar `ValueError` si se intenta dejar vacío.',
        'Implementar `__str__` con un formato legible.',
        'Guardar los empleados en una lista y mostrar el total de la nómina.'
      ],
      plantilla: 'class Empleado:\n    def __init__(self, nombre, apellido, legajo, comision=0):\n        pass\n\n    @property\n    def nombre_completo(self):\n        pass\n\n    def salario(self):\n        return 20000 + self.comision\n\n    def __str__(self):\n        pass\n\nplantilla = [Empleado("Ana", "Perez", 2951, 1500)]\n',
      solution: 'class Empleado:\n    """Empleado con encapsulation: los datos no se tocan por fuera."""\n\n    SUELDO_BASE = 20000\n\n    def __init__(self, nombre, apellido, legajo, comision=0):\n        self._nombre = nombre\n        self._apellido = apellido\n        self._legajo = legajo\n        self._comision = comision\n\n    @property\n    def nombre_completo(self):\n        return self._nombre + " " + self._apellido\n\n    @property\n    def legajo(self):\n        return self._legajo\n\n    def salario(self):\n        return self.SUELDO_BASE + self._comision\n\n    def __repr__(self):\n        return "Empleado(" + self._legajo.__str__() + ", " + self.nombre_completo + ")"\n\n\ne = Empleado("Ana", "Perez", 1, 1500)\nprint(e.nombre_completo, e.salario())\n',
      solutionExp: '<p>Los atributos van con <code>_</code> delante para marcar que son privados: afuera se usan <code>@property</code> (leer) y métodos (calcular). El sueldo base se mantiene como constante de clase <code>SUELDO_BASE</code>, y la comisión tiene valor por defecto para poder crear empleados sin comisión.</p>',
      tests: [
        { name: 'el salario es 20000 + comisión', code: 'e=Empleado("Ana","Perez",1,1500)\nassert e.salario()==21500' },
        { name: 'nombre_completo une nombre y apellido', code: 'e=Empleado("Ana","Perez",1)\nassert e.nombre_completo=="Ana Perez"' }
      ]
    },
    {
      id: 'tp3', num: 3, titulo: 'TP 3 — Cola de prioridad / montículo',
      archivo: 'slides/tp3_enunciado.pdf',
      resumen: 'Implementar un heap a mano y usarlo como cola de prioridad.',
      enunciado: 'Construir un montículo binario sobre un array, con burbujeo arriba y abajo, y las operaciones de la cola de prioridad.',
      temas: ['Montículo binario', 'Burbujeo arriba / abajo', 'insert / extract', 'eliminar un valor'],
      consignas: [
        'Implementar `MaxHeap` sin usar `heapq`.',
        '`insertar`, `extraer_maximo` y `eliminar(valor)`.',
        'Comprobar con aserciones que el heap se mantiene válido tras cada operación.',
        'Usar el heap para atender procesos por prioridad.'
      ],
      plantilla: 'class MaxHeap:\n    def __init__(self):\n        self.datos = []\n\n    def _arriba(self, i):\n        """Burbujeo arriba: subir hasta que el padre sea mayor"""\n        pass\n\n    def _abajo(self, i):\n        """Burbujeo abajo: bajar swap con el hijo mayor"""\n        pass\n\n    def insertar(self, valor):\n        pass\n\n    def extraer_maximo(self):\n        pass\n\n    def eliminar(self, valor):\n        pass\n',
      solution: 'class MaxHeap:\n    """Cola de prioridad de maximo implementada a mano."""\n\n    def __init__(self):\n        self.datos = []\n\n    def _subir(self, i):\n        while i > 0:\n            p = (i - 1) // 2\n            if self.datos[p] >= self.datos[i]:\n                break\n            self.datos[p], self.datos[i] = self.datos[i], self.datos[p]\n            i = p\n\n    def _bajar(self, i):\n        n = len(self.datos)\n        while True:\n            izq, der, mayor = 2 * i + 1, 2 * i + 2, i\n            if izq < n and self.datos[izq] > self.datos[mayor]:\n                mayor = izq\n            if der < n and self.datos[der] > self.datos[mayor]:\n                mayor = der\n            if mayor == i:\n                break\n            self.datos[i], self.datos[mayor] = self.datos[mayor], self.datos[i]\n            i = mayor\n\n    def insertar(self, valor):\n        self.datos.append(valor)\n        self._subir(len(self.datos) - 1)\n\n    def extraer_maximo(self):\n        if not self.datos:\n            return None\n        raiz = self.datos[0]\n        ultimo = self.datos.pop()\n        if self.datos:\n            self.datos[0] = ultimo\n            self._bajar(0)\n        return raiz\n\n    def eliminar(self, valor):\n        if valor not in self.datos:\n            return False\n        i = self.datos.index(valor)\n        self.datos[i] = self.datos[-1]\n        self.datos.pop()\n        if i < len(self.datos):\n            self._subir(i)\n            self._bajar(i)\n        return True\n\n    def __len__(self):\n        return len(self.datos)\n\n\nh = MaxHeap()\nfor v in [3, 9, 1]:\n    h.insertar(v)\nprint(h.datos, h.extraer_maximo())\n',
      solutionExp: '<p>Una cola de prioridad es un montículo: el arreglo guarda los valores y las <i>relaciones</i> padre-hijo. <code>insertar</code> y <code>extraer_maximo</code> son <b>O(log n)</b> porque el burbujeo sube o baja solo la altura del árbol, no recorre todo el arreglo.</p>',
      tests: [
        { name: 'insertar mantiene la raíz como máximo', code: 'h=MaxHeap()\nfor v in [3,9,1]: h.insertar(v)\nassert h.datos[0]==9' },
        { name: 'extraer_maximo devuelve None si está vacío', code: 'assert MaxHeap().extraer_maximo() is None' },
        { name: 'eliminar quita el valor indicado', code: 'h=MaxHeap()\nfor v in [3,9,1]: h.insertar(v)\nh.eliminar(9)\nassert 9 not in h.datos' }
      ]
    },
    {
      id: 'tp4', num: 4, titulo: 'TP 4 — Complejidad y ordenamientos',
      archivo: 'slides/tp4_resuelto.pdf',
      archivoTexto: 'TP 4 resuelto (PDF)',
      resumen: 'Implementar ordenamientos desde cero y medir su costo.',
      enunciado: 'Programar burbujeo, selección, inserción y quicksort sin usar las funciones nativas, y comparar sus costos.',
      temas: ['Ordenamientos', 'Contador de comparaciones', 'Mejor / peor caso', 'Estabilidad'],
      consignas: [
        'Implementar los cuatro algoritmos sobre una copia de la lista.',
        'Contar comparaciones e intercambios.',
        'Verificar que los cuatro devuelven la misma lista ordenada.',
        'Probar con lista ordenada, invertida y aleatoria; comparar.'
      ],
      plantilla: 'def burbujeo(lista):\n    pass\n\ndef seleccion(lista):\n    pass\n\ndef insercion(lista):\n    pass\n\ndef quicksort(lista):\n    pass\n\ndef contar(fn, datos):\n    """Devuelve (ordenados, comparaciones)"""\n    pass\n',
      solution: 'def burbujeo(datos):\n    a = list(datos)\n    n = len(a)\n    for i in range(n - 1):\n        hubo = False\n        for j in range(n - 1 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                hubo = True\n        if not hubo:\n            break\n    return a\n\n\ndef seleccion(datos):\n    a = list(datos)\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i + 1, n):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a\n\n\ndef insercion(datos):\n    a = list(datos)\n    for i in range(1, len(a)):\n        j = i\n        while j > 0 and a[j] < a[j - 1]:\n            a[j], a[j - 1] = a[j - 1], a[j]\n            j -= 1\n    return a\n\n\ndef quicksort(datos):\n    """Divide y venceras: partir en el ultimo elemento y ordenar los lados."""\n    a = list(datos)\n\n    def partir(lo, hi):\n        pivo = a[hi]\n        i = lo - 1\n        for j in range(lo, hi):\n            if a[j] <= pivo:\n                i += 1\n                a[i], a[j] = a[j], a[i]\n        a[i + 1], a[hi] = a[hi], a[i + 1]\n        return i + 1\n\n    def ordenar(lo, hi):\n        if lo < hi:\n            p = partir(lo, hi)\n            ordenar(lo, p - 1)\n            ordenar(p + 1, hi)\n\n    ordenar(0, len(a) - 1)\n    return a\n\n\nd = [7, 2, 9, 1]\nprint(burbujeo(d), seleccion(d), insercion(d), quicksort(d))\n',
      solutionExp: '<p>Los tres bubble/selection/insertion son <b>O(n²)</b> en el peor caso y <b>O(n)</b> de memoria extra. <code>quicksort</code> es <b>O(n log n)</b> promedio y <b>O(n²)</b> en el peor caso (cuando el pivote siempre queda en un extremo).</p>',
      tests: [
        { name: 'los cuatro ordenan correctamente', code: 'd=[7,2,9,1]\nassert burbujeo(d[:])==[1,2,7,9]\nassert seleccion(d[:])==[1,2,7,9]\nassert insercion(d[:])==[1,2,7,9]\nassert quicksort(d[:])==[1,2,7,9]' },
        { name: 'inserción sobre lista ordenada no compara mucho', code: 'd=[1,2,3,4,5,6]\nassert insercion(d[:])==[1,2,3,4,5,6]' }
      ]
    },
    {
      id: 'tp5', num: 5, titulo: 'TP 5 — Árboles binarios',
      archivo: 'slides/tp5_enunciado.pdf',
      resumen: 'BST: inserción, eliminación, recorridos y balance.',
      enunciado: 'Implementar un árbol binario de búsqueda completo con sus operaciones y sus tres recorridos.',
      temas: ['Nodos', 'Inserción y eliminación', 'preOrden / inOrden / postOrden', 'Altura y factor de balance'],
      consignas: [
        'Inserción y eliminación respetando la propiedad de BST.',
        'Los tres recorridos recursivos.',
        '`altura`, `factor_balance` y `esta_balanceado`.',
        'Contar nodos internos y hojas.'
      ],
      plantilla: 'class Nodo:\n    def __init__(self, valor):\n        self.valor = valor\n        self.izq = None\n        self.der = None\n\nclass ArbolBinario:\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor): pass\n    def eliminar(self, valor): pass\n    def buscar(self, valor): pass\n    def pre_orden(self): pass\n    def in_orden(self): pass\n    def post_orden(self): pass\n    def altura(self): pass\n    def esta_balanceado(self): pass\n',
      solution: 'class Nodo:\n    def __init__(self, valor):\n        self.valor = valor\n        self.izq = None\n        self.der = None\n\n\nclass ArbolBinario:\n    """Arbol binario de busqueda."""\n\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor):\n        nuevo = Nodo(valor)\n        if self.raiz is None:\n            self.raiz = nuevo\n            return\n        actual = self.raiz\n        while True:\n            if valor < actual.valor:\n                if actual.izq is None:\n                    actual.izq = nuevo\n                    return\n                actual = actual.izq\n            else:\n                if actual.der is None:\n                    actual.der = nuevo\n                    return\n                actual = actual.der\n\n    def _in(self, n, acc):\n        if n is None:\n            return\n        self._in(n.izq, acc)\n        acc.append(n.valor)\n        self._in(n.der, acc)\n\n    def in_orden(self):\n        acc = []\n        self._in(self.raiz, acc)\n        return acc\n\n    def altura(self):\n        def h(n):\n            return 0 if n is None else 1 + max(h(n.izq), h(n.der))\n        return h(self.raiz)\n\n    def buscar(self, valor):\n        actual = self.raiz\n        while actual is not None:\n            if valor == actual.valor:\n                return True\n            actual = actual.izq if valor < actual.valor else actual.der\n        return False\n\n\na = ArbolBinario()\nfor v in [50, 30, 70, 20]:\n    a.insertar(v)\nprint(a.in_orden(), a.altura())\n',
      solutionExp: '<p>Con un árbol balanceado, <code>buscar</code>, <code>insertar</code> y <code>borrar</code> son <b>O(log n)</b>. Si el árbol se degenera (una cadena) cada operación pasa a ser <b>O(n)</b>: por eso conviene el AVL, que mantiene la altura en <b>O(log n)</b> garantizados.</p>',
      tests: [
        { name: 'in_orden devuelve la lista ordenada', code: 'a=ArbolBinario()\nfor v in [50,30,70,20]: a.insertar(v)\nassert a.in_orden()==[20,30,50,70]' },
        { name: 'altura de [50,30,70,20,40] es 3', code: 'a=ArbolBinario()\nfor v in [50,30,70,20,40]: a.insertar(v)\nassert a.altura()==3' }
      ]
    },
    {
      id: 'tp6', num: 6, titulo: 'TP 6 — Árboles generales',
      archivo: 'slides/tp6_enunciado.pdf',
      resumen: 'Modelar un árbol n-ario y recorrerlo en profundidad.',
      enunciado: 'Construir un árbol general a partir de una estructura de datos anidada y recorrerlo en profundidad.',
      temas: ['Nodos con N hijos', 'Recorrido en profundidad', 'Inserción de subárboles', 'Profundidad y conteo'],
      consignas: [
        'Construir el árbol a partir de una estructura anidada (datos, archivos, etc.).',
        'Recorrerlo en profundidad con indentación por nivel.',
        'Calcular profundidad y cantidad total de nodos.',
        'Agregar un subárbol a un nodo existente.'
      ],
      plantilla: 'class NodoGeneral:\n    def __init__(self, dato):\n        self.dato = dato\n        self.hijos = []\n\nclass ArbolGeneral:\n    def __init__(self):\n        self.raiz = None\n\n    def agregar_raiz(self, dato): pass\n    def agregar_hijo(self, padre, dato): pass\n    def mostrar(self, nodo=None, nivel=0): pass\n    def cantidad_nodos(self): pass\n    def profundidad(self): pass\n',
      solution: 'class NodoGeneral:\n    def __init__(self, nombre):\n        self.nombre = nombre\n        self.hijos = []\n\n\nclass ArbolGeneral:\n    """Arbol general: cada nodo puede tener cuantos hijos quiera."""\n\n    def __init__(self, raiz=None):\n        self.raiz = raiz\n\n    def agregar_raiz(self, nombre):\n        self.raiz = NodoGeneral(nombre)\n        return self.raiz\n\n    def agregar_hijo(self, padre, nombre):\n        """Agrega el hijo y lo devuelve para poder seguir bajando."""\n        nuevo = NodoGeneral(nombre)\n        padre.hijos.append(nuevo)\n        return nuevo\n\n    def cantidad_nodos(self):\n        def contar(n):\n            if n is None:\n                return 0\n            return 1 + sum(contar(h) for h in n.hijos)\n        return contar(self.raiz)\n\n    def profundidad(self):\n        def prof(n):\n            if n is None:\n                return 0\n            return 1 + max((prof(h) for h in n.hijos), default=0)\n        return prof(self.raiz)\n\n    def ancho(self):\n        """Cantidad de nodos del nivel mas ancho."""\n        if self.raiz is None:\n            return 0\n        nivel = [self.raiz]\n        mejor = 1\n        while nivel:\n            mejor = max(mejor, len(nivel))\n            siguiente = []\n            for n in nivel:\n                siguiente.extend(n.hijos)\n            nivel = siguiente\n        return mejor\n\n\na = ArbolGeneral()\na.agregar_raiz("root")\nhome = a.agregar_hijo(a.raiz, "home")\ndocs = a.agregar_hijo(home, "docs")\na.agregar_hijo(docs, "clase.pdf")\nprint(a.cantidad_nodos(), a.profundidad(), a.ancho())\n',
      solutionExp: '<p>La diferencia clave es que acá no hay índice fijo: los hijos van en una <b>lista</b>. Por eso los recorridos son genéricos y no existe "altura" única como en un árbol binario: se habla de <b>profundidad</b> (niveles) y <b>ancho</b> (nodos del nivel más ancho).</p>',
      tests: [
        { name: 'cantidad_nodos cuenta toda la descendencia', code: 'a=ArbolGeneral()\na.agregar_raiz("root")\nr=a.raiz\nh=a.agregar_hijo(r,"home")\na.agregar_hijo(h,"docs")\nassert a.cantidad_nodos()==3' },
        { name: 'profundidad de root>home>docs es 3', code: 'a=ArbolGeneral()\na.agregar_raiz("root")\nh=a.agregar_hijo(a.raiz,"home")\na.agregar_hijo(h,"docs")\nassert a.profundidad()==3' }
      ]
    }
  ];

  EDD.tpById = function (id) {
    for (var i = 0; i < EDD.tps.length; i++) if (EDD.tps[i].id === id) return EDD.tps[i];
    return null;
  };

})(window.EDD);