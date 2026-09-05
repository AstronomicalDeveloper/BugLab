export function filterAvailableProducts(inventory) {
  for (let i = inventory.length - 1; i >= 0; i--) {
    if (!inventory[i].available) {
      inventory.splice(i, 1); // bug: muta el arreglo original
    }
  }
  return inventory;
}