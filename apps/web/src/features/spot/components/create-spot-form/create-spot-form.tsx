"use client";

import { useActionState } from "react";

import { createSpotAction } from "@/features/spot/actions/create-spot-action";
import { SpotForm } from "@/features/spot/components/spot-form";

export function CreateSpotForm() {
  const [formState, action, isPending] = useActionState(createSpotAction, undefined);

  return <SpotForm isPending={isPending} action={action} serverFormState={formState} />;
}
