import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  cognitoSub: text().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  email: text().notNull().unique(),
  id: uuid().primaryKey(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
