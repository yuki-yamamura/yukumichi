"use client";

import { signIn, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getMe } from "@/features/account/api/get-me";
import { SignInForm } from "@/features/account/components/sign-in-form";

import type { SignInFormInput } from "@/features/account/form/sign-in-form";

type Props = {
  defaultValues?: SignInFormInput;
};

export function SignInFormContainer({ defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const handleSubmit = (values: SignInFormInput) => {
    setSubmitError(undefined);

    return new Promise<void>((resolve) => {
      startTransition(async () => {
        try {
          // signIn throws UserAlreadyAuthenticatedException when a stale
          // session lingers in the browser (e.g., the Cognito user was
          // deleted server-side but tokens remain locally), so clear first.
          await signOut().catch(() => {
            // no session to sign out from; safe to ignore
          });
          await signIn({
            options: { authFlowType: "USER_SRP_AUTH" },
            password: values.password,
            username: values.email,
          });
          const meResult = await getMe();
          if (meResult.isErr) {
            setSubmitError(meResult.error.message);

            return;
          }
          router.push("/spots");
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Sign in failed");
        } finally {
          resolve();
        }
      });
    });
  };

  return (
    <SignInForm
      defaultValues={defaultValues}
      isPending={isPending}
      submitError={submitError}
      onSubmit={handleSubmit}
    />
  );
}
