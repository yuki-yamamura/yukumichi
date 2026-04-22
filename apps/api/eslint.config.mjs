import drizzlePlugin from "eslint-plugin-drizzle";
import { defineConfig, globalIgnores } from "eslint/config";

import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";
import { vitestConfig } from "@sanpo/eslint/vitest";

export default defineConfig([
  ...baseConfig,
  ...typescriptConfig,
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
