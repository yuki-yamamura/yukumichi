import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmSignUpForm } from "./confirm-sign-up-form";

import type { UserEvent } from "@testing-library/user-event";

describe("ConfirmSignUpForm", () => {
  const user: UserEvent = userEvent.setup();
  const onSubmitSpy = vi.fn();

  beforeEach(() => {
    onSubmitSpy.mockClear();
  });

  it("passes the injected email and typed code to onSubmit", async () => {
    // Given
    render(
      <ConfirmSignUpForm
        defaultValues={{ code: "", email: "you@example.com" }}
        onSubmit={onSubmitSpy}
      />,
    );

    await user.type(screen.getByLabelText("Verification code"), "123456");

    // When
    await user.click(screen.getByRole("button", { name: "Verify" }));

    // Then
    expect(onSubmitSpy).toHaveBeenCalledExactlyOnceWith({
      code: "123456",
      email: "you@example.com",
    });
  });

  it("shows the submitError when provided", () => {
    // When
    render(
      <ConfirmSignUpForm
        defaultValues={{ code: "", email: "you@example.com" }}
        submitError="Wrong code"
        onSubmit={onSubmitSpy}
      />,
    );

    // Then
    expect(screen.getByRole("alert")).toHaveTextContent("Wrong code");
  });

  describe("cannot submit form with invalid code", () => {
    it("shows an error when the code is shorter than 6 digits", async () => {
      // Given
      render(
        <ConfirmSignUpForm
          defaultValues={{ code: "", email: "you@example.com" }}
          onSubmit={onSubmitSpy}
        />,
      );

      await user.type(screen.getByLabelText("Verification code"), "12345");

      // When
      await user.click(screen.getByRole("button", { name: "Verify" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Verification code")).toBeInvalid();
    });

    it("shows an error when the code contains non-digits", async () => {
      // Given
      render(
        <ConfirmSignUpForm
          defaultValues={{ code: "", email: "you@example.com" }}
          onSubmit={onSubmitSpy}
        />,
      );

      await user.type(screen.getByLabelText("Verification code"), "abcdef");

      // When
      await user.click(screen.getByRole("button", { name: "Verify" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Verification code")).toBeInvalid();
    });
  });
});
