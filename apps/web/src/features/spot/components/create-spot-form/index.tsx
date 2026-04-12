"use client";

import { useRouter } from "next/navigation";

import { createSpot } from "@/features/spot/api/create-spot";
import { SpotForm } from "@/features/spot/components/spot-form";

import type { SpotFormValues } from "@/features/spot/form/spot-form";

export function CreateSpotForm() {
  const router = useRouter();

  const handleSubmit = async ({ value }: { value: SpotFormValues }) => {
    await createSpot(value);

    router.push("/spots");
  };

  return (
    <SpotForm defaultValues={{ name: "", latitude: 0, longitude: 0 }} onSubmit={handleSubmit} />
  );
}
