import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";
import drizzlePlugin from "eslint-plugin-drizzle";
import { vitestConfig } from "@sanpo/eslint/vitest";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...typescriptConfig,
  ...baseConfig,
  globalIgnores(["dist/**"]),
  {
    plugins: {
      drizzle: drizzlePlugin,
    },
    rules: {
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
    },
  },
  {
    files: ["**/*.test.ts"],
    ...vitestConfig,
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "drizzle/enforce-delete-with-where": "off",
    },
  },
  prettierConfig,
]);
