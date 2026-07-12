import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { signUpFormSchema } from "@/features/account/form/sign-up-form";

import { SignUpForm } from "./sign-up-form";

import type { UserEvent } from "@testing-library/user-event";

describe("SignUpForm", () => {
  const user: UserEvent = userEvent.setup();
  const actionSpy = vi.fn();
  const onSubmitSpy = vi.fn();

  beforeEach(() => {
    actionSpy.mockClear();
    onSubmitSpy.mockClear();
  });

  it("can submit form with correct values", async () => {
    // Given
    render(<SignUpForm action={actionSpy} isPending={false} onSubmit={onSubmitSpy} />);

    await user.type(screen.getByLabelText("Email"), "you@example.com");
    await user.type(screen.getByLabelText("Password"), "Passw0rd!");

    // When
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    // Then
    expect(actionSpy).toHaveBeenCalledWithFormData(signUpFormSchema, {
      email: "you@example.com",
      password: "Passw0rd!",
    });
    expect(onSubmitSpy).toHaveBeenCalledOnce();
  });

  describe("cannot submit form with invalid input", () => {
    it("shows an error when email is missing", async () => {
      // Given
      render(<SignUpForm action={actionSpy} isPending={false} onSubmit={onSubmitSpy} />);

      await user.type(screen.getByLabelText("Password"), "Passw0rd!");

      // When
      await user.click(screen.getByRole("button", { name: "Sign up" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Email")).toBeInvalid();
    });

    it("shows an error when email is malformed", async () => {
      // Given
      render(<SignUpForm action={actionSpy} isPending={false} onSubmit={onSubmitSpy} />);

      await user.type(screen.getByLabelText("Email"), "not-an-email");
      await user.type(screen.getByLabelText("Password"), "Passw0rd!");

      // When
      await user.click(screen.getByRole("button", { name: "Sign up" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Email")).toBeInvalid();
    });

    it("shows an error when password is shorter than 8 characters", async () => {
      // Given
      render(<SignUpForm action={actionSpy} isPending={false} onSubmit={onSubmitSpy} />);

      await user.type(screen.getByLabelText("Email"), "you@example.com");
      await user.type(screen.getByLabelText("Password"), "short");

      // When
      await user.click(screen.getByRole("button", { name: "Sign up" }));

      // Then
      expect(onSubmitSpy).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Password")).toBeInvalid();
    });
  });
});
