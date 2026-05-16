import { expect, test } from "@/fixtures/base";

test.describe("Update Spot", () => {
  test("updates a spot from the list and reflects the change", async ({
    newSpotPage,
    spotsPage,
  }) => {
    const originalName = `Test Spot ${crypto.randomUUID()}`;
    const updatedName = `${originalName} (updated)`;

    // Create a new spot first
    await newSpotPage.goto();

    await newSpotPage.nameInput.fill(originalName);
    await newSpotPage.descriptionInput.fill("A large public park in New York City.");
    await newSpotPage.latitudeInput.fill("35.6762");
    await newSpotPage.longitudeInput.fill("139.6503");

    await newSpotPage.submitButton.click();

    // Then update the spot name
    const editDialog = await spotsPage.openEditDialog(originalName);
    await editDialog.nameInput.fill(updatedName);
    await editDialog.submitButton.click();

    await expect(spotsPage.spotListItem(updatedName)).toBeVisible();
    await expect(spotsPage.spotListItem(originalName)).toBeHidden();
  });
});
