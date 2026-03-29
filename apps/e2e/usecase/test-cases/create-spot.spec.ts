import { expect, test } from "@/fixtures/base";

test.describe("Create Spot", () => {
  test("creates a new spot and displays it in the list", async ({ spotPage }) => {
    const spotName = `Test Spot ${Date.now()}`;

    await spotPage.goto();

    await spotPage.createSpot(spotName, 35.6762, 139.6503);
    await expect(spotPage.spotListItem(spotName)).toBeVisible();
  });
});
