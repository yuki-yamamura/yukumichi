import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SpotForm } from ".";

import type { UserEvent } from "@testing-library/user-event";

describe("SpotForm", () => {
  let user: UserEvent;
  const onSubmitSpy = vi.fn();

  beforeEach(() => {
    onSubmitSpy.mockClear();
    user = userEvent.setup();
  });

  it("can submit form with correct values", async () => {
    // Given
    render(<SpotForm onSubmit={onSubmitSpy} />);

    await user.type(screen.getByLabelText("Name"), "Central Park");
    await user.type(screen.getByLabelText("Latitude"), "40.123");
    await user.type(screen.getByLabelText("Longitude"), "-73.456");
    await user.type(screen.getByLabelText("Description"), "A large public park in New York City.");

    // When
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Then
    expect(onSubmitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          name: "Central Park",
          latitude: "40.123",
          longitude: "-73.456",
          description: "A large public park in New York City.",
        },
      }),
    );
  });

  it("can submit form without description", async () => {
    // Given
    const user = userEvent.setup();
    const onSubmitSpy = vi.fn();
    render(<SpotForm onSubmit={onSubmitSpy} />);

    await user.type(screen.getByLabelText("Name"), "Central Park");
    await user.type(screen.getByLabelText("Latitude"), "40.123");
    await user.type(screen.getByLabelText("Longitude"), "-73.456");

    // When
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Then
    expect(onSubmitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          name: "Central Park",
          latitude: "40.123",
          longitude: "-73.456",
        },
      }),
    );
  });

  describe("cannot submit form without required fields", () => {
    it("shows an error message when name is omitted", async () => {
      // Given
      const user = userEvent.setup();
      const onSubmitSpy = vi.fn();
      render(<SpotForm onSubmit={onSubmitSpy} />);

      await user.type(screen.getByLabelText("Latitude"), "40.123");
      await user.type(screen.getByLabelText("Longitude"), "-73.456");

      // When
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      const errorMessage = await screen.findByRole("alert");
      expect(errorMessage).toHaveTextContent("必ず入力してください");
      expect(screen.getByLabelText("Name")).toBeInvalid();
    });

    it("shows an error message when latitude is omitted", async () => {
      // Given
      const user = userEvent.setup();
      const onSubmitSpy = vi.fn();
      render(<SpotForm onSubmit={onSubmitSpy} />);

      await user.type(screen.getByLabelText("Name"), "Central Park");
      await user.type(screen.getByLabelText("Longitude"), "-73.456");

      // When
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      const errorMessage = await screen.findByRole("alert");
      expect(errorMessage).toHaveTextContent("必ず入力してください");
      expect(screen.getByLabelText("Latitude")).toBeInvalid();
    });

    it("shows an error message when longitude is omitted", async () => {
      // Given
      const user = userEvent.setup();
      const onSubmitSpy = vi.fn();
      render(<SpotForm onSubmit={onSubmitSpy} />);

      await user.type(screen.getByLabelText("Name"), "Central Park");
      await user.type(screen.getByLabelText("Latitude"), "40.123");

      // When
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      const errorMessage = await screen.findByRole("alert");
      expect(errorMessage).toHaveTextContent("必ず入力してください");
      expect(screen.getByLabelText("Longitude")).toBeInvalid();
    });
  });
});
