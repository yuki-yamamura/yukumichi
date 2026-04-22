import playwright from "eslint-plugin-playwright";
import { defineConfig } from "eslint/config";

import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...typescriptConfig,
  {
    files: ["**/*.ts"],
    ...playwright.configs["flat/recommended"],
  },
  prettierConfig,
]);

export default eslintConfig;
