# BugLab — Guía de Diseño (Developer Workspace Dark Theme)

> Este documento describe el sistema visual y los contratos de componentes de la
> **carcasa principal** de BugLab (layout de 3 paneles). No describe el contenido
> específico de cada bug — eso te toca a vos. Todo lo que necesitás para armarlo
> sin romper el layout está acá.

**Nota de ubicación:** este archivo vive en `frontend/design.md` (no en
`src/`) para que quede al lado del proyecto sin que Vite intente procesarlo
como código. Si preferís tenerlo en `src/`, es un simple `mv`.

> **⚠ Fuente de verdad visual: `Propuesta_interfaz_BugLab.md` §15-17.**
> Este documento nació describiendo un tema plano estilo "IDE oscuro de
> GitHub" (fondo `#0D1117`, acento cian, sin sombras). El proyecto adoptó
> después el estilo **Liquid Glass** de la Propuesta: fondo `#11131A`, paleta
> morado/azul/cian y superficies de vidrio en 3 niveles. Las secciones 1.1 y
> 1.3 ya están actualizadas a ese sistema. Si algo de este archivo contradice
> a la Propuesta, gana la Propuesta.
>
> Las secciones **2 a 5** (convenciones de contenido, contratos de props,
> estados de UI, notas de extensión) siguen vigentes tal cual: no dependen de
> la paleta.
>
> **Pendiente conocido:** los strings de los 21 componentes del workspace y de
> `mockChallenges.ts` están escritos en voseo rioplatense ("Elegí un archivo",
> "Fijate qué pasa"). La landing y todo lo nuevo usan español neutro con *tú*,
> siguiendo la Propuesta. Normalizar el voseo cuando se conecte el workspace.

---

## 0. Qué ya está construido vs. qué falta

**Ya construido (esta guía lo documenta):**
- La carcasa completa de 3 paneles (`TopNavbar`, `ContextPanel`, `WorkspacePanel`, `TestRunnerPanel`).
- Todos los componentes de navegación, contexto, workspace, test-runner y feedback, con props tipadas.
- Los tokens de diseño (colores, tipografías, spacing) en `src/index.css`.
- Datos placeholder realistas (los 3 casos BUG-001/002/003) en `src/data/mockChallenges.ts`, para que el layout se vea "vivo" mientras arma el contenido real.
- Una simulación de corrida de tests en `App.tsx` (`handleRunTests`) que alterna entre "parcialmente resuelto" y "resuelto" para poder ver todos los estados de la UI sin un backend real conectado.

**Falta (tu parte):**
- Reemplazar `src/data/mockChallenges.ts` por la fuente real de contenido de cada bug.
- El diseño puntual de los **botones selectores** de cada bug si el genérico de `ChallengeSelector` no te alcanza (podés extenderlo sin romper su contrato de props).
- Conectar `handleRunTests` en `App.tsx` a un juez de tests real (hoy es un `setTimeout` que simula resultados).
- Opcional: un `DifficultyBadge.tsx` dedicado si necesitás mostrar la dificultad en más lugares que `ChallengeSelector`/el catálogo (hoy se resuelve inline con el mismo patrón de `ProgressBadge`).

---

## 1. Guía de Estilos y Tokens

### 1.1 Paleta semántica

Todos los tokens están declarados una sola vez, en `src/index.css`, dentro de
un bloque `@theme` de Tailwind v4 — **no hay `tailwind.config.js`**, Tailwind v4
genera las utilidades directamente desde esas variables CSS.

| Token          | Valor                     | Uso                                             | Clases Tailwind                              |
|----------------|---------------------------|-------------------------------------------------|-----------------------------------------------|
| `canvas`       | `#11131A`                 | Fondo global de la app                          | `bg-canvas` / `text-canvas`                   |
| `panel`        | `#1A1D27`                 | Base de las superficies de vidrio                | `bg-panel`                                    |
| `line`         | `rgba(255,255,255,.08)`   | Bordes de vidrio y separadores                   | `border-line`                                 |
| `line-strong`  | `rgba(255,255,255,.14)`   | Borde de nivel 1 y estados hover                 | `border-line-strong`                          |
| `ink`          | `#F4F5F7`                 | Texto principal                                  | `text-ink`                                    |
| `ink-muted`    | `#A7ADBB`                 | Texto secundario                                 | `text-ink-muted`                              |
| `accent`       | `#8B7CF6`                 | **Morado:** navegación activa, foco, selección    | `bg-accent` `text-accent` `border-accent`     |
| `accent-soft`  | `#C9C2FF`                 | Morado claro: texto sobre superficies moradas     | `text-accent-soft`                            |
| `action`       | `#70A5FF`                 | **Azul:** acciones principales (botón primario)   | `bg-action` `text-action` `border-action`     |
| `cyan`         | `#66D9D0`                 | Acento terciario, degradados                      | `text-cyan` `border-cyan`                     |
| `success`      | `#3FCF8E`                 | Éxito, test pasado, caso resuelto                 | `bg-success` `text-success` `border-success`  |
| `error`        | `#FF6B6B`                 | Error, test fallido                               | `bg-error` `text-error` `border-error`        |
| `warning`      | `#F5C24C`                 | Advertencia, pistas, "en progreso"                 | `bg-warning` `text-warning` `border-warning`  |

**Morado vs. azul:** la Propuesta §16 los separa por función y conviene
respetarlo. El **morado** marca *dónde estás* (pestaña activa, archivo
seleccionado, foco de teclado). El **azul** marca *qué podés hacer* (botón
primario, "Ejecutar tests", enlaces de acción). Si los mezclás, la interfaz
pierde la única señal que indica la selección.

**Tintes suaves:** no hay tokens `-soft` de fondo separados. Usamos el
modificador de opacidad de Tailwind v4 directo sobre el color semántico:
`bg-success/5`, `bg-error/10`, `border-warning/40`, `bg-accent/10`. Esto evita
duplicar la paleta y mantiene cualquier tinte atado a su color semántico real.

**Fondo global:** el gradiente oscuro y las manchas luminosas desenfocadas
(§15) están en `body::before` / `body::after` dentro de `src/index.css`. Son
estáticos y `pointer-events-none`: ningún componente los redefine.

### 1.2 Tipografía

- **UI / texto general:** Inter, autohospedada vía `@fontsource/inter` (pesos 400/500/600/700). Mapeada como la familia por defecto de `font-sans` — no hace falta escribir `font-['Inter']`, alcanza con `font-sans` (o ni siquiera eso: es el default del `<body>`).
- **Código / elementos "de interfaz técnica":** JetBrains Mono, vía `@fontsource/jetbrains-mono` (400/500/600). Clase `font-mono`.
- **Regla de oro:** todo lo que sea *chrome* de interfaz (navbar, tabs, badges, nombres de archivo, botones, contadores) va en `font-mono`. Todo lo que sea *contenido narrativo* (reporte del bug, explicación final, descripciones) va en `font-sans` — es más legible en párrafos largos.
- **Escala usada:** `text-[10px]`/`text-[11px]` (micro-labels uppercase), `text-xs` (badges, mono UI, tabs), `text-sm` (cuerpo de texto en paneles), `text-lg` (títulos de modal). Pesos: `font-medium`/`font-semibold` para énfasis, nunca `font-bold` salvo el wordmark.

### 1.3 Spacing, radios y bordes

- Radios: `rounded-md` (botones, ítems de lista) · `rounded-full` (badges, dots de estado, navbar) · `rounded-lg` (modales, tarjetas) · `rounded-xl`/`rounded-2xl` (superficies grandes: ventana del mockup, franja de cierre).
- Padding de tarjeta: `p-3` (listas compactas, ítems de test) · `p-4`/`p-5` (bloques con más aire, reporte, modal).
- Gaps: `gap-2` (elementos relacionados/compactos) · `gap-3`/`gap-4` (bloques independientes).

**Superficies: usá los 3 niveles de vidrio, no inventes uno.** El fondo, el
desenfoque, el borde y la sombra de cada superficie salen de una sola clase
(`.glass-1` / `.glass-2` / `.glass-3`, definidas en `src/index.css`); ningún
componente escribe su propio `background` + `backdrop-filter` + `box-shadow`.
Para elegir el nivel: `src/lib/glass.ts` y Propuesta §15.

| Nivel | Clase | Para qué |
|---|---|---|
| 1 | `.glass-1` | Navbar, modales. El vidrio más perceptible. |
| 2 | `.glass-2` | Paneles y tarjetas: reporte, arquitectura, pistas, explorador, tarjetas de desafío. |
| 3 | `.glass-3` | Editor, panel de tests, mensajes de error. Casi sólido: **la legibilidad del código gana sobre el efecto** (§15). |

> Esta regla reemplaza a la anterior ("siempre `border border-line`, nunca
> `box-shadow`"), que describía el tema plano previo. El borde sigue existiendo,
> pero ahora viene incluido en `.glass-N` junto con la sombra y el brillo
> interior. Para un separador suelto dentro de un panel, `border-line` a secas
> sigue siendo lo correcto.

### 1.4 Layout global (cómo está armada la carcasa)

```
App.tsx
└── div.h-screen.w-screen.overflow-hidden.flex.flex-col   ← shell, nunca scrollea entero
    ├── TopNavbar                                          h-14, flex-none
    └── div.flex-1.flex.flex-col.lg:flex-row.overflow-hidden
        ├── ContextPanel      lg:w-[30%]   overflow-y-auto propio
        ├── WorkspacePanel    lg:w-[40%]   overflow-hidden propio (FileTree + Editor)
        └── TestRunnerPanel   lg:w-[30%]   overflow-y-auto propio
    ├── CompletionModal (overlay fixed, se muestra condicionalmente)
    └── Toast stack (fixed bottom-right)
```

- En mobile (`< lg`) los 3 paneles se apilan verticalmente (`flex-col`) y el contenedor exterior SÍ scrollea como página normal (`overflow-y-auto`), porque un IDE de 3 columnas fijas no funciona en una pantalla angosta. En desktop (`lg:` y superior) cada panel tiene su propio scroll independiente y nada se mueve entero.
- Las proporciones 30/40/30 están **hardcodeadas dentro de cada panel** (`ContextPanel`, `WorkspacePanel`, `TestRunnerPanel`), no se pasan por props — es una decisión de la carcasa, no algo que el contenido de un bug deba controlar.

---

## 2. Convenciones UI para presentar un bug

Esta sección es la más importante para vos: define **cómo** tiene que verse
el contenido de cada caso para que encaje en los componentes ya construidos.

### 2.1 Reporte del bug (`BugReportTab`)

- Bloque "síntoma": fondo `bg-canvas/40`, borde `border-line`, label en mono uppercase color `text-error` (el síntoma es "lo que está mal").
- Bloque "comportamiento esperado": mismo estilo, label en `text-success` (es la meta).
- Cita de contexto: `blockquote` con borde izquierdo `border-accent`, fondo `bg-accent/5`, texto en itálica + una `<cite>` en mono con quién lo reportó (ej. "Atención al cliente", "Soporte", "Depósito").
- **Redactá siempre en lenguaje llano**, como si lo contara un área no técnica. Nunca jerga de programador en el síntoma o la cita — el jerga técnico (nombres de función, "useEffect", "mutación por referencia") puede aparecer recién en `architecture.summary` o en la explicación final.

### 2.2 Badges de dificultad

- Mapeo fijo: **Fácil → `success`** · **Intermedio → `warning`** · **Difícil → `error`**.
- Ojo: es el mismo trío de colores que usa `ProgressBadge` para pendiente/en análisis/resuelto, pero con un significado distinto. Nunca los pongas uno al lado del otro sin la etiqueta de texto — el color refuerza, pero el texto (`Fácil`, `Pendiente`, etc.) es lo que de verdad comunica el estado.
- No armé un `DifficultyBadge.tsx` dedicado porque hoy solo aparece dentro de `ChallengeSelector`. Si necesitás mostrarlo en más lugares, cloná el patrón de `ProgressBadge.tsx` (dot + label + borde del color correspondiente).

### 2.3 Diagrama de arquitectura (`ArchitectureTab`)

- Lista **vertical** de nodos (`architecture.nodes`), cada uno una tarjeta:
  - Normal: `border-line bg-canvas/40`.
  - Sospechoso (`suspect: true`): `border-error/50 bg-error/5` + una línea `⚠ posible origen del bug` en `text-error`.
- Una flecha `↓` centrada entre nodos consecutivos representa el flujo (no una jerarquía de carpetas).
- **Regla:** marcá `suspect: true` en 1, como mucho 2 nodos por caso. Si todo es "sospechoso", el diagrama deja de guiar a quien investiga.

### 2.4 Árbol de archivos (`FileTree` / `FileNode`)

- `access: "readonly"` → aparece con 🔒 y no es un archivo "a corregir", pero sí es visible y consultable — usalo para archivos de contexto (esquemas, datos semilla) que ayudan a entender el caso sin ser la corrección en sí. Ejemplo real: `schema.js` en BUG-001, `inventory.seed.js` en BUG-003.
- `access: "editable"` → es el archivo que hay que corregir.
- `kind: "folder"` con `children` → agrupá archivos relacionados bajo una carpeta solo cuando haya 2+ archivos que pertenezcan juntos (ver `bug-002` en `mockChallenges.ts`, que agrupa 2 archivos bajo `components/`). Para un solo archivo, no crees una carpeta.

### 2.5 Pistas progresivas (`ProgressiveHintsTab` / `Hint[]`)

Convención narrativa para las 3 pistas de un caso — es un degradé, no 3 pistas al azar:

1. **Pista 1** — apunta a *observar* algo puntual ("Fijate qué pasa cuando...").
2. **Pista 2** — plantea una *pregunta o comparación conceptual* ("¿Esto es lo mismo que...?").
3. **Pista 3** — casi nombra la solución, sin escribir el código exacto.

El componente ya maneja el revelado progresivo y el conteo ("N/M usadas") — vos solo escribís el array `hints: Hint[]` con ese degradé.

### 2.6 Explicación final (`FinalExplanationTab` / `FinalExplanation`)

- Se bloquea automáticamente (`locked={!isSolved}`) hasta que todos los tests pasan — nunca la vas a spoilear antes de tiempo, es responsabilidad del componente, no tuya.
- Estructura esperada:
  - `title`: nombre corto del *tipo* de bug (ej. "Error de límite (off-by-one)", "Mutación por referencia") — generaliza el concepto, no describe el caso puntual.
  - `body`: 2-4 oraciones explicando qué pasaba y por qué la corrección funciona, cerrando con el concepto general detrás del bug (para que sirva como aprendizaje transferible, no solo "arreglamos esta línea").

---

## 3. Contratos de Componentes (TypeScript Props)

Todos los tipos de dominio (`Challenge`, `BugReport`, `Architecture`,
`FileNode`, `TestCase`, etc.) están en **`src/types/index.ts`** — es la única
fuente de verdad. Lo que sigue es la lista de props por componente.

### Navegación (`src/components/navigation/`)

```ts
// TopNavbar.tsx
interface TopNavbarProps {
  version?: string; // default "MVP v1.0"
  challenges: ChallengeSummary[];
  selectedChallengeId: string;
  onSelectChallenge: (id: string) => void;
  status: ChallengeStatus;
  resolvedCount: number;
  totalCount: number;
  onReset: () => void;
}

// ChallengeSelector.tsx — el slot para los selectores de reto
interface ChallengeSelectorProps {
  challenges: ChallengeSummary[];
  selectedChallengeId: string;
  onSelect: (id: string) => void;
}

// ProgressBadge.tsx
interface ProgressBadgeProps {
  status: ChallengeStatus; // "pendiente" | "en-analisis" | "resuelto"
}

// ResetButton.tsx
interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}
```

### Panel de contexto (`src/components/context-panel/`)

```ts
// ContextPanel.tsx — shell de las 4 pestañas
interface ContextPanelProps {
  challenge: Challenge;
  isSolved: boolean; // gatea FinalExplanationTab
}

// BugReportTab.tsx
interface BugReportTabProps { report: BugReport }

// ArchitectureTab.tsx
interface ArchitectureTabProps { architecture: Architecture }

// ProgressiveHintsTab.tsx — reveal state es local (montar con key={challenge.id})
interface ProgressiveHintsTabProps { hints: Hint[] }

// FinalExplanationTab.tsx
interface FinalExplanationTabProps {
  explanation: FinalExplanation;
  locked: boolean;
}
```

### Workspace (`src/components/workspace/`)

```ts
// WorkspacePanel.tsx
interface WorkspacePanelProps {
  files: FileNode[];
  openTabs: EditorTab[];
  activeFileId: string | null;
  fileContents: Record<string, string>;
  readonlyFileIds?: string[];
  onSelectFile: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onChangeContent: (fileId: string, content: string) => void;
}

// FileTree.tsx
interface FileTreeProps {
  nodes: FileNode[];
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
}

// FileTreeItem.tsx (recursivo, uso interno de FileTree)
interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
}

// EditorTabs.tsx
interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

// CodeEditor.tsx
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  language?: string; // solo un tag informativo hoy; si sumás un editor real (CodeMirror/Monaco), este prop es el punto de enganche
}
```

### Validador de tests (`src/components/test-runner/`)

```ts
// TestRunnerPanel.tsx
interface TestRunnerPanelProps {
  tests: TestCase[];
  onRunTests: () => void;
  isRunning: boolean;
  errorDiff?: ErrorDiff | null;
}

// TestActionHeader.tsx
interface TestActionHeaderProps {
  onRun: () => void;
  isRunning: boolean;
  passed: number;
  total: number;
}

// TestResultCard.tsx — test.passed: true | false | null (null = "sin correr")
interface TestResultCardProps { test: TestCase }

// ErrorDiffView.tsx
interface ErrorDiffViewProps { diff: ErrorDiff }
```

### Feedback (`src/components/feedback/`)

```ts
// CompletionModal.tsx
interface CompletionModalProps {
  open: boolean;
  challengeTitle: string;
  onClose: () => void;
  onNextChallenge?: () => void;
}

// ToastNotification.tsx — un toast individual; el stack se arma en App.tsx
interface ToastNotificationProps {
  toast: ToastItem; // { id, variant: "success"|"error"|"info"|"warning", message }
  onDismiss: (id: string) => void;
}
```

---

## 4. Estados de UI

| Estado | Regla |
|---|---|
| **Hover** | Cambio de color de texto/borde (`hover:text-ink`, `hover:border-accent/50`), nunca solo un cambio de opacidad — mejor contraste y más legible. `transition-colors` sin duración custom (usamos el default de Tailwind, ~150ms). |
| **Activo / seleccionado** | Siempre `border-accent` + `bg-accent/10` + `text-accent` juntos (tabs, selector de reto, tab de archivo activo, tab de contexto activa). Nunca un cambio de fondo solo, sin el acento de marca. |
| **Disabled** | `opacity-40` a `opacity-60` + `cursor-not-allowed`, **y el label cambia** (ej. botón de pistas pasa a decir "No quedan más pistas" en vez de solo apagarse) — el estado siempre se explica en texto, nunca solo visualmente. |
| **Loading** | Spinner CSS-only (`animate-spin` sobre un borde), ver `TestActionHeader`. Solo se deshabilita la acción puntual (el botón), nunca se bloquea la pantalla entera con un overlay. |
| **Éxito** | Verde (`success`) + ícono ✓/✅, siempre acompañado de texto que confirma qué pasó ("Caso resuelto", "3/3 pruebas superadas"). |
| **Error / advertencia** | Rojo (`error`) o ámbar (`warning`) + ✕/⚠, siempre con un mensaje que explica qué falló o qué falta — nunca un color sin texto. |
| **Foco de teclado** | `:focus-visible` con outline `accent` (2px) está declarado una sola vez, global, en `src/index.css`. No lo remuevas (`outline-none`) sin poner un reemplazo visible equivalente. |
| **Vacío / sin selección** | Ej. `WorkspacePanel` sin archivo activo: mensaje explicativo centrado en `text-ink-muted`, nunca un panel en blanco sin contexto. |

---

## 5. Cosas a tener en cuenta si extendés la carcasa

- No hay ninguna librería de UI de por medio (ni Radix, ni shadcn) — todo es Tailwind + HTML semántico a mano. Si necesitás un patrón que no existe (tooltip, dropdown), replicá el estilo (bordes `line`, fondos `panel`/`canvas`, radios `rounded-md`) en vez de traer una librería con su propio look.
- `cn()` (en `src/lib/cn.ts`) es el único helper de clases condicionales — no hace falta `clsx`/`tailwind-merge` para el tamaño actual del proyecto.
- El estado "vivo" de la demo (qué archivo está abierto, qué tests corrieron, qué reto está resuelto) vive en `App.tsx`. Si tu contenido real necesita más estado (ej. progreso persistido entre sesiones), es el lugar natural para engancharlo — no dupliques estado dentro de los componentes de presentación.
