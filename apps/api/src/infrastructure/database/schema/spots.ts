import { doublePrecision, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const spots = pgTable("spots", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  latitude: doublePrecision().notNull(),
  longitude: doublePrecision().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
