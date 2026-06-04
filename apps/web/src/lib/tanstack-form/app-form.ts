import { createFormHook } from "@tanstack/react-form";

import { CancelButton } from "@/components/form/cancel-button";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";

import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextareaField,
    TextField,
  },
  fieldContext,
  formComponents: {
    CancelButton,
    SubmitButton,
  },
  formContext,
});
