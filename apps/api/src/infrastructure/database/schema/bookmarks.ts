import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { publicRoutes } from "./public-routes";
import { users } from "./users";

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    publicRouteId: uuid()
      .notNull()
      .references(() => publicRoutes.id),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.publicRouteId)],
);
