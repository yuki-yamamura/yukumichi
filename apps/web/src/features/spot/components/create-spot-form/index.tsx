"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSpot } from "@/features/spot/actions/create-spot";

import styles from "./index.module.css";

export function CreateSpotForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: undefined,
      latitude: 0,
      longitude: 0,
    },
    onSubmit: async ({ value }) => {
      await createSpot({
        name: value.name,
        description: value.description,
        latitude: value.latitude,
        longitude: value.longitude,
      });
      router.refresh();
      form.reset();
    },
  });

  return (
    <form
      className={styles.base}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        validators={{
          onBlur: ({ value }) => (value.length === 0 ? "Name is required" : undefined),
        }}
      >
        {(field) => (
          <div className={styles.field}>
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <span className={styles.error}>{field.state.meta.errors.join(", ")}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className={styles.field}>
            <Label htmlFor={field.name}>Description</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="latitude">
        {(field) => (
          <div className={styles.field}>
            <Label htmlFor={field.name}>Latitude</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="any"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="longitude">
        {(field) => (
          <div className={styles.field}>
            <Label htmlFor={field.name}>Longitude</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              step="any"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
