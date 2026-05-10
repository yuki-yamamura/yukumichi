import { definePreview } from "@storybook/nextjs-vite";

import "@/libs/zod";
import "@/app/globals.css";

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
