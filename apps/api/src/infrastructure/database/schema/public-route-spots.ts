import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { publicRoutes } from "./public-routes";
import { spots } from "./spots";

export const publicRouteSpots = pgTable(
  "public_route_spots",
  {
    id: uuid().defaultRandom().primaryKey(),
    routeId: uuid()
      .notNull()
      .references(() => publicRoutes.id),
    spotId: uuid()
      .notNull()
      .references(() => spots.id),
    order: integer().notNull(),
  },
  (t) => [unique().on(t.routeId, t.spotId)],
);
