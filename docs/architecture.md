# Arquitectura — BugLab

## 1. Visión general

BugLab es una aplicación web con arquitectura frontend/backend desacoplada. El frontend gestiona la experiencia del estudiante (lectura del caso, edición de código); el backend ejecuta la validación de la solución de forma aislada (sandbox/Docker) y devuelve los resultados de los tests.

```mermaid
flowchart TB
    subgraph Frontend["🎨 Frontend (React + Vite + TS)"]
        UI[Interfaz del estudiante]
        Editor[Editor de código]
        Report[Reporte del bug]
        Results[Resultados de tests]
    end

    subgraph Backend["⚙️ Backend (Node.js + Express + TS)"]
        API[API de validación]
        Runner[Motor de ejecución]
    end

    subgraph Sandbox["🔒 Aislamiento"]
        Docker[Docker / Sandbox]
        Vitest[Vitest + RTL]
    end

    subgraph Data["📦 Datos"]
        JSON[(Casos en JSON)]
        LocalStorage[(localStorage - progreso)]
    end

    UI --> Report
    UI --> Editor
    Editor -- "Enviar solución" --> API
    API --> Runner
    Runner --> Docker
    Docker --> Vitest
    Vitest -- "Resultados" --> Runner
    Runner -- "Resultados" --> API
    API -- "Respuesta JSON" --> Results
    Results --> UI

    JSON -.-> UI
    JSON -.-> Runner
    UI -.-> LocalStorage
```

## 2. Módulos

| Módulo | Ubicación | Responsabilidad |
|---|---|---|
| UI del caso | `frontend/src` | Mostrar reporte, arquitectura simplificada, árbol de archivos y editor |
| API de validación | `backend/src` | Recibir la solución del estudiante y coordinar la ejecución |
| Casos (challenges) | `backend/challenges/BUG-001..003` | Definición de cada reto: código inicial, tests, pistas, explicación |
| Sandbox | `backend/sandbox`, `backend/docker` | Aislar la ejecución de código enviado por el estudiante |
| Motor de tests | Vitest + React Testing Library | Validar comportamiento observable, no comparación exacta de código |

## 3. Comunicación Frontend ↔ Backend

```mermaid
sequenceDiagram
    participant E as Estudiante (Frontend)
    participant A as API (Backend)
    participant S as Sandbox (Docker)

    E->>A: POST /api/challenges/:id/submit (código editado)
    A->>S: Ejecutar código en entorno aislado
    S->>S: Correr tests de comportamiento (Vitest)
    S-->>A: Resultado (pasa/falla por test)
    A-->>E: JSON con resultados + pistas disponibles
```
