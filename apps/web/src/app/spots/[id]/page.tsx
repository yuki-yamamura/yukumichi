import { notFound } from "next/navigation";

import { fetchClient } from "@/lib/hono/client";
import { toResult } from "@/lib/hono/converter";

export default async function Page({ params }: PageProps<"/spots/[id]">) {
  const { id } = await params;
  const result = await toResult(
    fetchClient.spots[":spotId"].$get({
      param: {
        spotId: id,
      },
    }),
  );

  if (result.isErr) {
    if (result.error.code === "NOT_FOUND_ERROR") {
      notFound();
    }

    throw new Error(result.error.message);
  }

  return <div>{result.value.spot.name}</div>;
}
