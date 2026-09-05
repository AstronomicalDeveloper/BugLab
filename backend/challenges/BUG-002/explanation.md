# Explicación — BUG-002

## Causa raíz
La función `shouldShowErrors` siempre devuelve `true`, sin importar si el usuario ya intentó enviar el formulario, por lo que los errores se muestran desde el inicio.

## Razonamiento
Que un dato exista (los valores del formulario) no significa que ya deba evaluarse ni mostrarse. Hay que distinguir entre "tener datos" y "el momento correcto para validarlos y mostrarlos", que en este caso es el intento de envío.

## Concepto transferible
Condicionar cuándo se ejecuta o se muestra una lógica de validación a una acción explícita del usuario (como enviar) evita mostrar retroalimentación antes de tiempo.