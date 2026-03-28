import { vitestConfig } from "@sanpo/eslint/vitest";
import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", ".open-next/**", "out/**", "build/**", "next-env.d.ts"]),
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.test.{ts,tsx}"],
    ...vitestConfig,
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    ...testingLibrary.configs["flat/react"],
  },
]);

export default eslintConfig;
