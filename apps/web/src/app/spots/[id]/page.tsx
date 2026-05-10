import { fetchClient } from "@/libs/hono";

export default async function Page({ params }: PageProps<"/spots/[id]">) {
  const { id } = await params;
  const response = await fetchClient.spots[":spotId"].$get({
    param: {
      spotId: id,
    },
  });
  const data = await response.json();

  if ("code" in data) {
    throw new Error("something went wrong");
  }

  const { spot } = data;

  return <div>{spot.name}</div>;
}
