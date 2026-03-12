import { and, eq } from "drizzle-orm";
import {
  bookmarks,
  publicRouteSpots,
  publicRoutes,
  spots,
} from "../database/schema";
import {
  createPublicRouteDetail,
  createPersonalizedRouteDetail,
} from "@/domain/model/public-route/model";
import { createSpot } from "@/domain/model/spot/model";
import type { Database } from "../database/client";
import type { PublicRouteId } from "@/domain/model/public-route/model";
import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { UserId } from "@/domain/model/user/model";

export function createPublicRouteRepository(db: Database): PublicRouteRepository {
  return {
    async findDetail(routeId: PublicRouteId) {
      const rows = await db
        .select({
          route: publicRoutes,
          spot: spots,
          order: publicRouteSpots.sortOrder,
        })
        .from(publicRoutes)
        .innerJoin(
          publicRouteSpots,
          eq(publicRoutes.id, publicRouteSpots.publicRouteId),
        )
        .innerJoin(spots, eq(publicRouteSpots.spotId, spots.id))
        .where(eq(publicRoutes.id, routeId))
        .orderBy(publicRouteSpots.sortOrder);

      if (rows.length === 0) return undefined;

      const { route } = rows[0];

      return createPublicRouteDetail({
        ...route,
        spots: rows.map((r) => createSpot(r.spot)),
      });
    },

    async findDetailForUser(routeId: PublicRouteId, userId: UserId) {
      const rows = await db
        .select({
          route: publicRoutes,
          spot: spots,
          order: publicRouteSpots.sortOrder,
          bookmarkId: bookmarks.id,
        })
        .from(publicRoutes)
        .innerJoin(
          publicRouteSpots,
          eq(publicRoutes.id, publicRouteSpots.publicRouteId),
        )
        .innerJoin(spots, eq(publicRouteSpots.spotId, spots.id))
        .leftJoin(
          bookmarks,
          and(
            eq(bookmarks.publicRouteId, publicRoutes.id),
            eq(bookmarks.userId, userId),
          ),
        )
        .where(eq(publicRoutes.id, routeId))
        .orderBy(publicRouteSpots.sortOrder);

      if (rows.length === 0) return undefined;

      const { route } = rows[0];
      const isBookmarked = rows[0].bookmarkId !== null;

      return createPersonalizedRouteDetail({
        ...route,
        spots: rows.map((r) => createSpot(r.spot)),
        isBookmarked,
      });
    },
  };
}
