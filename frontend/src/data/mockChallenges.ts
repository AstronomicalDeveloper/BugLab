import type { Challenge } from "../types";

/**
 * Datos visibles del catálogo. El workspace obtiene siempre el desafío
 * completo desde GET /api/challenges/:id; esta lista alimenta la landing, el
 * progreso y la navegación entre casos.
 */
export const mockChallenges: Challenge[] = [
  {
    id: "bug-001",
    code: "BUG-001",
    title: "El usuario de 18 años no puede registrarse",
    difficulty: "facil",
    status: "pendiente",
    summary:
      "Quien ingresa exactamente 18 años recibe un error al registrarse, aunque el requisito dice que 18 es una edad válida.",
    concepts: ["Condiciones de frontera", "Lectura de requisitos"],
    report: {
      symptom:
        "El sistema de registro está rechazando a personas que cumplen 18 años justo hoy. Atención al cliente recibió varios reclamos esta semana.",
      expectedBehavior:
        "Cualquier persona de 18 años o más debe poder registrarse. Solo los menores de 18 deben quedar afuera.",
      reportedBy: "Atención al cliente",
      quote:
        "Un usuario nos escribió furioso, cumplió 18 hoy y el formulario le dice que es menor.",
    },
    architecture: {
      summary:
        "El formulario de registro le pregunta la edad a la persona y llama a una función de validación antes de guardar sus datos.",
      nodes: [
        { id: "form", name: "Formulario de registro", role: "Pide la edad y llama a la validación" },
        {
          id: "validator",
          name: "Validador de edad",
          role: "Decide si la persona puede registrarse",
          suspect: true,
        },
        { id: "db", name: "Base de usuarios", role: "Guarda el registro si la validación pasa" },
      ],
    },
    files: [
      { id: "isAdult.js", name: "isAdult.js", kind: "file", access: "editable" },
      { id: "schema.js", name: "schema.js", kind: "file", access: "readonly" },
    ],
    fileContents: {
      "isAdult.js": `function isAdult(age) {\n  return age > 18;\n}\n\nmodule.exports = { isAdult };\n`,
      "schema.js": `// Estructura de datos del usuario (solo lectura)\nconst userSchema = {\n  name: "string",\n  age: "number",\n  email: "string",\n};\n\nmodule.exports = { userSchema };\n`,
    },
    hints: [
      { id: "h1", text: "Fijate qué pasa exactamente cuando age vale 18." },
      { id: "h2", text: "¿'mayor que 18' es lo mismo que '18 o más'?" },
      { id: "h3", text: "El operador de comparación es el problema, no la lógica general." },
    ],
    finalExplanation: {
      title: "Un error de límite (off-by-one)",
      body: "El bug era un operador de comparación: age > 18 excluye justo a quienes tienen 18 años, porque \"18 > 18\" es falso. La condición correcta es age >= 18, que incluye el límite.",
    },
    tests: [
      { id: "t1", name: "Debe aceptar usuarios de exactamente 18 años", passed: null },
      { id: "t2", name: "Debe aceptar usuarios mayores de 18 años", passed: null },
      { id: "t3", name: "Debe rechazar menores de edad", passed: null },
    ],
  },
  {
    id: "bug-002",
    code: "BUG-002",
    title: "El formulario oculto sigue validando",
    difficulty: "intermedio",
    status: "pendiente",
    summary: "Aunque está cerrado, el formulario permanece montado y sigue validando.",
    concepts: ["Ciclo de vida", "Renderizado condicional", "useEffect"],
    report: {
      symptom: "El formulario cerrado sigue montado y valida en segundo plano.",
      expectedBehavior: "Al cerrarlo debe desmontarse y limpiar sus efectos.",
      reportedBy: "Soporte",
      quote: "La validación continúa aunque el formulario ya no se ve.",
    },
    architecture: {
      summary: "RegisterPage controla el montaje de RegisterForm.",
      nodes: [
        { id: "page", name: "RegisterPage", role: "Controla si el formulario está abierto", suspect: true },
        { id: "form", name: "RegisterForm", role: "Valida con un efecto y lo limpia al desmontarse" },
      ],
    },
    files: [
      { id: "src/pages/RegisterPage.jsx", name: "RegisterPage.jsx", kind: "file", access: "editable" },
      { id: "src/components/RegisterForm.jsx", name: "RegisterForm.jsx", kind: "file", access: "readonly" },
    ],
    fileContents: {
      "src/pages/RegisterPage.jsx": `import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm.jsx";

export default function RegisterPage({ onValidation }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "Cerrar formulario" : "Abrir formulario"}
      </button>
      <div style={{ display: isOpen ? "block" : "none" }}>
        <RegisterForm onValidation={onValidation} />
      </div>
    </div>
  );
}
`,
      "src/components/RegisterForm.jsx": "// Auxiliar de solo lectura con validación y limpieza mediante useEffect.\n",
    },
    hints: [
      { id: "h1", text: "Comprueba si RegisterForm sigue en el árbol de React cuando no se ve." },
      { id: "h2", text: "Cambiar display no cambia el ciclo de vida." },
      { id: "h3", text: "Monta RegisterForm solo cuando isOpen sea true." },
    ],
    finalExplanation: {
      title: "Ocultar no es desmontar",
      body: "display: none conserva el componente y sus efectos; el renderizado condicional permite desmontarlo.",
    },
    tests: [
      { id: "closed-unmounted", name: "No monta el formulario mientras está cerrado", passed: null },
      { id: "closed-no-effect", name: "No ejecuta validación mientras está cerrado", passed: null },
      { id: "open-mounts", name: "Monta el formulario al abrirlo", passed: null },
      { id: "clean-first-render", name: "No muestra errores en el primer montaje", passed: null },
      { id: "submit-errors", name: "Muestra errores después de enviar", passed: null },
      { id: "close-unmounts", name: "Desmonta el formulario al cerrarlo", passed: null },
      { id: "cleanup-effects", name: "Detiene la validación después de desmontarlo", passed: null },
    ],
  },
  {
    id: "bug-003",
    code: "BUG-003",
    title: "Filtrar productos altera el inventario original",
    difficulty: "dificil",
    status: "pendiente",
    summary: "El filtro muta referencias compartidas y altera los datos observados por otras capas.",
    concepts: ["Referencias", "Copias superficiales", "Efectos secundarios"],
    report: {
      symptom: "Tras filtrar, el resumen informa menos productos, stock y valor.",
      expectedBehavior: "El resultado debe ser independiente sin alterar la fuente.",
      reportedBy: "Inventario",
      quote: "El resumen cambia aunque esa capa nunca escribió sobre los datos.",
    },
    architecture: {
      summary: "filterInventory e inventorySummary consumen el mismo inventario.",
      nodes: [
        { id: "data", name: "inventoryData", role: "Crea el inventario" },
        { id: "filter", name: "filterInventory", role: "Selecciona disponibles", suspect: true },
        { id: "summary", name: "inventorySummary", role: "Calcula productos, stock y valor" },
      ],
    },
    files: [
      { id: "src/data/inventoryData.js", name: "inventoryData.js", kind: "file", access: "readonly" },
      { id: "src/services/filterInventory.js", name: "filterInventory.js", kind: "file", access: "editable" },
      { id: "src/services/inventorySummary.js", name: "inventorySummary.js", kind: "file", access: "readonly" },
    ],
    fileContents: {
      "src/data/inventoryData.js": "// Fábrica confiable de inventario.\n",
      "src/services/filterInventory.js": `export function filterInventory(inventory) {
  const availableProducts = inventory;
  for (let index = availableProducts.length - 1; index >= 0; index--) {
    if (!availableProducts[index].available) availableProducts.splice(index, 1);
  }
  return availableProducts;
}
`,
      "src/services/inventorySummary.js": "// Consumidor confiable que calcula productos, stock y valor.\n",
    },
    hints: [
      { id: "h1", text: "Compara el inventario antes y después de filtrar." },
      { id: "h2", text: "Dos variables pueden apuntar al mismo array." },
      { id: "h3", text: "Un array nuevo todavía puede compartir sus objetos." },
    ],
    finalExplanation: {
      title: "Mutación y referencias compartidas",
      body: "Aislar el resultado exige un array nuevo y objetos independientes.",
    },
    tests: [
      { id: "only-available", name: "Devuelve únicamente los productos disponibles", passed: null },
      { id: "source-unchanged", name: "Conserva el inventario fuente", passed: null },
      { id: "independent-array", name: "Devuelve un arreglo independiente", passed: null },
      { id: "array-isolation", name: "Aísla las modificaciones del arreglo resultado", passed: null },
      { id: "object-isolation", name: "Aísla las modificaciones de objetos", passed: null },
      { id: "independent-runs", name: "Produce ejecuciones independientes", passed: null },
      { id: "consumer-isolation", name: "No altera el resumen del inventario", passed: null },
    ],
  },
];
