import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/libs/tanstack-form";

import type { ComponentProps, PropsWithChildren } from "react";

import styles from "./index.module.css";

type Props = PropsWithChildren<{
  label: string;
  placeholder: string;
  required?: boolean;
}> &
  Pick<ComponentProps<"input">, "inputMode">;

export function TextField({ label, placeholder, inputMode, required = false }: Props) {
  const field = useFieldContext<string>();
  const { isDirty, isValid, errors } = field.state.meta;
  const hasSubmitted = field.form.state.submissionAttempts > 0;
  const isInvalid = (isDirty || hasSubmitted) && !isValid;

  return (
    <Field className={styles.base}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        type="text"
        inputMode={inputMode}
        required={required}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
