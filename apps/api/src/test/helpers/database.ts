import { sql } from "drizzle-orm";

import type { Database } from "@/infrastructure/database/client";

export async function truncateTables(db: Database) {
  await db.execute(sql`TRUNCATE TABLE archived_spots, spots CASCADE`);
}
