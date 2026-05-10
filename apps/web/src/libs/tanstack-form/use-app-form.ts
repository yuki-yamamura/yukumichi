import { createFormHook } from "@tanstack/react-form";

import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";

import { fieldContext, formContext } from "./use-field-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextareaField,
    TextField,
  },
  fieldContext,
  formComponents: {},
  formContext,
});
