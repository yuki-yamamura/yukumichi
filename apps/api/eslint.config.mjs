import boundaries from "eslint-plugin-boundaries";
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
    files: ["src/**/*.ts"],
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { capture: ["fileName"], mode: "file", pattern: "src/test/**/*", type: "test" },
        { capture: ["fileName"], mode: "file", pattern: "src/domain/**/*", type: "domain" },
        { capture: ["fileName"], mode: "file", pattern: "src/application/**/*", type: "application" },
        { capture: ["fileName"], mode: "file", pattern: "src/infrastructure/**/*", type: "infrastructure" },
        { capture: ["fileName"], mode: "file", pattern: "src/presentation/**/*", type: "presentation" },
        { capture: ["fileName"], mode: "file", pattern: "src/*.ts", type: "root" },
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
          default: "disallow",
          rules: [
            { allow: { to: { type: ["domain", "test"] } }, from: { type: "domain" } },
            {
              allow: { to: { type: ["application", "domain", "test"] } },
              from: { type: "application" },
            },
            {
              allow: { to: { type: ["infrastructure", "domain", "test"] } },
              from: { type: "infrastructure" },
            },
            {
              allow: { to: { type: ["presentation", "application", "domain", "test"] } },
              from: { type: "presentation" },
            },
            { allow: { to: { type: "*" } }, from: { type: "test" } },
            { allow: { to: { type: "*" } }, from: { type: "root" } },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts"],
    ...vitestConfig,
  },
  prettierConfig,
]);
