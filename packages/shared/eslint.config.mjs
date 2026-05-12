import { defineConfig } from "eslint/config";

import { baseConfig, typescriptConfig } from "@sanpo/eslint/base";
import { prettierConfig } from "@sanpo/eslint/prettier";

export default defineConfig([...baseConfig, ...typescriptConfig, prettierConfig]);
