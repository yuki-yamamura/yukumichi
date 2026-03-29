import type { Page } from "@playwright/test";

export class SpotPage {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  get nameInput() {
    return this.#page.getByLabel("Name");
  }

  get latitudeInput() {
    return this.#page.getByLabel("Latitude");
  }

  get longitudeInput() {
    return this.#page.getByLabel("Longitude");
  }

  get submitButton() {
    return this.#page.getByRole("button", { name: "Submit" });
  }

  async goto() {
    await this.#page.goto("/spots");
  }

  async createSpot(name: string, latitude: number, longitude: number) {
    await this.nameInput.fill(name);
    await this.latitudeInput.fill(String(latitude));
    await this.longitudeInput.fill(String(longitude));
    await this.submitButton.click();
  }

  spotListItem(name: string) {
    return this.#page.getByRole("listitem").filter({ hasText: name });
  }
}
