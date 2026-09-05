<div align="center">

# 🐛 BugLab
### Entorno Educativo de Debugging

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Status](https://img.shields.io/badge/Estado-En%20Desarrollo-orange?style=for-the-badge)

> **Hackathon BRODT — Track: Future of Education**
> Aplicación web que convierte el debugging en una experiencia guiada de investigación: sistemas simulados, bugs reales, y validación por comportamiento.

</div>

---

## 🧠 Descripción del Proyecto

**BugLab** es un entorno educativo que enseña a investigar y resolver fallos reales dentro de sistemas simulados. En vez de ejercicios aislados tipo "encuentra el error en esta línea", cada reto presenta un sistema completo con reporte de bug, arquitectura, árbol de archivos y código editable — el estudiante formula hipótesis, interviene el código y valida con tests automáticos.

Está dirigido a estudiantes universitarios de software, participantes de bootcamps y autodidactas que ya conocen fundamentos de programación y necesitan practicar cómo investigar fallos reales, no solo escribir código desde cero.

> ⚠️ **Importante:** la ejecución de código de los estudiantes corre aislada en sandbox/Docker, sin acceso al sistema anfitrión.

---

## 🎯 Desafíos del MVP

```
🟢  BUG-001 — FÁCIL         Condición excluye usuarios de 18 años exactos
🟡  BUG-002 — INTERMEDIO    Formulario oculto se valida antes de abrirse
🔴  BUG-003 — DIFÍCIL       Filtro muta el inventario original por referencia
```

Cada caso se resuelve siguiendo el flujo: **Leer reporte → Revisar arquitectura → Editar código → Ejecutar tests → Pistas (opcional) → Explicación final.**

---

## 🧱 Stack Tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| 🎨 Frontend | React + Vite + TypeScript | Interfaz, editor, navegación de casos |
| ⚙️ Backend | Node.js + Express + TypeScript | Validación de soluciones |
| 🔒 Aislamiento | Docker + Sandbox | Ejecución segura del código del estudiante |
| ✅ Testing | Vitest + React Testing Library | Validación de comportamiento |
| 📦 Datos | JSON | Reportes, arquitectura, pistas, explicaciones |
| 💾 Progreso | localStorage | Progreso local opcional, sin cuentas |

**IA:** no aplica en este MVP.

---

## 📁 Estructura del Proyecto

```
BugLab/
│
├── 📂 backend/
│   ├── 📂 challenges/
│   │   ├── BUG-001/
│   │   ├── BUG-002/
│   │   └── BUG-003/
│   ├── 📂 docker/          ← Aislamiento de ejecución
│   ├── 📂 sandbox/         ← Entorno seguro de validación
│   ├── 📂 src/
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── 📂 frontend/
│   ├── 📂 src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 docs/
│   └── architecture.md
│
└── 📄 README.md
```

---

## 🚀 Instalación y Ejecución

### Clonar el repositorio

```bash
git clone https://github.com/AstronomicalDeveloper/BugLab
cd BugLab
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Integrantes y Roles

| Nombre | GitHub | Rol principal |
|---|---|---|
| Piero Alfonso Paredes Galvez | @pieroparedesg | Diseño y creación de retos (bugs) |
| Wilson Oswaldo Carrasco Farroñan | @WilsonOCF | Frontend |
| Bastian Arias Mandarachi | @Armand-Pat| Frontend |
| Landry Nicol Bardales Guadalupe | @AstronomicalDeveloper | Backend |

> Equipo horizontal: todos colaboraron en distintas partes del proyecto además de su rol principal.

---

<div align="center">

**Hackathon BRODT 2026 — Track Future of Education**

*Aprender a leer código ajeno, un bug a la vez.*

</div>
