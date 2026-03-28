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
      ...drizzlePlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.test.ts"],
    ...vitestConfig,
  },
  prettierConfig,
]);
