"use client";

import { formOptions } from "@tanstack/react-form";

import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { Button } from "@/components/ui/button";
import { spotFormSchema } from "@/features/spot/form/spot-form";
import { useAppForm } from "@/libs/tanstack-form/use-app-form";

import type { SpotFormInput } from "@/features/spot/form/spot-form";

import styles from "./index.module.css";

type Props = {
  defaultValues?: SpotFormInput;
  onSubmit: ({ value }: { value: SpotFormInput }) => Promise<void>;
};

export function SpotForm({ defaultValues, onSubmit }: Props) {
  const form = useAppForm(
    formOptions({
      defaultValues,
      validators: {
        onChange: spotFormSchema,
      },
      onSubmit,
    }),
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      noValidate
      className={styles.base}
    >
      <div className={styles.content}>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" placeholder="Central Park" required />}
        </form.AppField>
        <form.AppField name="latitude">
          {(field) => (
            <field.TextField
              label="Latitude"
              placeholder="40.785091"
              inputMode="decimal"
              required
            />
          )}
        </form.AppField>
        <form.AppField name="longitude">
          {(field) => (
            <field.TextField
              label="Longitude"
              placeholder="-73.968285"
              inputMode="decimal"
              required
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
          disabled={form.state.isSubmitting}
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ?? <SpinnerIcon />}
          Submit
        </Button>
      </div>
    </form>
  );
}
