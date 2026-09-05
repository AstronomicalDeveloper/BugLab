import { describe, expect, it } from "vitest";
import { filterAvailableProducts } from "../files/validation.js";

describe("filterAvailableProducts", () => {
  it("Devuelve solo los productos disponibles", () => {
    const inventory = [
      { id: 1, available: true },
      { id: 2, available: false },
      { id: 3, available: true },
    ];
    const result = filterAvailableProducts(inventory);
    expect(result.every((p) => p.available)).toBe(true);
  });

  it("No altera el tamaño del inventario original al filtrar", () => {
    const inventory = [
      { id: 1, available: true },
      { id: 2, available: false },
      { id: 3, available: true },
    ];
    const originalLength = inventory.length;
    filterAvailableProducts(inventory);
    expect(inventory.length).toBe(originalLength);
  });

  it("Filtrar dos veces seguidas da el mismo resultado", () => {
    const inventory = [
      { id: 1, available: true },
      { id: 2, available: false },
      { id: 3, available: true },
    ];
    const first = filterAvailableProducts([...inventory]).length;
    const second = filterAvailableProducts([...inventory]).length;
    expect(first).toBe(second);
  });
});