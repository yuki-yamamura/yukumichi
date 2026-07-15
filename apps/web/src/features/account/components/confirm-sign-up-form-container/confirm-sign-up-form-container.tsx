"use client";

import { autoSignIn, confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getMe } from "@/features/account/api/get-me";
import { ConfirmSignUpForm } from "@/features/account/components/confirm-sign-up-form";

import type { ConfirmSignUpFormInput } from "@/features/account/form/confirm-sign-up-form";

type Props = {
  email: string;
};

export function ConfirmSignUpFormContainer({ email }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const handleSubmit = (values: ConfirmSignUpFormInput) => {
    setSubmitError(undefined);

    return new Promise<void>((resolve) => {
      startTransition(async () => {
        try {
          await confirmSignUp({
            confirmationCode: values.code,
            username: values.email,
          });
          const { isSignedIn } = await autoSignIn();
          if (!isSignedIn) {
            router.push(`/sign-in?email=${encodeURIComponent(values.email)}`);

            return;
          }
          const meResult = await getMe();
          if (meResult.isErr) {
            setSubmitError(meResult.error.message);

            return;
          }
          router.push("/spots");
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Confirmation failed");
        } finally {
          resolve();
        }
      });
    });
  };

  return (
    <ConfirmSignUpForm
      defaultValues={{ code: "", email }}
      isPending={isPending}
      submitError={submitError}
      onSubmit={handleSubmit}
    />
  );
}
