# Explicación — BUG-003

## Causa raíz
`filterAvailableProducts` usa `splice` dentro de un bucle, mutando directamente el arreglo recibido en vez de construir uno nuevo. Cada filtrado elimina permanentemente los productos no disponibles del inventario original.

## Razonamiento
Cuando una función recibe una colección y la modifica con métodos como `splice`, `push` o `sort`, cualquier otra parte del sistema que comparta esa misma referencia se ve afectada. Filtrar no debería alterar los datos de origen.

## Concepto transferible
Preferir operaciones inmutables (`filter`, `map`, `[...arr]`) sobre operaciones que mutan in place evita efectos secundarios inesperados al compartir datos entre distintas partes de una aplicación.