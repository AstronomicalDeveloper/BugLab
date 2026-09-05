import { describe, expect, it } from "vitest";
import { shouldShowErrors } from "../files/validation.js";

describe("shouldShowErrors", () => {
  it("No muestra errores antes de enviar", () => {
    expect(shouldShowErrors(false)).toBe(false);
  });
  it("Muestra errores después de enviar", () => {
    expect(shouldShowErrors(true)).toBe(true);
  });
});