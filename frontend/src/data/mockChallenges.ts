import type { Challenge } from "../types";

/**
 * Contenido DEMO para probar que el layout funciona de punta a punta.
 * Reusa los 3 casos redactados en la sesión anterior (BUG-001/002/003).
 * Tu compañero reemplaza esto por la fuente real de datos de cada bug —
 * el layout no depende de que este archivo exista tal cual.
 */
export const mockChallenges: Challenge[] = [
  {
    id: "bug-001",
    code: "BUG-001",
    title: "El corte de los 18",
    difficulty: "facil",
    status: "pendiente",
    summary:
      "Una persona que cumple 18 años hoy no puede registrarse. El formulario le dice que es menor de edad.",
    concepts: ["Operadores de comparación", "Casos límite"],
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
    title: "El formulario que no se quiere ir",
    difficulty: "intermedio",
    status: "pendiente",
    summary:
      "Al reabrir un formulario emergente aparecen errores de validación que nadie provocó, como si nunca se hubiera cerrado.",
    concepts: ["Ciclo de vida de componentes", "Efectos en React"],
    report: {
      symptom:
        "Cuando alguien cierra un formulario emergente y lo vuelve a abrir, a veces ve datos o errores de validación que no deberían estar ahí, como si el formulario nunca se hubiera cerrado del todo.",
      expectedBehavior:
        "Al ocultar el formulario, este debería dejar de existir de verdad (desmontarse) y no seguir corriendo validaciones en segundo plano.",
      reportedBy: "Soporte",
      quote: "El usuario dice que ve un mensaje de error antes de escribir nada, apenas abre el formulario de nuevo.",
    },
    architecture: {
      summary:
        "Un panel principal decide cuándo mostrar el formulario. El formulario, apenas se monta, corre una validación automática.",
      nodes: [
        { id: "panel", name: "Panel principal", role: "Decide si el formulario está visible u oculto", suspect: true },
        { id: "form", name: "Formulario de inscripción", role: "Valida los datos apenas se monta", suspect: true },
      ],
    },
    files: [
      {
        id: "components",
        name: "components",
        kind: "folder",
        children: [
          { id: "PanelPrincipal.js", name: "PanelPrincipal.js", kind: "file", access: "editable" },
          { id: "InscripcionForm.js", name: "InscripcionForm.js", kind: "file", access: "editable" },
        ],
      },
    ],
    fileContents: {
      "PanelPrincipal.js": `function PanelPrincipal({ visible }) {\n  return (\n    <div style={{ display: visible ? "block" : "none" }}>\n      <InscripcionForm />\n    </div>\n  );\n}\n`,
      "InscripcionForm.js": `function InscripcionForm() {\n  useEffect(() => {\n    validarFormulario();\n  }, []);\n\n  return <form>{/* campos del formulario */}</form>;\n}\n`,
    },
    hints: [
      { id: "h1", text: "Ocultar un elemento visualmente (con estilos) no es lo mismo que dejar de renderizarlo." },
      { id: "h2", text: "Si el componente sigue montado, su useEffect no se vuelve a limpiar ni a resetear." },
      { id: "h3", text: "Buscá dónde se decide 'visible' y cómo se usa esa variable para mostrar el formulario." },
    ],
    finalExplanation: {
      title: "Ocultar no es lo mismo que desmontar",
      body: "El panel ocultaba el formulario con display: none en vez de dejar de renderizarlo. Como React nunca lo desmontaba, el useEffect que valida al montarse quedaba 'pegado' a un estado viejo. La solución es renderizar condicionalmente ({visible && <InscripcionForm />}).",
    },
    tests: [
      { id: "t1", name: "El formulario se desmonta realmente al ocultarse", passed: null },
      { id: "t2", name: "La validación no corre antes de que el usuario escriba algo", passed: null },
      { id: "t3", name: "Ocultar el formulario no dispara efectos duplicados", passed: null },
    ],
  },
  {
    id: "bug-003",
    code: "BUG-003",
    title: "El inventario que cambia solo",
    difficulty: "dificil",
    status: "pendiente",
    summary:
      "Filtrar productos por categoría hace desaparecer artículos del inventario general, como si el filtro los borrara.",
    concepts: ["Mutación por referencia", "Métodos de arreglos"],
    report: {
      symptom:
        "Cada vez que alguien filtra el inventario por categoría en el panel de administración, algunos productos desaparecen del inventario general, como si el filtro borrara cosas de verdad.",
      expectedBehavior:
        "Filtrar por categoría debe mostrar una lista nueva con los productos que coinciden, sin tocar ni un dato del inventario original.",
      reportedBy: "Depósito",
      quote: "Filtramos por 'bebidas' para armar un pedido y cuando volvimos a la vista general, faltaban productos de otras categorías.",
    },
    architecture: {
      summary:
        "Una función de filtrado recibe el inventario completo y una categoría, y debería devolver una lista nueva sin alterar la original.",
      nodes: [
        { id: "panel", name: "Panel de inventario", role: "Muestra la lista completa de productos" },
        { id: "filter", name: "Filtro por categoría", role: "Debería generar una copia filtrada, no tocar el original", suspect: true },
      ],
    },
    files: [
      { id: "filterByCategory.js", name: "filterByCategory.js", kind: "file", access: "editable" },
      { id: "inventory.seed.js", name: "inventory.seed.js", kind: "file", access: "readonly" },
    ],
    fileContents: {
      "filterByCategory.js": `function filterByCategory(inventory, category) {\n  for (let i = inventory.length - 1; i >= 0; i--) {\n    if (inventory[i].category !== category) {\n      inventory.splice(i, 1);\n    }\n  }\n  return inventory;\n}\n\nmodule.exports = { filterByCategory };\n`,
      "inventory.seed.js": `// Datos de ejemplo del inventario (solo lectura)\nconst inventory = [\n  { id: 1, name: "Agua mineral", category: "bebidas" },\n  { id: 2, name: "Jugo de naranja", category: "bebidas" },\n  { id: 3, name: "Arroz", category: "almacen" },\n];\n\nmodule.exports = { inventory };\n`,
    },
    hints: [
      { id: "h1", text: "¿El arreglo que recibe la función es el mismo que se usa después, o una copia?" },
      { id: "h2", text: "Métodos como splice, sort o push modifican el arreglo original; filter y map devuelven uno nuevo." },
      { id: "h3", text: "Fijate si la función devuelve una lista nueva o el mismo arreglo que le pasaron, ya modificado." },
    ],
    finalExplanation: {
      title: "Mutación por referencia",
      body: "La función usaba splice() para sacar productos del arreglo original (mutación por referencia) y después devolvía esa misma referencia ya alterada. La solución es construir la lista con inventory.filter(...), que siempre devuelve un arreglo nuevo.",
    },
    tests: [
      { id: "t1", name: "Debe devolver solo los productos de la categoría pedida", passed: null },
      { id: "t2", name: "No debe modificar el inventario original", passed: null },
      { id: "t3", name: "Debe devolver una lista nueva, no la misma referencia", passed: null },
    ],
  },
];
