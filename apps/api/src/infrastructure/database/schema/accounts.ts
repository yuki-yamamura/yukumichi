import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const accountStatus = pgEnum("account_status", ["pending", "registered"]);

export const accounts = pgTable("accounts", {
  cognitoSub: text().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  email: text().notNull().unique(),
  id: uuid().primaryKey(),
  status: accountStatus().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
