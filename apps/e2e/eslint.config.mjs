import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";
import playwright from "eslint-plugin-playwright";

import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  ...typescriptConfig,
  ...baseConfig,
  {
    files: ["**/*.ts"],
    ...playwright.configs["flat/recommended"],
  },
  prettierConfig,
]);

export default eslintConfig;
