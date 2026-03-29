import { test as base } from "@playwright/test";

import { SpotPage } from "@/pages/spot";

export { expect } from "@playwright/test";

export const test = base.extend<{
  spotPage: SpotPage;
}>({
  spotPage: async ({ page }, use) => {
    await use(new SpotPage(page));
  },
});
