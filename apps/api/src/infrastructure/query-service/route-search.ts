import { eq, sql, desc, like } from "drizzle-orm";
import {
  publicRoutes,
  publicRouteSpots,
  bookmarks,
  users,
} from "../database/schema";
import { RouteSearchResult } from "@/application/query-service/route-search";
import type { DbClient } from "../database/client";
import type {
  RouteSearchParams,
  RouteSearchQueryService,
} from "@/application/query-service/route-search";

export function createRouteSearchQueryService(
  db: DbClient,
): RouteSearchQueryService {
  return {
    async execute(params: RouteSearchParams) {
      const rows = await db
        .select({
          routeId: publicRoutes.id,
          title: publicRoutes.title,
          description: publicRoutes.description,
          authorName: users.name,
          spotCount: sql<number>`count(distinct ${publicRouteSpots.spotId})`.mapWith(Number),
          bookmarkCount: sql<number>`count(distinct ${bookmarks.id})`.mapWith(Number),
          createdAt: publicRoutes.createdAt,
        })
        .from(publicRoutes)
        .innerJoin(users, eq(publicRoutes.userId, users.id))
        .innerJoin(
          publicRouteSpots,
          eq(publicRoutes.id, publicRouteSpots.publicRouteId),
        )
        .leftJoin(bookmarks, eq(bookmarks.publicRouteId, publicRoutes.id))
        .where(
          params.keyword
            ? like(publicRoutes.title, `%${params.keyword}%`)
            : undefined,
        )
        .groupBy(
          publicRoutes.id,
          publicRoutes.title,
          publicRoutes.description,
          publicRoutes.createdAt,
          users.name,
        )
        .having(
          params.minSpotCount
            ? sql`count(distinct ${publicRouteSpots.spotId}) >= ${params.minSpotCount}`
            : undefined,
        )
        .orderBy(desc(publicRoutes.createdAt))
        .limit(params.limit)
        .offset(params.offset);

      return rows.map((row) => RouteSearchResult.parse(row));
    },
  };
}
