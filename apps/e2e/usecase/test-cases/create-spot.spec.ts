import { expect, test } from "@/fixtures/base";

test.describe("Create Spot", () => {
  test("creates a new spot and displays it in the list", async ({
    newSpotPage,
    page,
    spotsPage,
  }) => {
    const spotName = `Test Spot ${crypto.randomUUID()}`;

    await newSpotPage.goto();

    await newSpotPage.nameInput.fill(spotName);
    await newSpotPage.descriptionInput.fill("A large public park in New York City.");
    await newSpotPage.latitudeInput.fill("35.6762");
    await newSpotPage.longitudeInput.fill("139.6503");

    await newSpotPage.submitButton.click();

    await page.waitForURL("/spots");
    await expect(spotsPage.spotListItem(spotName)).toBeVisible();
  });
});
