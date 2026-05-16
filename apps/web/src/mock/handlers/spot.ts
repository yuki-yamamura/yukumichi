import { http, HttpResponse } from "msw";

import { serverEnv } from "@/env/server";
import { createSpot } from "@/test/fixtures/spot";

import type {
  CreateSpotRequest,
  ListSpotsResponseData,
  UpdateSpotRequest,
} from "@/features/spot/types/api";

const baseUrl = `${serverEnv.API_BASE_URL}/spots`;

let spots = [createSpot(), createSpot()];

export const spotHandlers = [
  http.post<never, CreateSpotRequest["json"], null>(baseUrl, async ({ request }) => {
    const body = await request.json();
    spots = [createSpot(body), ...spots];

    return HttpResponse.json(null);
  }),

  http.get<never, never, ListSpotsResponseData>(baseUrl, () => HttpResponse.json({ spots })),

  http.patch<UpdateSpotRequest["param"], UpdateSpotRequest["json"], null>(
    `${baseUrl}/:spotId`,
    async ({ params, request }) => {
      const { spotId } = params;
      const body = await request.json();

      spots = spots.map((spot) => (spot.id === spotId ? { ...spot, ...body } : spot));

      return HttpResponse.json(null);
    },
  ),
];
