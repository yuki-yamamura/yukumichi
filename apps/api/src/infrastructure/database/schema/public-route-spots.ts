import { index, integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import type { PublicRouteId } from "@/domain/model/public-route/model";
import type { SpotId } from "@/domain/model/spot/model";
import { publicRoutes } from "./public-routes";
import { spots } from "./spots";

export const publicRouteSpots = pgTable(
  "public_route_spots",
  {
    id: uuid().defaultRandom().primaryKey(),
    publicRouteId: uuid()
      .$type<PublicRouteId>()
      .notNull()
      .references(() => publicRoutes.id, { onDelete: "cascade" }),
    spotId: uuid()
      .$type<SpotId>()
      .notNull()
      .references(() => spots.id, { onDelete: "cascade" }),
    sortOrder: integer().notNull(),
  },
  (t) => [
    unique().on(t.publicRouteId, t.spotId),
    index("public_route_spots_spot_id_idx").on(t.spotId),
  ],
);
