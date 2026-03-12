import { index, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import type { PublicRouteId } from "@/domain/model/public-route/model";
import type { UserId } from "@/domain/model/user/model";
import { publicRoutes } from "./public-routes";
import { users } from "./users";

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
      .$type<UserId>()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    publicRouteId: uuid()
      .$type<PublicRouteId>()
      .notNull()
      .references(() => publicRoutes.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.userId, t.publicRouteId),
    index("bookmarks_public_route_id_idx").on(t.publicRouteId),
  ],
);
