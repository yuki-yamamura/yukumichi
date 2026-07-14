"use client";

import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { Button } from "@/components/ui/button";
import { createSignInFormOptions } from "@/features/account/form/sign-in-form";
import { useAppForm } from "@/lib/tanstack-form/app-form";

import type { SignInFormInput } from "@/features/account/form/sign-in-form";

import styles from "./sign-in-form.module.css";

type Props = {
  defaultValues?: SignInFormInput;
  isPending?: boolean;
  submitError?: string;
  onSubmit: (values: SignInFormInput) => Promise<void> | void;
};

export function SignInForm({ defaultValues, isPending = false, onSubmit, submitError }: Props) {
  const form = useAppForm({
    ...createSignInFormOptions({ defaultValues }),
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className={styles.base}
    >
      <div className={styles.content}>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              required
              label="Email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              inputMode="email"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              required
              label="Password"
              type="password"
              autoComplete="current-password"
            />
          )}
        </form.AppField>
        {submitError && (
          <p role="alert" className={styles.error}>
            {submitError}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <Button type="submit" disabled={isPending}>
          {isPending && <SpinnerIcon />}
          Sign in
        </Button>
      </div>
    </form>
  );
}
