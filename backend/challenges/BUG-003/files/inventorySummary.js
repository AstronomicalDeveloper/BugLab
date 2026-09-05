export function inventorySummary(inventory) {
  return {
    productCount: inventory.length,
    totalStock: inventory.reduce((total, product) => total + product.stock, 0),
    totalValue: inventory.reduce(
      (total, product) => total + product.stock * product.price,
      0,
    ),
  };
}
