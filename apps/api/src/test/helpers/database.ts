import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/infrastructure/database/schema";

import type { Database } from "@/infrastructure/database/client";

export type TestDatabase = {
  db: Database;
  cleanup: () => Promise<void>;
};

export function createTestDatabase(url: string): TestDatabase {
  const client = postgres(url);
  const db = drizzle(client, { schema, casing: "snake_case" });

  return {
    db,
    cleanup: () => client.end(),
  };
}

export async function truncateTables(db: Database) {
  await db.execute(sql`TRUNCATE TABLE archived_spots, spots CASCADE`);
}
