import boundaries from "eslint-plugin-boundaries";
import drizzlePlugin from "eslint-plugin-drizzle";
import { defineConfig, globalIgnores } from "eslint/config";

import { baseConfig, typescriptConfig } from "@yukumichi/eslint/base";
import { prettierConfig } from "@yukumichi/eslint/prettier";
import { vitestConfig } from "@yukumichi/eslint/vitest";

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
        { type: "test", pattern: "src/test/**/*", mode: "file" },
        { type: "domain", pattern: "src/domain/**/*", mode: "file" },
        { type: "application", pattern: "src/application/**/*", mode: "file" },
        { type: "infrastructure", pattern: "src/infrastructure/**/*", mode: "file" },
        { type: "presentation", pattern: "src/presentation/**/*", mode: "file" },
        { type: "root", pattern: "src/*.ts", mode: "file" },
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
          default: "disallow",
          rules: [
            {
              from: { type: "domain" },
              allow: { to: { type: ["domain", "test"] } },
            },
            {
              from: { type: "application" },
              allow: { to: { type: ["application", "domain", "test"] } },
            },
            {
              from: { type: "infrastructure" },
              allow: { to: { type: ["infrastructure", "domain", "test"] } },
            },
            {
              from: { type: "presentation" },
              allow: { to: { type: ["presentation", "application", "domain", "test"] } },
            },
            {
              from: { type: "test" },
              allow: { to: { type: "*" } },
            },
            {
              from: { type: "root" },
              allow: { to: { type: "*" } },
            },
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
