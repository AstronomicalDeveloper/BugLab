# Explicación — BUG-003

## Causa raíz
`filterInventory` asigna el inventario recibido a otra variable, pero esa asignación no crea una copia: ambas variables apuntan al mismo array. Al usar `splice`, elimina productos directamente de la colección compartida y devuelve además esa misma referencia.

## Razonamiento
Los arrays y objetos se manejan mediante referencias. Una mutación *in-place* como `splice`, `push` o `sort` cambia el valor observado por todas las capas que conserven esa referencia. Por eso `inventorySummary`, aunque solo lea datos, termina calculando menos productos, stock y valor después de que otra capa aplica el filtro.

Crear otro array resuelve únicamente parte del problema. Operaciones como `filter` o `[...inventory]` producen un array distinto, pero sus elementos siguen siendo los mismos objetos: es una copia superficial (*shallow copy*). Si quien recibe el resultado cambia `stock`, `name` u otra propiedad, el objeto del inventario fuente también cambia.

El filtro debe construir una colección independiente y crear copias de los productos seleccionados. Así cada capa recibe datos que puede manipular sin contaminar la fuente ni las ejecuciones posteriores.

## Concepto transferible
Evitar efectos secundarios requiere identificar todos los niveles de referencia compartida. Copiar el contenedor no implica copiar sus elementos; el grado de aislamiento necesario depende de qué partes de la estructura podrán modificarse en cada capa.
