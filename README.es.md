<div align="center">

[English](README.md) | **Español**

# 🐛 BugLab

**Aprender debugging investigando errores en pequeños sistemas simulados.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-MVP%20de%20hackathon-informational)

**BRODT Hackathon 2026 · Future of Education**

</div>

> **Estado del proyecto:** prototipo desarrollado para una hackathon. Se conserva como proyecto educativo y de portafolio; la demo pública ya fue retirada. **No está preparado para ejecutar código no confiable en un servicio público.** Consulta [limitaciones y aprendizajes](docs/lessons-learned.md).

## ¿Qué es BugLab?

BugLab propone practicar una habilidad que suele quedar fuera de los ejercicios introductorios: investigar por qué falla **un sistema existente**.

Cada desafío incluye un reporte de bug, contexto arquitectónico, archivos para explorar, código editable, pistas progresivas y validación mediante pruebas automatizadas. Las pruebas evalúan el comportamiento esperado, no una única respuesta textual.

### Desafíos del MVP

| Reto | Nivel | Problema |
| --- | --- | --- |
| BUG-001 | Fácil | Una condición excluye a personas de exactamente 18 años |
| BUG-002 | Intermedio | Un formulario oculto se valida antes de abrirse |
| BUG-003 | Difícil | Un filtro modifica el inventario original debido a referencias compartidas |

## Tecnologías

- **Frontend:** React 19, Vite, TypeScript.
- **Backend:** Node.js, Express, TypeScript.
- **Validación:** Vitest y React Testing Library para los casos que lo requieren.
- **Ejecución:** runner basado en Docker para aislar pruebas de código.
- **Contenido:** desafíos y metadatos definidos en archivos JSON.

> Docker por sí solo no garantiza un entorno seguro. Los límites y controles del prototipo no deben interpretarse como una auditoría de seguridad.

## Cómo explorar el proyecto localmente

**Requisitos:** Node.js y npm compatibles con las dependencias del proyecto. Para ejecutar validaciones se necesita Docker y la imagen del runner configurada en el backend.

```bash
git clone https://github.com/AstronomicalDeveloper/BugLab.git
cd BugLab

# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2 (desde la raíz del repositorio)
cd frontend
npm install
npm run dev
```

La interfaz puede requerir configurar la URL de la API según el entorno. Ejecutar validaciones requiere además preparar la imagen Docker `buglab-runner:latest` (o definir `BUGLAB_RUNNER_IMAGE`). No expongas la API a Internet para probar el prototipo.

### Comandos disponibles

```bash
# Backend
cd backend
npm run build
npm run test

# Frontend
cd frontend
npm run build
npm run lint
```

Estos son comandos definidos por los paquetes; **no se afirma aquí que todos pasen actualmente**. La cobertura y la fiabilidad de las pruebas forman parte de las limitaciones documentadas.

## Documentación

- [Arquitectura](docs/architecture.md)
- [Aprendizajes y limitaciones conocidas](docs/lessons-learned.md)

## Equipo

| Integrante | GitHub | Contribución |
| --- | --- | --- |
| Piero Alfonso Paredes Galvez | [@pieroparedesg](https://github.com/pieroparedesg) | Diseño y creación de desafíos |
| Wilson Oswaldo Carrasco Farroñan | [@WilsonOCF](https://github.com/WilsonOCF) | Frontend |
| Bastian Arias Mandarachi | [@Armand-Pat](https://github.com/Armand-Pat) | Frontend |
| Landry Bardales Guadalupe | [@AstronomicalDeveloper](https://github.com/AstronomicalDeveloper) | Backend y validación |

## Alcance y continuidad

El proyecto se presenta tal como surgió en la hackathon, con sus decisiones de alcance y oportunidades de mejora. No se ofrece como plataforma de producción, ni se garantiza un servicio online activo.

Este repositorio es una muestra del trabajo y del aprendizaje técnico del equipo.
