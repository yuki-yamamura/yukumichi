import type { PublicRouteWithBookmark, PublicRouteWithSpots } from "./type";

export interface PublicRouteRepository {
  findWithSpots(routeId: string): Promise<PublicRouteWithSpots | undefined>;
  findWithSpotsAndBookmark(
    routeId: string,
    userId: string,
  ): Promise<PublicRouteWithBookmark | undefined>;
}
