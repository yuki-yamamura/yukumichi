"use client";

import { updateSpotAction } from "@/features/spot/actions/update-spot-action";
import { SpotForm } from "@/features/spot/components/spot-form";
import { spotFormSchema } from "@/features/spot/form/spot-form";

import type { SpotFormInput } from "@/features/spot/form/spot-form";
import type { ListSpotsItem } from "@/features/spot/types/api";

type Props = {
  spot: ListSpotsItem;
  onSubmit: () => void;
};

export function UpdateSpotForm({ onSubmit, spot }: Props) {
  const defaultValues: SpotFormInput = {
    description: spot.description ?? "",
    latitude: spot.coordinate.latitude.toString(),
    longitude: spot.coordinate.longitude.toString(),
    name: spot.name,
  };

  const handleSubmit = async ({ value }: { value: SpotFormInput }) => {
    const parsedValue = spotFormSchema.parse(value);
    await updateSpotAction({ params: parsedValue, spotId: spot.id });
    onSubmit();
  };

  return <SpotForm defaultValues={defaultValues} onSubmit={handleSubmit} />;
}
