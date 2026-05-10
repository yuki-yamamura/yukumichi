import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { spotFormSchema } from "@/features/spot/form/spot-form";

import { SpotForm } from "./spot-form";

import type { UserEvent } from "@testing-library/user-event";

describe("SpotForm", () => {
  let user: UserEvent;
  const actionSpy = vi.fn();
  const onSubmitSpy = vi.fn();

  beforeEach(() => {
    actionSpy.mockClear();
    onSubmitSpy.mockClear();
    user = userEvent.setup();
  });

  it("can submit form with correct values", async () => {
    // Given
    render(<SpotForm action={actionSpy} isPending={false} onSubmit={onSubmitSpy} />);

    await user.type(screen.getByLabelText("Name"), "Central Park");
    await user.type(screen.getByLabelText("Latitude"), "40.123");
    await user.type(screen.getByLabelText("Longitude"), "-73.456");
    await user.type(screen.getByLabelText("Description"), "A large public park in New York City.");

    // When
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Then
    expect(actionSpy).toHaveBeenCalledWithFormData(spotFormSchema, {
      description: "A large public park in New York City.",
      latitude: 40.123,
      longitude: -73.456,
      name: "Central Park",
    });
    expect(onSubmitSpy).toHaveBeenCalledOnce();
  });

  it("can submit form without description", async () => {
    // Given
    const user = userEvent.setup();
    render(<SpotForm isPending={false} action={actionSpy} onSubmit={onSubmitSpy} />);

    await user.type(screen.getByLabelText("Name"), "Central Park");
    await user.type(screen.getByLabelText("Latitude"), "40.123");
    await user.type(screen.getByLabelText("Longitude"), "-73.456");

    // When
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Then
    expect(actionSpy).toHaveBeenCalledWithFormData(spotFormSchema, {
      description: undefined,
      latitude: 40.123,
      longitude: -73.456,
      name: "Central Park",
    });
    expect(onSubmitSpy).toHaveBeenCalledOnce();
  });

  describe("cannot submit form without required fields", () => {
    it("shows an error message when name is omitted", async () => {
      // Given
      const user = userEvent.setup();
      render(<SpotForm isPending={false} action={actionSpy} />);

      await user.type(screen.getByLabelText("Latitude"), "40.123");
      await user.type(screen.getByLabelText("Longitude"), "-73.456");

      // When
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalledOnce();
      const errorMessage = await screen.findByRole("alert");
      expect(errorMessage).toHaveTextContent("必ず入力してください");
      expect(screen.getByLabelText("Name")).toBeInvalid();
    });

    it("shows an error message when latitude is omitted", async () => {
      // Given
      const user = userEvent.setup();
      render(<SpotForm isPending={false} action={actionSpy} />);

      await user.type(screen.getByLabelText("Name"), "Central Park");
      await user.type(screen.getByLabelText("Longitude"), "-73.456");

      // When
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalledOnce();
      const errorMessage = await screen.findByRole("alert");
      expect(errorMessage).toHaveTextContent("必ず入力してください");
      expect(screen.getByLabelText("Latitude")).toBeInvalid();
    });

    it("shows an error message when longitude is omitted", async () => {
      // Given
      const user = userEvent.setup();
      render(<SpotForm isPending={false} action={actionSpy} />);

      await user.type(screen.getByLabelText("Name"), "Central Park");
      await user.type(screen.getByLabelText("Latitude"), "40.123");

      // When
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalledOnce();
      const errorMessage = await screen.findByRole("alert");
      expect(errorMessage).toHaveTextContent("必ず入力してください");
      expect(screen.getByLabelText("Longitude")).toBeInvalid();
    });
  });
});
