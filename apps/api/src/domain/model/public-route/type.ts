import type { Spot } from "@/domain/model/spot/type";

export type PublicRoute = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicRouteWithSpots = PublicRoute & {
  spots: Spot[];
};

export type PublicRouteWithBookmark = PublicRouteWithSpots & {
  isBookmarked: boolean;
};
