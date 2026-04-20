"use client";

import { useRouter } from "next/navigation";

import { createSpot } from "@/features/spot/api/create-spot";
import { SpotForm } from "@/features/spot/components/spot-form";
import { spotFormSchema } from "@/features/spot/form/spot-form";

import type { SpotFormInput } from "@/features/spot/form/spot-form";

export function CreateSpotForm() {
  const router = useRouter();

  const defaultValues = {
    name: "",
    latitude: "",
    longitude: "",
  };

  const handleSubmit = async ({ value }: { value: SpotFormInput }) => {
    const parsedValue = spotFormSchema.parse(value);
    await createSpot(parsedValue);
    router.push("/spots");
  };

  return <SpotForm defaultValues={defaultValues} onSubmit={handleSubmit} />;
}
