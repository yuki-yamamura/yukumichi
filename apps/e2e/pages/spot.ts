import type { Locator, Page } from "@playwright/test";

export class SpotPage {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  get nameInput(): Locator {
    return this.#page.getByLabel("Name");
  }

  get latitudeInput(): Locator {
    return this.#page.getByLabel("Latitude");
  }

  get longitudeInput(): Locator {
    return this.#page.getByLabel("Longitude");
  }

  get submitButton(): Locator {
    return this.#page.getByRole("button", { name: "Submit" });
  }

  async goto(): Promise<void> {
    await this.#page.goto("/spots");
  }

  async createSpot(name: string, latitude: number, longitude: number): Promise<void> {
    await this.nameInput.fill(name);
    await this.latitudeInput.fill(String(latitude));
    await this.longitudeInput.fill(String(longitude));
    await this.submitButton.click();
  }

  spotListItem(name: string): Locator {
    return this.#page.getByRole("listitem").filter({ hasText: name });
  }
}
