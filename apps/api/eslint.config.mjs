import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";
import { vitestConfig } from "@sanpo/eslint/vitest";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...typescriptConfig,
  ...baseConfig,
  globalIgnores(["dist/**"]),
  {
    files: ["**/*.test.ts"],
    ...vitestConfig,
  },
  prettierConfig,
]);
