import { describe, expect, it } from "vitest";
import { createInventory } from "../src/data/inventoryData.js";
import { filterInventory } from "../src/services/filterInventory.js";
import { inventorySummary } from "../src/services/inventorySummary.js";

describe("filterInventory", () => {
  it("Devuelve únicamente los productos disponibles", () => {
    const inventory = createInventory();

    const result = filterInventory(inventory);

    expect(result.map((product) => product.id)).toEqual([101, 103]);
    expect(result.every((product) => product.available)).toBe(true);
  });

  it("Conserva longitud, orden, propiedades y valores del inventario fuente", () => {
    const inventory = createInventory();
    const original = createInventory();

    filterInventory(inventory);

    expect(inventory).toEqual(original);
  });

  it("Devuelve un arreglo con una referencia independiente", () => {
    const inventory = createInventory();

    const result = filterInventory(inventory);

    expect(result).not.toBe(inventory);
  });

  it("Permite modificar el arreglo resultado sin alterar la fuente", () => {
    const inventory = createInventory();
    const original = createInventory();
    const result = filterInventory(inventory);

    result.pop();
    result.push({
      id: 999,
      name: "Producto temporal",
      available: true,
      stock: 1,
      price: 1,
    });

    expect(inventory).toEqual(original);
  });

  it("Permite modificar objetos del resultado sin alterar los objetos fuente", () => {
    const inventory = createInventory();
    const original = createInventory();
    const result = filterInventory(inventory);

    result[0].name = "Nombre modificado";
    result[0].stock = 999;

    expect(inventory).toEqual(original);
  });

  it("Produce resultados independientes en ejecuciones sucesivas", () => {
    const inventory = createInventory();

    const first = filterInventory(inventory);
    const second = filterInventory(inventory);

    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);

    first[0].stock = 0;
    expect(second[0].stock).toBe(3);
  });

  it("No altera los datos observados por el consumidor de resumen", () => {
    const inventory = createInventory();
    const summaryBeforeFiltering = inventorySummary(inventory);

    filterInventory(inventory);

    expect(inventorySummary(inventory)).toEqual(summaryBeforeFiltering);
  });
});
