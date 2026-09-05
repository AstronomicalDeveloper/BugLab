# Explicación — BUG-001

## Causa raíz
La condición `age > 18` excluye por error el valor límite (18), cuando el requisito indica que esa edad sí debe ser válida.

## Razonamiento
Un síntoma visible (el registro falla) no siempre delata la causa exacta a simple vista; hay que comparar la condición implementada contra el requisito real, especialmente en los valores de frontera.

## Concepto transferible
Las condiciones de frontera (*boundary conditions*) son una fuente común de bugs; siempre vale la pena preguntarse si el límite debe incluirse o excluirse.