import { and, eq } from "drizzle-orm";
import { db } from "../database/client";
import { bookmarks, publicRouteSpots, publicRoutes, spots } from "../database/schema";
import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type {
  PublicRouteWithBookmark,
  PublicRouteWithSpots,
} from "@/domain/model/public-route/type";
import type { Spot } from "@/domain/model/spot/type";

export class DrizzlePublicRouteRepository implements PublicRouteRepository {
  async findWithSpots(
    routeId: string,
  ): Promise<PublicRouteWithSpots | undefined> {
    const rows = await db
      .select({
        route: publicRoutes,
        spot: spots,
        order: publicRouteSpots.order,
      })
      .from(publicRoutes)
      .innerJoin(
        publicRouteSpots,
        eq(publicRoutes.id, publicRouteSpots.routeId),
      )
      .innerJoin(spots, eq(publicRouteSpots.spotId, spots.id))
      .where(eq(publicRoutes.id, routeId))
      .orderBy(publicRouteSpots.order);

    if (rows.length === 0) return undefined;

    const { route } = rows[0];

    return {
      ...route,
      spots: rows.map((r): Spot => r.spot),
    };
  }

  async findWithSpotsAndBookmark(
    routeId: string,
    userId: string,
  ): Promise<PublicRouteWithBookmark | undefined> {
    const rows = await db
      .select({
        route: publicRoutes,
        spot: spots,
        order: publicRouteSpots.order,
        bookmarkId: bookmarks.id,
      })
      .from(publicRoutes)
      .innerJoin(
        publicRouteSpots,
        eq(publicRoutes.id, publicRouteSpots.routeId),
      )
      .innerJoin(spots, eq(publicRouteSpots.spotId, spots.id))
      .leftJoin(
        bookmarks,
        and(
          eq(bookmarks.routeId, publicRoutes.id),
          eq(bookmarks.userId, userId),
        ),
      )
      .where(eq(publicRoutes.id, routeId))
      .orderBy(publicRouteSpots.order);

    if (rows.length === 0) return undefined;

    const { route } = rows[0];
    const isBookmarked = rows[0].bookmarkId !== null;

    return {
      ...route,
      spots: rows.map((r): Spot => r.spot),
      isBookmarked,
    };
  }
}
