import { test as base } from "@playwright/test";

import { NewSpotPage } from "@/pages/new-spot";
import { SpotsPage } from "@/pages/spots";

export { expect } from "@playwright/test";

export const test = base.extend<{
  newSpotPage: NewSpotPage;
  spotsPage: SpotsPage;
}>({
  newSpotPage: async ({ page }, use) => {
    await use(new NewSpotPage(page));
  },
  spotsPage: async ({ page }, use) => {
    await use(new SpotsPage(page));
  },
});
