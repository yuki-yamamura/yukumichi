"use client";

import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";

import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { Button } from "@/components/ui/button";
import { createSignUpFormOptions } from "@/features/account/form/sign-up-form";
import { useAppForm } from "@/lib/tanstack-form/app-form";

import type { SignUpFormInput } from "@/features/account/form/sign-up-form";
import type { ServerFormState } from "@tanstack/react-form";

import styles from "./sign-up-form.module.css";

type Props = {
  isPending: boolean;
  defaultValues?: SignUpFormInput;
  formState?: ServerFormState<unknown, undefined>;
  action: (formData: FormData) => void;
  onSubmit?: () => void;
};

export function SignUpForm({ action, defaultValues, formState, isPending, onSubmit }: Props) {
  const form = useAppForm({
    ...createSignUpFormOptions({ defaultValues, onSubmit }),
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
              autoComplete="new-password"
            />
          )}
        </form.AppField>
      </div>
      <div className={styles.actions}>
        <Button type="submit" disabled={isPending}>
          {isPending && <SpinnerIcon />}
          Sign up
        </Button>
      </div>
    </form>
  );
}
