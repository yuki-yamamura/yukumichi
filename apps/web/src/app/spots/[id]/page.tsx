import { notFound } from "next/navigation";

import { getSpot } from "@/features/spot/api/get-spot";
import { mustBeSuccess } from "@/utils/must-be-success";

export default async function Page({ params }: PageProps<"/spots/[id]">) {
  const { id } = await params;
  const result = await getSpot({ param: { spotId: id } });

  if (result.isErr && result.error.code === "NOT_FOUND_ERROR") {
    notFound();
  }

  const { spot } = mustBeSuccess(result);

  return <div>{spot.name}</div>;
}
