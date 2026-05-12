"use client";

import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";

import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { Button } from "@/components/ui/button";
import { createSpotFormOptions } from "@/features/spot/form/spot-form";
import { useAppForm } from "@/lib/tanstack-form/app-form";

import type { SpotFormInput } from "@/features/spot/form/spot-form";
import type { ServerFormState } from "@tanstack/react-form";

import styles from "./spot-form.module.css";

type Props = {
  isPending: boolean;
  defaultValues?: SpotFormInput;
  serverFormState?: ServerFormState<unknown, undefined>;
  action: (formData: FormData) => void;
  onSubmit?: () => void;
};

export function SpotForm({ action, defaultValues, isPending, onSubmit, serverFormState }: Props) {
  const form = useAppForm({
    ...createSpotFormOptions({ defaultValues, onSubmit }),
    transform: useTransform(
      (baseForm) => (serverFormState ? mergeForm(baseForm, serverFormState) : baseForm),
      [serverFormState],
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
        <form.AppField name="name">
          {(field) => <field.TextField required label="Name" placeholder="Central Park" />}
        </form.AppField>
        <form.AppField name="latitude">
          {(field) => (
            <field.TextField
              required
              label="Latitude"
              placeholder="40.785091"
              inputMode="decimal"
            />
          )}
        </form.AppField>
        <form.AppField name="longitude">
          {(field) => (
            <field.TextField
              required
              label="Longitude"
              placeholder="-73.968285"
              inputMode="decimal"
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="A large public park in New York City."
            />
          )}
        </form.AppField>
      </div>
      <div className={styles.actions}>
        <Button
          type="reset"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            form.reset();
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <SpinnerIcon />}
          Submit
        </Button>
      </div>
    </form>
  );
}
