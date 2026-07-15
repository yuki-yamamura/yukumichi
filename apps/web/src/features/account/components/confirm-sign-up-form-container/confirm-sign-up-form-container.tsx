"use client";

import { autoSignIn, confirmSignUp, signOut } from "aws-amplify/auth";
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
          const { nextStep } = await confirmSignUp({
            confirmationCode: values.code,
            username: values.email,
          });
          if (nextStep.signUpStep !== "COMPLETE_AUTO_SIGN_IN") {
            router.push(`/sign-in?email=${encodeURIComponent(values.email)}`);

            return;
          }
          // Amplify's autoSignIn refuses to run when any signed-in session
          // (even a stale one from a deleted Cognito user) is still cached in
          // the browser, so we always clear it before completing the flow.
          await signOut().catch(() => {
            // no session to sign out from; safe to ignore
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
