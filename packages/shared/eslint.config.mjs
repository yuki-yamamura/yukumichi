import { defineConfig } from "eslint/config";

import { baseConfig, typescriptConfig } from "@yukumichi/eslint/base";
import { prettierConfig } from "@yukumichi/eslint/prettier";

export default defineConfig([...baseConfig, ...typescriptConfig, prettierConfig]);
