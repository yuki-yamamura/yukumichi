import { expect, test } from "@/fixtures/base";

test.describe("Create Spot", () => {
  test("creates a new spot and displays it in the list", async ({ spotsPage }) => {
    const spotName = `Test Spot ${String(Date.now())}`;

    await spotsPage.goto();

    await spotsPage.createSpot(spotName, 35.6762, 139.6503);
    await expect(spotsPage.spotListItem(spotName)).toBeVisible();
  });
});
