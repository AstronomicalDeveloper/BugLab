# Explicación — BUG-002

## Causa raíz
`RegisterPage` cambia `display` para ocultar el formulario, pero sigue renderizando `RegisterForm`. El componente permanece montado y su `useEffect` continúa validando aunque el usuario crea que está cerrado.

## Razonamiento
CSS puede ocultar un nodo, pero no altera su ciclo de vida en React. Para que la función de limpieza del efecto se ejecute al cerrar, el componente debe salir del árbol mediante renderizado condicional: `{isOpen && <RegisterForm />}`.

## Concepto transferible
Ocultar visualmente y desmontar son operaciones distintas. Cuando un componente posee suscripciones, temporizadores u otros efectos, decidir si permanece montado también determina si esos efectos siguen activos y cuándo se ejecuta su limpieza.
