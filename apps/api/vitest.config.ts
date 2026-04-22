import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    globalSetup: "./src/test/database/vitest.setup.ts",
    hookTimeout: 30_000,
    maxWorkers: 1,
  },
});
