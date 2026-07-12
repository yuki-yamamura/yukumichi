import vitest from "@vitest/eslint-plugin";

export const vitestConfig = {
  plugins: {
    vitest,
  },
  languageOptions: {
    globals: vitest.environments.env.globals,
  },
  rules: {
    ...vitest.configs.recommended.rules,
    // NOTE: `expect.any(...)` and `await response.json()` return `any` by library design (vitest matchers, fetch). Tests routinely place these inside `toEqual` matchers, which would otherwise fire `no-unsafe-assignment` despite being safe placeholder use.
    "@typescript-eslint/no-unsafe-assignment": "off",
    "vitest/consistent-test-it": ["error", { fn: "it" }],
    // NOTE: Allow `expectTypeOf` (type-level assertion) to satisfy expect-expect.
    "vitest/expect-expect": ["error", { assertFunctionNames: ["expect", "expectTypeOf"] }],
    "vitest/consistent-each-for": ["error", { test: "each", it: "each", describe: "each" }],
    "vitest/consistent-vitest-vi": ["error", { fn: "vi" }],
    "vitest/no-alias-methods": "error",
    "vitest/no-importing-vitest-globals": "error",
    "vitest/no-test-prefixes": "error",
    "vitest/prefer-each": "error",
    "vitest/prefer-lowercase-title": ["error", { ignoreTopLevelDescribe: true }],
    "vitest/prefer-to-be": "error",
    "vitest/prefer-to-contain": "error",
    "vitest/prefer-to-have-length": "error",
    "vitest/padding-around-after-all-blocks": "error",
    "vitest/padding-around-after-each-blocks": "error",
    "vitest/padding-around-before-all-blocks": "error",
    "vitest/padding-around-before-each-blocks": "error",
    "vitest/padding-around-describe-blocks": "error",
    "vitest/padding-around-test-blocks": "error",
  },
};
