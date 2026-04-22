import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/libs/tanstack-form";

import styles from "./index.module.css";

type Props = {
  label: string;
  placeholder: string;
  required?: boolean;
};

export function TextareaField({ label, placeholder, required = false }: Props) {
  const field = useFieldContext<string>();
  const { errors, isDirty, isValid } = field.state.meta;
  const hasSubmitted = field.form.state.submissionAttempts > 0;
  const isInvalid = (isDirty || hasSubmitted) && !isValid;

  return (
    <Field className={styles.base}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        required={required}
        value={field.state.value}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
