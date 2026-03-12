import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { privateRoutes } from "./private-routes";
import { spots } from "./spots";

export const privateRouteSpots = pgTable(
  "private_route_spots",
  {
    id: uuid().defaultRandom().primaryKey(),
    routeId: uuid()
      .notNull()
      .references(() => privateRoutes.id),
    spotId: uuid()
      .notNull()
      .references(() => spots.id),
    order: integer().notNull(),
  },
  (t) => [unique().on(t.routeId, t.spotId)],
);
