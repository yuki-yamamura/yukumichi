import { test as base } from "@playwright/test";

import { SpotsPage } from "@/pages/spots";

export { expect } from "@playwright/test";

export const test = base.extend<{
  spotsPage: SpotsPage;
}>({
  spotsPage: async ({ page }, use) => {
    await use(new SpotsPage(page));
  },
});
