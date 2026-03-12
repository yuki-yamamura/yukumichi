import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { UserId } from "@/domain/model/user/model";

export const users = pgTable("users", {
  id: uuid().$type<UserId>().defaultRandom().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
