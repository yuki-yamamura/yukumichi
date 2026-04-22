import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineMain } from "@storybook/nextjs-vite/node";

function getAbsolutePath(value: string) {
  return path.dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
export default defineMain({
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-mcp")],
  framework: getAbsolutePath("@storybook/nextjs-vite"),
  staticDirs: ["../public"],
});
