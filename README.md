<div align="center">

**English** | [Español](README.es.md)

# 🐛 BugLab

**Learn debugging by investigating bugs in small, simulated software systems.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![Status](https://img.shields.io/badge/Status-Hackathon%20MVP-informational)

**BRODT Hackathon 2026 · Future of Education**

</div>

> **Project status:** This prototype was developed for a hackathon and is now maintained as an educational and portfolio project. The public demo has been taken offline. **It is not suitable for running untrusted code as a public service.** See [known limitations and lessons learned](docs/lessons-learned.md) (in Spanish).

## What is BugLab?

BugLab focuses on an important programming skill that introductory exercises can overlook: investigating why **an existing system** behaves incorrectly.

Each challenge includes a bug report, architectural context, files to explore, editable code, progressive hints, and automated tests. Tests check the expected behavior rather than comparing a submission against one predefined solution.

### MVP challenges

| Challenge | Difficulty | Bug |
| --- | --- | --- |
| BUG-001 | Easy | A condition excludes users who are exactly 18 years old |
| BUG-002 | Intermediate | A hidden form is validated before it is opened |
| BUG-003 | Hard | Filtering changes the original inventory through shared references |

## Tech stack

- **Frontend:** React 19, Vite, TypeScript.
- **Backend:** Node.js, Express, TypeScript.
- **Testing:** Vitest and React Testing Library for the applicable challenges.
- **Execution:** Docker-based runner used to isolate code tests.
- **Content:** Challenge definitions and metadata stored in JSON files.

> Docker alone does not guarantee secure execution. The prototype's safeguards should not be interpreted as proof of a completed security audit.

## Explore the project locally

**Requirements:** Node.js and npm versions compatible with the project's dependencies. Running code validation also requires Docker and the runner image configured for the backend.

```bash
git clone https://github.com/AstronomicalDeveloper/BugLab.git
cd BugLab

# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2 (from the repository root)
cd frontend
npm install
npm run dev
```

Depending on your environment, the frontend may need its API URL configured. Validation additionally requires building the `buglab-runner:latest` Docker image (or setting `BUGLAB_RUNNER_IMAGE`). **Do not expose the API to the internet** to test this prototype.

### Available commands

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

These commands are declared in the corresponding packages; **their current success has not been independently verified here**. Test coverage and reliability remain documented limitations.

## Documentation

- [Architecture](docs/architecture.md) (Spanish)
- [Lessons learned and known limitations](docs/lessons-learned.md) (Spanish)

## Team

| Team member | GitHub | Contribution |
| --- | --- | --- |
| Piero Alfonso Paredes Galvez | [@pieroparedesg](https://github.com/pieroparedesg) | Challenge design and creation |
| Wilson Oswaldo Carrasco Farroñan | [@WilsonOCF](https://github.com/WilsonOCF) | Frontend |
| Bastian Arias Mandarachi | [@Armand-Pat](https://github.com/Armand-Pat) | Frontend |
| Landry Bardales Guadalupe | [@AstronomicalDeveloper](https://github.com/AstronomicalDeveloper) | Backend and validation |

## Scope and future work

BugLab is presented as a hackathon MVP, including its original scope decisions and opportunities for improvement. It is **not** a production-ready platform, and no online demo is currently offered.

This repository documents the team's implementation and technical learning.
