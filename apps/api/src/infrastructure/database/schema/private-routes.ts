import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { UserId } from "@/domain/model/user/model";
import { users } from "./users";

export const privateRoutes = pgTable("private_routes", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid().$type<UserId>()
    .notNull()
    .references(() => users.id),
  name: text().notNull(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
