import { describe, expect, it } from "vitest";
import { isAgeValid } from "../src/utils/validation.js";

describe("isAgeValid", () => {
  it("Acepta edad = 18", () => expect(isAgeValid(18)).toBe(true));
  it("Acepta edad = 19", () => expect(isAgeValid(19)).toBe(true));
  it("Rechaza edad = 17", () => expect(isAgeValid(17)).toBe(false));
  it("Rechaza edad negativa", () => expect(isAgeValid(-1)).toBe(false));
});
