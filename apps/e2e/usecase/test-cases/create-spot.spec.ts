import { expect, test } from "@/fixtures/base";

test.describe("Create Spot", () => {
  test("creates a new spot and displays it in the list", async ({ newSpotPage, spotsPage }) => {
    const spotName = `Test Spot ${crypto.randomUUID()}`;

    await newSpotPage.goto();
    await newSpotPage.createSpot({ latitude: 35.6762, longitude: 139.6503, name: spotName });

    await expect(spotsPage.spotListItem(spotName)).toBeVisible();
  });
});
