import type { SpotInput } from "@/pages/new-spot";
import type { Locator, Page } from "@playwright/test";

export class SpotsPage {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  get heading(): Locator {
    return this.#page.getByRole("heading", { name: "Spots" });
  }

  spotListItem(name: string): Locator {
    return this.#page
      .getByRole("listitem")
      .filter({ has: this.#page.getByRole("button", { exact: true, name }) });
  }

  editButton(name: string): Locator {
    return this.spotListItem(name).getByRole("button", { name: "Edit" });
  }

  async goto(): Promise<void> {
    await this.#page.goto("/spots");
  }

  async updateSpot(currentName: string, input: Partial<SpotInput>): Promise<void> {
    await this.editButton(currentName).click();
    const dialog = this.#page.getByRole("dialog");
    if (input.name !== undefined) {
      await dialog.getByRole("textbox", { name: "Name" }).fill(input.name);
    }
    if (input.latitude !== undefined) {
      await dialog.getByRole("textbox", { name: "Latitude" }).fill(String(input.latitude));
    }
    if (input.longitude !== undefined) {
      await dialog.getByRole("textbox", { name: "Longitude" }).fill(String(input.longitude));
    }
    if (input.description !== undefined) {
      await dialog.getByRole("textbox", { name: "Description" }).fill(input.description);
    }
    await dialog.getByRole("button", { name: "Submit" }).click();
  }
}
