"use client";

import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";

import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { Button } from "@/components/ui/button";
import { createConfirmSignUpFormOptions } from "@/features/account/form/confirm-sign-up-form";
import { useAppForm } from "@/lib/tanstack-form/app-form";

import type { ConfirmSignUpFormInput } from "@/features/account/form/confirm-sign-up-form";
import type { ServerFormState } from "@tanstack/react-form";

import styles from "./confirm-sign-up-form.module.css";

type Props = {
  isPending: boolean;
  defaultValues?: ConfirmSignUpFormInput;
  formState?: ServerFormState<unknown, undefined>;
  action: (formData: FormData) => void;
  onSubmit?: () => void;
};

export function ConfirmSignUpForm({
  action,
  defaultValues,
  formState,
  isPending,
  onSubmit,
}: Props) {
  const form = useAppForm({
    ...createConfirmSignUpFormOptions({ defaultValues, onSubmit }),
    transform: useTransform(
      (baseForm) => (formState ? mergeForm(baseForm, formState) : baseForm),
      [formState],
    ),
  });

  return (
    <form
      noValidate
      action={action}
      onSubmit={(event) => {
        void form.handleSubmit(event);
      }}
      className={styles.base}
    >
      <div className={styles.content}>
        <form.AppField name="email">
          {(field) => <input readOnly type="hidden" name={field.name} value={field.state.value} />}
        </form.AppField>
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
