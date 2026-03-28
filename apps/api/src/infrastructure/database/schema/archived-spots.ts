import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { spots } from "./spots";

export const archivedSpots = pgTable("archived_spots", {
  spotId: uuid()
    .primaryKey()
    .references(() => spots.id, { onDelete: "cascade" }),
  archivedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
