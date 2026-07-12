"use client";

import { useActionState } from "react";

import { confirmSignUpAction } from "@/features/account/actions/confirm-sign-up-action";
import { ConfirmSignUpForm } from "@/features/account/components/confirm-sign-up-form";

type Props = {
  email: string;
};

export function ConfirmSignUpFormContainer({ email }: Props) {
  const [formState, action, isPending] = useActionState(confirmSignUpAction, undefined);

  return (
    <ConfirmSignUpForm
      isPending={isPending}
      action={action}
      formState={formState}
      defaultValues={{ code: "", email }}
    />
  );
}
