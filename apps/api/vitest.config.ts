import path, { join } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": join(import.meta.dirname, "src"),
    },
  },
  test: {
    globals: true,
    globalSetup: "./src/test/database/vitest.setup.ts",
    hookTimeout: 30_000,
    maxWorkers: 1,
  },
});
