import type { Locator, Page } from "@playwright/test";

export type SpotInput = {
  latitude: number;
  longitude: number;
  name: string;
  description?: string;
};

export class NewSpotPage {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  get nameInput(): Locator {
    return this.#page.getByRole("textbox", { name: "Name" });
  }

  get latitudeInput(): Locator {
    return this.#page.getByRole("textbox", { name: "Latitude" });
  }

  get longitudeInput(): Locator {
    return this.#page.getByRole("textbox", { name: "Longitude" });
  }

  get descriptionInput(): Locator {
    return this.#page.getByRole("textbox", { name: "Description" });
  }

  get submitButton(): Locator {
    return this.#page.getByRole("button", { name: "Submit" });
  }

  get resetButton(): Locator {
    return this.#page.getByRole("button", { name: "Reset" });
  }

  async goto(): Promise<void> {
    await this.#page.goto("/spots/new");
  }
}
