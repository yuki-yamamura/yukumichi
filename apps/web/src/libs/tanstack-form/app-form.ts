import { createFormHook } from "@tanstack/react-form";

import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";

import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextareaField,
    TextField,
  },
  fieldContext,
  formComponents: {},
  formContext,
});
