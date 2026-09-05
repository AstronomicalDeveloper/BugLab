# Integrar `ChallengePage` en el shell

`ChallengePage` es la experiencia de un caso de debugging. Se monta **dentro** del
shell general: no pinta fondo de página, no trae navegación global, no crea router
y no usa `100vh`/`100vw`.

## Registrar la ruta

Este paquete no depende de `react-router` a propósito, para no imponer una versión
al shell. El adaptador vive del lado del shell y son tres líneas:

```tsx
import { useParams } from "react-router-dom";
import ChallengePage from "./pages/ChallengePage";

function ChallengePageRoute() {
  const { caseId } = useParams();
  return <ChallengePage caseId={caseId!} />;
}

// Dentro del <Routes> del shell:
<Route path="/challenge/:caseId" element={<ChallengePageRoute />} />
```

## Props

| Prop             | Tipo                        | Requerida | Qué hace                                          |
| ---------------- | --------------------------- | --------- | ------------------------------------------------- |
| `caseId`         | `string`                    | Sí        | Id del caso a abrir (el `:caseId` de la ruta).     |
| `onCaseResolved` | `(caseId: string) => void`  | No        | Se invoca **una sola vez**, al pasar todos los tests. Sirve para que el shell actualice su contador de progreso sin store compartido. |

## Layout que espera del shell

Ocupa el **100 % del ancho de su contenedor** y crece en alto según el contenido.
El shell decide el padding exterior, el ancho máximo y el fondo. Internamente pasa
a una sola columna por debajo de 1080 px.

## CSS

Todas las variables llevan el prefijo `--challenge-*` y están declaradas **dentro de
`.challenge-root`**, no en `:root`. No hay nada global que el shell pueda pisar ni
que pise al shell. Los estilos se importan solos desde `ChallengePage`; no hay que
añadir ningún `<link>` ni import extra.

Los tres niveles de vidrio se exponen como clases utilitarias por si el shell quiere
reutilizarlos: `.challenge-surface--level-1` (modal y pestañas), `--level-2`
(paneles de contexto) y `--level-3` (resultados, el más opaco).

**Pendiente de unificar:** el rojo y el amarillo no tenían hex oficial del equipo.
Aquí se usa `--challenge-red: #E8A0A0` / `--challenge-red-text: #8F4646` y
`--challenge-yellow: #E8D28F` / `--challenge-yellow-text: #8F7A2E`. Si el shell fijó
otros, se cambian en `src/styles/tokens.css` y no hay que tocar ningún componente.

## Fuente

`ChallengePage` usa Inter con fallback a la pila del sistema. El `<link>` a Google
Fonts está en `frontend/index.html`; si el shell ya carga Inter, ese link sobra.

## Datos

El caso se lee desde `GET /api/challenges/:id`; `USE_MOCK = false` en
`src/services/api.ts`. Para trabajar temporalmente sin backend puede activarse
el mock cambiando ese valor a `true`.
No hay nada más que cambiar.
