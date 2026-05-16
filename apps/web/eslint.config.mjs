import { baseConfig, typescriptConfig } from "@yukumichi/eslint/base";
import { prettierConfig } from "@yukumichi/eslint/prettier";
import { vitestConfig } from "@yukumichi/eslint/vitest";

import boundaries from "eslint-plugin-boundaries";
import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";
import reactHooks from "eslint-plugin-react-hooks";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...typescriptConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    ".storybook/**",
    "next-env.d.ts",
    "generated/**",
    "storybook-static/**",
    "vitest.d.ts",
    "vitest.setup.ts",
  ]),
  reactHooks.configs.flat["recommended-latest"],
  reactYouMightNotNeedAnEffect.configs.strict,
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
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ group: ["@base-ui/react"] }],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "feature", pattern: "src/features/*", mode: "folder", capture: ["featureName"] },
        { type: "components", pattern: "src/components/*", mode: "folder" },
        { type: "shared", pattern: "src/shared/*", mode: "folder" },
        { type: "utils", pattern: "src/utils/**/*", mode: "file" },
        { type: "lib", pattern: "src/lib/*", mode: "folder" },
      ],
      "boundaries/flag-as-external": {
        customSourcePatterns: ["@yukumichi/**"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          rules: [
            {
              from: { type: "feature" },
              disallow: {
                to: {
                  captured: { featureName: "!{{from.captured.featureName}}" },
                  type: "feature",
                },
              },
            },
            {
              from: { type: "shared" },
              disallow: { to: { type: "feature" } },
            },
            {
              from: { type: "components" },
              disallow: { to: { type: ["feature", "shared"] } },
            },
            {
              from: { type: "utils" },
              disallow: { to: { type: ["feature", "shared", "components", "lib"] } },
            },
            {
              from: { type: "lib" },
              disallow: { to: { type: ["feature", "shared"] } },
            },
          ],
        },
      ],
    },
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
