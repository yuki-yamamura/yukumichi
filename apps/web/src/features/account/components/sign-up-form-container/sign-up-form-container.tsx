"use client";

import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SignUpForm } from "@/features/account/components/sign-up-form";

import type { SignUpFormInput } from "@/features/account/form/sign-up-form";

export function SignUpFormContainer() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const handleSubmit = (values: SignUpFormInput) => {
    setSubmitError(undefined);

    return new Promise<void>((resolve) => {
      startTransition(async () => {
        try {
          await signUp({
            options: { autoSignIn: true, userAttributes: { email: values.email } },
            password: values.password,
            username: values.email,
          });
          router.push(`/sign-up/confirm?email=${encodeURIComponent(values.email)}`);
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Sign up failed");
        } finally {
          resolve();
        }
      });
    });
  };

  return <SignUpForm isPending={isPending} submitError={submitError} onSubmit={handleSubmit} />;
}
