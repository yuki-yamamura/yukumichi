"use client";

import { useForm } from "@tanstack/react-form";

import { createSpotFormOptions } from "@/features/spot/form/spot-form";

import type { SpotFormValues } from "@/features/spot/form/spot-form";

type Props = {
  defaultValues?: SpotFormValues;
  onSubmit: ({ value }: { value: SpotFormValues }) => Promise<void>;
};

export function SpotForm({ defaultValues, onSubmit }: Props) {
  const formOptions = createSpotFormOptions({
    defaultValues,
    onSubmit,
  });

  const form = useForm(formOptions);
  console.log({ form });

  return <div>Hello</div>;
}
