import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Los tests oficiales solo deben ejecutarse después de copiarlos al sandbox.
    exclude: [...configDefaults.exclude, "challenges/**", "temp/**"],
  },
});
