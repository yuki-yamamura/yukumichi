import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { PublicRouteId } from "@/domain/model/public-route/model";
import type { UserId } from "@/domain/model/user/model";
import { users } from "./users";

export const publicRoutes = pgTable("public_routes", {
  id: uuid().$type<PublicRouteId>().defaultRandom().primaryKey(),
  userId: uuid().$type<UserId>()
    .notNull()
    .references(() => users.id),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
