import { baseConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";
import { vitestConfig } from "@sanpo/eslint/vitest";

import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "generated/**",
    "storybook-static/**",
  ]),
  reactHooks.configs.flat["recommended-latest"],
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.test.{ts,tsx}"],
    ...vitestConfig,
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    ...testingLibrary.configs["flat/react"],
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/self-closing-comp": "error",
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "unsorted",
          customGroups: [
            { groupName: "reserved", elementNamePattern: "^(key|ref)$" },
            { groupName: "render", elementNamePattern: "^render[A-Z]" },
            { groupName: "callback", elementNamePattern: "^on[A-Z]" },
            { groupName: "className", elementNamePattern: "^className$" },
          ],
          groups: ["reserved", "shorthand-prop", "render", "unknown", "callback", "className"],
        },
      ],
    },
  },
  prettierConfig,
]);

export default eslintConfig;
