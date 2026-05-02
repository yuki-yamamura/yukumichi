import { join } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": join(import.meta.dirname, "src"),
    },
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "small",
          include: ["./src/**/*.test.ts"],
          exclude: ["./src/**/*.medium.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "medium",
          include: ["./src/**/*.medium.test.ts"],
          globalSetup: "./vitest.setup.medium.ts",
          hookTimeout: 30_000,
          maxWorkers: 1,
        },
      },
    ],
  },
});
