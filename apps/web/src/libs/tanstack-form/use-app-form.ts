import { createFormHook } from "@tanstack/react-form";

import { TextareaField, TextField } from "@/components/form";

import { fieldContext, formContext } from "./use-field-context";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
  },
  formComponents: {},
});
