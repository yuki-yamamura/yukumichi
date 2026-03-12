import { index, integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import type { SpotId } from "@/domain/model/spot/model";
import { privateRoutes } from "./private-routes";
import { spots } from "./spots";

export const privateRouteSpots = pgTable(
  "private_route_spots",
  {
    id: uuid().defaultRandom().primaryKey(),
    routeId: uuid()
      .notNull()
      .references(() => privateRoutes.id, { onDelete: "cascade" }),
    spotId: uuid()
      .$type<SpotId>()
      .notNull()
      .references(() => spots.id, { onDelete: "cascade" }),
    sortOrder: integer().notNull(),
  },
  (t) => [
    unique().on(t.routeId, t.spotId),
    index("private_route_spots_spot_id_idx").on(t.spotId),
  ],
);
