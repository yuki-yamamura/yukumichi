import {
  doublePrecision,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { SpotId } from "@/domain/model/spot/model";
import type { UserId } from "@/domain/model/user/model";
import { users } from "./users";

export const spots = pgTable("spots", {
  id: uuid().$type<SpotId>().defaultRandom().primaryKey(),
  userId: uuid().$type<UserId>()
    .notNull()
    .references(() => users.id),
  name: text().notNull(),
  latitude: doublePrecision().notNull(),
  longitude: doublePrecision().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
