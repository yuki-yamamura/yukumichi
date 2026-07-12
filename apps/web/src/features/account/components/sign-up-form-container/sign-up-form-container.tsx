"use client";

import { useActionState } from "react";

import { signUpAction } from "@/features/account/actions/sign-up-action";
import { SignUpForm } from "@/features/account/components/sign-up-form";

export function SignUpFormContainer() {
  const [formState, action, isPending] = useActionState(signUpAction, undefined);

  return <SignUpForm isPending={isPending} action={action} formState={formState} />;
}
