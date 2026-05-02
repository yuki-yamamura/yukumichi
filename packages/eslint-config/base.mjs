import { importX } from "eslint-plugin-import-x";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import jseslint from "@eslint/js";

export const typescriptConfig = tseslint.configs.recommended;

export const baseConfig = [
  jseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-object-as-default-parameter": "off",
      "unicorn/no-useless-undefined": [
        "error",
        {
          checkArguments: false,
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "import-x": importX,
      perfectionist,
      "no-relative-import-paths": noRelativeImportPaths,
      "unused-imports": unusedImports,
    },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "./**/*.css",
              group: "type",
              position: "after",
            },
            {
              pattern: "./**/*.module.css",
              group: "type",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "type"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import-x/no-duplicates": "error",
      "import-x/newline-after-import": "error",
      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        {
          prefix: "@",
          rootDir: "src",
          allowSameFolder: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "func-style": [
        "error",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],
      "prefer-arrow-callback": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "export", next: "export" },
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "*", next: "throw" },
        { blankLine: "always", prev: "directive", next: "*" },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          type: "natural",
          groups: ["required-property", "optional-property"],
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          type: "natural",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          type: "natural",
          groups: ["unknown", "nullish"],
        },
      ],
      "perfectionist/sort-named-imports": ["error"],
      "perfectionist/sort-named-exports": ["error"],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": [
        "error",
        {
          allowDirectConstAssertionInArrowFunctions: false,
          allowHigherOrderFunctions: false,
          allowTypedFunctionExpressions: false,
        },
      ],
    },
  },
  {
    ignores: ["**/*.config.{js,mjs,ts,mts,cts}"],
  },
];
