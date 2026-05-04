"use client";

import { useActionState } from "react";

import { updateSpotAction } from "@/features/spot/actions/update-spot-action";
import { SpotForm } from "@/features/spot/components/spot-form";

import type { SpotFormInput } from "@/features/spot/form/spot-form";
import type { ListSpotsItem } from "@/features/spot/types/api";

type Props = {
  spot: ListSpotsItem;
  onSubmit: () => void;
};

export function UpdateSpotForm({ onSubmit, spot }: Props) {
  const [state, action, isPending] = useActionState(
    updateSpotAction.bind(null, spot.id),
    undefined,
  );

  const defaultValues: SpotFormInput = {
    description: spot.description ?? undefined,
    latitude: spot.coordinate.latitude.toString(),
    longitude: spot.coordinate.longitude.toString(),
    name: spot.name,
  };

  return (
    <SpotForm
      defaultValues={defaultValues}
      isPending={isPending}
      action={action}
      serverFormState={state}
      onSubmit={onSubmit}
    />
  );
}
