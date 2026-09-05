export function filterInventory(inventory) {
  // Se reutiliza la colección recibida para "evitar crear arreglos extra".
  // Otros consumidores conservan esta misma referencia.
  const availableProducts = inventory;

  for (let index = availableProducts.length - 1; index >= 0; index--) {
    if (!availableProducts[index].available) {
      availableProducts.splice(index, 1);
    }
  }

  return availableProducts;
}
