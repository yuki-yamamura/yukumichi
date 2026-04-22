import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { spots } from "./spots";

export const archivedSpots = pgTable("archived_spots", {
  archivedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  spotId: uuid()
    .primaryKey()
    .references(() => spots.id, { onDelete: "cascade" }),
});
