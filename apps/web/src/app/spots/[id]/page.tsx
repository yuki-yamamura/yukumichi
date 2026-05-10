import { fetchClient } from "@/libs/hono";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
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
