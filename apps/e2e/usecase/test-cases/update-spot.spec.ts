import { expect, test } from "@/fixtures/base";

test.describe("Update Spot", () => {
  test("updates a spot from the list and reflects the change", async ({
    newSpotPage,
    spotsPage,
  }) => {
    const originalName = `Test Spot ${crypto.randomUUID()}`;
    const updatedName = `${originalName} (updated)`;

    await newSpotPage.goto();
    await newSpotPage.createSpot({
      latitude: 35.6762,
      longitude: 139.6503,
      name: originalName,
    });
    await expect(spotsPage.spotListItem(originalName)).toBeVisible();

    await spotsPage.updateSpot(originalName, { name: updatedName });

    await expect(spotsPage.spotListItem(updatedName)).toBeVisible();
    await expect(spotsPage.spotListItem(originalName)).toBeHidden();
  });
});
