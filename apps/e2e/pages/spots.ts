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

  editDialog(name: string): Locator {
    return this.#page.getByRole("dialog", { name: `Editing ${name}` });
  }

  async goto(): Promise<void> {
    await this.#page.goto("/spots");
  }

  async openEditDialog(name: string): Promise<EditSpotDialog> {
    await this.editButton(name).click();
    const dialog = this.editDialog(name);

    return new EditSpotDialog(dialog);
  }
}
class EditSpotDialog {
  readonly #root: Locator;
  constructor(root: Locator) {
    this.#root = root;
  }

  get nameInput(): Locator {
    return this.#root.getByRole("textbox", { name: "Name" });
  }

  get descriptionInput(): Locator {
    return this.#root.getByRole("textbox", { name: "Description" });
  }

  get latitudeInput(): Locator {
    return this.#root.getByRole("textbox", { name: "Latitude" });
  }

  get longitudeInput(): Locator {
    return this.#root.getByRole("textbox", { name: "Longitude" });
  }

  get submitButton(): Locator {
    return this.#root.getByRole("button", { name: "Submit" });
  }
}
