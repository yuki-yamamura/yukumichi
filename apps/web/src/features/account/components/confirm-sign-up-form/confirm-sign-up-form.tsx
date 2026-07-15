"use client";

import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { Button } from "@/components/ui/button";
import { createConfirmSignUpFormOptions } from "@/features/account/form/confirm-sign-up-form";
import { useAppForm } from "@/lib/tanstack-form/app-form";

import type { ConfirmSignUpFormInput } from "@/features/account/form/confirm-sign-up-form";

import styles from "./confirm-sign-up-form.module.css";

type Props = {
  defaultValues?: ConfirmSignUpFormInput;
  isPending?: boolean;
  submitError?: string;
  onSubmit: (values: ConfirmSignUpFormInput) => Promise<void> | void;
};

export function ConfirmSignUpForm({
  defaultValues,
  isPending = false,
  onSubmit,
  submitError,
}: Props) {
  const form = useAppForm({
    ...createConfirmSignUpFormOptions({ defaultValues }),
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
        <form.AppField name="code">
          {(field) => (
            <field.TextField
              required
              label="Verification code"
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
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
          Verify
        </Button>
      </div>
    </form>
  );
}
