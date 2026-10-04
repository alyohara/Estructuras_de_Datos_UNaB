# Algoritmos y Estructuras de Datos — UNAB

Material de estudio en HTML/JS puro (sin build, sin dependencias) para la materia
**Algoritmos y Estructuras de Datos** (UNAB).

Sitio publicado: <https://alyohara.github.io/Estructuras_de_Datos_UNaB/>

Todo el contenido vive en `web/`. Los datos (teoría, quizzes, TP, exámenes) están en
archivos `.js` con formato objeto, así que no hay paso de compilación: se edita y se
recarga.

## Cómo abrirlo

Los laboratorios con Python (Pyodide) **no** funcionan abriendo los archivos con
doble clic: el navegador bloquea la carga del WASM en `file://`. Hay que servir la
carpeta por HTTP:

```bash
cd web
python -m http.server 8000
```

y abrir <http://localhost:8000>.

Todo lo demás (teoría, quizzes, visualizadores) sí funciona también desde `file://`.

La primera ejecución de un laboratorio descarga Pyodide (~10 MB) desde
`vendor/pyodide/` y tarda unos segundos. Después queda en caché.

## Estructura

```
web/
├─ index.html              Inicio / panel de progreso
├─ u1..u10/index.html      Una página por unidad
├─ tp/index.html           Los 6 trabajos prácticos
├─ exams/index.html        Parciales, recuperatorios y finales
├─ downloads/              Clases, apuntes, exámenes, código, notebooks y diagramas
├─ assets/
│  ├─ css/main.css         Design system (tema claro y oscuro)
│  ├─ data/                Teoría, quizzes, TP y exámenes (datos en JS)
│  └─ js/                  Núcleo, quizzes, Pyodide y visualizadores
└─ vendor/pyodide/         Copia local de Pyodide 0.26.4
```

## Unidades

| # | Unidad | Qué cubre |
|---|---|---|
| 1 | Introducción a Python | Funciones, clases, POO, recursión |
| 2 | Listas, pilas y colas | TAD lineales, listas enlazadas y doblemente enlazadas |
| 3 | Árboles binarios | BST, recorridos, AVL y rotaciones |
| 4 | Árboles generales | N-arios, cola de hermanos |
| 5 | Colas de prioridad y heaps | Montículo binario |
| 6 | Análisis de algoritmos | Notación Big O |
| 7 | Grafos | Adyacencia, DFS, BFS, Dijkstra |
| 8 | Algoritmos de recorrido | DFS/BFS iterativos, backtracking, recorridos de árboles |
| 9 | Ordenamiento | Burbujeo, selección, inserción, merge sort, quicksort, heapsort |
| 10 | Problemas NP y camino mínimo | Bellman-Ford, P/NP, NP-completos, heurísticas |

## Visualizadores incluidos

| Clave | Qué muestra | Unidades |
|---|---|---|
| `recursividad` | Traza de llamadas, caso base y retorno | U1, U8 |
| `linkedList`, `pila`, `cola` | Estructuras lineales con su costo | U1, U2 |
| `arbolBinario`, `avl` | BST, recorridos y rotaciones | U3 |
| `arbolGeneral` | Árbol n-ario y cola de hermanos | U4 |
| `heap` | Montículo: burbujeo arriba y abajo | U5, U9 |
| `ordenamiento` | Burbujeo, selección, inserción, merge y quicksort | U6, U9 |
| `grafo`, `adyacencia` | DFS, BFS, Dijkstra y representaciones | U7, U8, U10 |

## Laboratorios y tests

Cada bloque de código se ejecuta en el navegador con **Pyodide** (Python 3.11 real,
no una simulación). Los tests son `assert` de Python que corren **en un namespace
limpio por test**, así que un test no puede pasar por leftovers del anterior.

Incluyen pistas progresivas y una solución desplegable aparte.

Estado actual: **22 bloques con tests (108 tests), todos en verde.**

- 11 laboratorios de unidad
- 6 trabajos prácticos
- 5 stacks de exámenes

## Autoevaluaciones

**161 preguntas** de opción múltiple, multiple choice, verdadero/falso, completar y
ordenar, con explicación y código en cada respuesta.

| Unidad | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Preguntas | 15 | 16 | 16 | 13 | 14 | 15 | 16 | 20 | 20 | 16 |

Además hay 5 exámenes con su parte teórica (muestreo de las preguntas de las unidades
que corresponde) y su stack de código con tests.

## Progreso

Se guarda en `localStorage` (nada sale del navegador). Desde el ícono ◔ se puede
exportar e importar el progreso en JSON para llevarlo a otra máquina.

Al importar se hace **merge**, no reemplazo: gana el mejor resultado de cada quiz y
el aprobado de cada lab, y las marcas de tiempo de los ejercicios resueltos se
conservan para que "cuándo lo resolví" no cambie.

El porcentaje global pondera quizzes (55%), ejercicios/labs (25%) y laboratorios (20%).
El porcentaje **por unidad** cuenta exactamente los ítems que esa unidad declara.

## Publicar en GitHub Pages

El repositorio tiene como raíz el contenido de `web/` y se publica desde la rama
`main`, carpeta `/` (*Settings → Pages*). Cada `git push` a `main` actualiza el sitio
en uno o dos minutos. El archivo `.nojekyll` evita que GitHub procese el sitio con
Jekyll.

El sitio calcula sus rutas relativas desde la URL del propio `core.js`, así que
funciona igual en la raíz del dominio o en un subdirectorio.

## Añadir contenido

- **Teoría de una unidad**: objeto en `assets/data/units.js`, campo `secciones`.
  Cada sección acepta `h`, `html` y `code`. El índice lateral se arma solo.
- **Preguntas**: objeto en `assets/data/quizzes.js`. Tipos: `mcq`, `multi`, `tf`,
  `fill`, `order`. `ans` es el índice correcto (o el array de índices).
- **Un visualizador en una unidad**: agregarlo a `viz: [{ key, label }]`. El `key`
  tiene que coincidir con el registro de `EDD.registerViz` en su archivo.
- **Un archivo para descargar**: copiarlo a `downloads/` y sumarlo a la lista en
  `EDD.downloadsPage` (`assets/js/pages.js`).

## Antes de publicar: cómo verificar

```bash
# 1. sintaxis de todos los JS
for f in assets/js/*.js assets/data/*.js; do node --check "$f" || echo "FALLA $f"; done

# 2. servir el sitio y revisar las 16 páginas (inicio, u1..u10, tp, exámenes,
#    descargas y dos exámenes por hash)
python -m http.server 8000
```

Lo que conviene revisar a mano en el navegador: que cada visualizador dibuje, que los
botones ▶ Paso y ▶ Correr tests respondan, y que un laboratorio con Python cargue Pyodide
y pase sus tests con la solución desplegable.