import { doublePrecision, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const spots = pgTable("spots", {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  description: text(),
  id: uuid().primaryKey(),
  latitude: doublePrecision().notNull(),
  longitude: doublePrecision().notNull(),
  name: text().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
