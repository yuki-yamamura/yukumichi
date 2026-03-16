import { z } from "zod";

export type RouteSearchParams = {
  keyword?: string;
  minSpotCount?: number;
  limit: number;
  offset: number;
};

export const RouteSearchResult = z.object({
  routeId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  authorName: z.string(),
  spotCount: z.coerce.number(),
  bookmarkCount: z.coerce.number(),
  createdAt: z.coerce.date(),
});

export type RouteSearchResult = z.infer<typeof RouteSearchResult>;

export type RouteSearchQueryService = {
  execute: (params: RouteSearchParams) => Promise<RouteSearchResult[]>;
};
