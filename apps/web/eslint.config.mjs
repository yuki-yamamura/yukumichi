import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";
import { vitestConfig } from "@sanpo/eslint/vitest";

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
        { capture: ["featureName"], mode: "folder", pattern: "src/features/*", type: "feature" },
        { capture: ["family"], mode: "folder", pattern: "src/components/*", type: "components" },
        { capture: ["name"], mode: "folder", pattern: "src/shared/*", type: "shared" },
        { capture: ["fileName"], mode: "file", pattern: "src/utils/**/*", type: "utils" },
        { capture: ["name"], mode: "folder", pattern: "src/lib/*", type: "lib" },
      ],
      "boundaries/flag-as-external": {
        customSourcePatterns: ["@sanpo/**"],
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
              disallow: {
                to: {
                  captured: { featureName: "!{{from.captured.featureName}}" },
                  type: "feature",
                },
              },
              from: { type: "feature" },
              message:
                "Features must not import from other features. Promote the shared code to `components/`, `lib/`, `utils/`, or `shared/`.",
            },
            {
              disallow: { to: { type: ["feature", "shared"] } },
              from: { type: "components" },
              message: "`components/` cannot depend on `features/` or `shared/`.",
            },
            {
              disallow: { to: { type: "feature" } },
              from: { type: "shared" },
              message: "`shared/` cannot depend on `features/`.",
            },
            {
              disallow: { to: { type: ["feature", "shared", "components"] } },
              from: { type: "utils" },
              message:
                "`utils/` must stay pure — no `features/`, `shared/`, or `components/` imports.",
            },
            {
              disallow: { to: { type: ["feature", "shared"] } },
              from: { type: "lib" },
              message: "`lib/` cannot depend on `features/` or `shared/`.",
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
