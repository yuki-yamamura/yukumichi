import { vitestConfig } from "@sanpo/eslint/vitest";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/**"]),
  {
    files: ["**/*.test.ts"],
    ...vitestConfig,
  },
]);
