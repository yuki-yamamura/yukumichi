import { definePreview } from "@storybook/nextjs-vite";

import "../src/libs/zod";
import "../src/app/globals.css";

export default definePreview({
  addons: [],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
});
