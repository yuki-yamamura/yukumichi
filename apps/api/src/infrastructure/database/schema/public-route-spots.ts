import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { publicRoutes } from "./public-routes";
import { spots } from "./spots";

export const publicRouteSpots = pgTable(
  "public_route_spots",
  {
    id: uuid().defaultRandom().primaryKey(),
    publicRouteId: uuid()
      .notNull()
      .references(() => publicRoutes.id),
    spotId: uuid()
      .notNull()
      .references(() => spots.id),
    sortOrder: integer().notNull(),
  },
  (t) => [unique().on(t.publicRouteId, t.spotId)],
);
