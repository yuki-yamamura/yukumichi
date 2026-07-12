import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { confirmSignUpFormSchema } from "@/features/account/form/confirm-sign-up-form";

import { ConfirmSignUpForm } from "./confirm-sign-up-form";

import type { UserEvent } from "@testing-library/user-event";

describe("ConfirmSignUpForm", () => {
  const user: UserEvent = userEvent.setup();
  const actionSpy = vi.fn();
  const onSubmitSpy = vi.fn();

  beforeEach(() => {
    actionSpy.mockClear();
    onSubmitSpy.mockClear();
  });

  it("can submit form with the injected email and typed code", async () => {
    // Given
    render(
      <ConfirmSignUpForm
        action={actionSpy}
        isPending={false}
        defaultValues={{ code: "", email: "you@example.com" }}
        onSubmit={onSubmitSpy}
      />,
    );

    await user.type(screen.getByLabelText("Verification code"), "123456");

    // When
    await user.click(screen.getByRole("button", { name: "Verify" }));

    // Then
    expect(actionSpy).toHaveBeenCalledWithFormData(confirmSignUpFormSchema, {
      code: "123456",
      email: "you@example.com",
    });
    expect(onSubmitSpy).toHaveBeenCalledOnce();
  });

  describe("cannot submit form with invalid code", () => {
    it("shows an error when the code is shorter than 6 digits", async () => {
      // Given
      render(
        <ConfirmSignUpForm
          action={actionSpy}
          isPending={false}
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
          action={actionSpy}
          isPending={false}
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
