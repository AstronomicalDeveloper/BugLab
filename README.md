<div align="center">

# 🐛 BugLab

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Status](https://img.shields.io/badge/Estado-Completo-brightgreen?style=for-the-badge)

**🔗 [Ver demo en producción](http://buglab.astrodev.pe/)**

</div>

## 1. Nombre y Misión

**BugLab** — entorno educativo de debugging que enseña a investigar y resolver fallos reales dentro de sistemas simulados, mediante retos con reporte, arquitectura y tests automáticos.

---

## 2. Problema & Enfoque Lean

**Problema:** los estudiantes de programación tienen pocas oportunidades de practicar debugging estructurado sobre código ajeno; la mayoría de ejercicios enseña a escribir código desde cero, no a diagnosticar fallos existentes.

**Usuario objetivo:** estudiantes universitarios de software, participantes de bootcamps y autodidactas que ya conocen fundamentos de programación y necesitan practicar cómo investigar fallos.

**MVP (completo):** 3 desafíos de debugging (fácil, intermedio y difícil), cada uno con reporte de bug, arquitectura simplificada, árbol de archivos, código editable, pistas progresivas, tests de comportamiento automáticos y explicación final.

```
🟢  BUG-001 — FÁCIL         Condición excluye usuarios de 18 años exactos
🟡  BUG-002 — INTERMEDIO    Formulario oculto se valida antes de abrirse
🔴  BUG-003 — DIFÍCIL       Filtro muta el inventario original por referencia
```

---

## 3. Stack Tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| 🎨 Frontend | React + Vite + TypeScript | Interfaz, editor, navegación de casos |
| ⚙️ Backend | Node.js + Express + TypeScript | Validación de soluciones |
| 🔒 Aislamiento | Docker + Sandbox | Ejecución segura del código del estudiante |
| ✅ Testing | Vitest + React Testing Library | Validación de comportamiento |
| 📦 Datos | JSON | Reportes, arquitectura, pistas, explicaciones |
| 💾 Progreso | localStorage | Progreso local opcional, sin cuentas |
| ☁️ Despliegue | http://buglab.astrodev.pe/ | Frontend y backend en producción |

---

## 4. Cómo usar BugLab

1. Entra a la [demo en producción](http://buglab.astrodev.pe/)
2. Elige un desafío (BUG-001, BUG-002 o BUG-003)
3. Lee el reporte del bug y revisa la arquitectura del mini-sistema
4. Explora el árbol de archivos y edita el código en el editor integrado
5. Ejecuta los tests para validar tu solución
6. Si te trabas, pide una pista progresiva
7. Al resolverlo, lee la explicación final que conecta el bug con el concepto aprendido

---

## 5. Setup Local (para desarrollo)

```bash
git clone https://github.com/AstronomicalDeveloper/BugLab
cd BugLab

# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

---

## 6. Testing

```bash
cd backend
npm run test
```
Incluye pruebas de happy path (resolución correcta de un desafío) y de manejo de errores críticos (código con errores de sintaxis enviado a validar).

---

## 7. Documentación

- 📐 [Diagrama de Arquitectura](docs/architecture.md)
- 🎤 [Pitch Deck](docs/pitch.pdf)

---

## 8. Integrantes & Roles

| Nombre completo | Usuario de GitHub | Rol |
|---|---|---|
| Piero Alfonso Paredes Galvez | @pieroparedesg | Diseño y creación de retos (bugs) |
| Wilson Oswaldo Carrasco Farroñan | @WilsonOCF | Frontend |
| Bastian Arias Mandarachi | @Armand-Pat | Frontend |
| Landry Nicol Bardales Guadalupe | @AstronomicalDeveloper | Backend |

---

<div align="center">

**Hackathon BRODT 2026 — Track Future of Education**

</div>
