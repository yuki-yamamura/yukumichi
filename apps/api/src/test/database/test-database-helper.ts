import { getTableName, isTable, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/infrastructure/database/schema";

import type { Env } from "@/env";
import type { Database } from "@/infrastructure/database/client";

const tableNames = Object.values(schema)
  .filter(isTable)
  .map((table) => getTableName(table));

type TestDatabaseHelper = {
  db: Database;
  cleanup: () => Promise<void>;
  truncateTables: () => Promise<void>;
};

export function createTestDatabaseHelper(env: Env): TestDatabaseHelper {
  const sqlClient = postgres(env.DATABASE_URL);
  const db = drizzle(sqlClient, { casing: "snake_case", schema });

  return {
    cleanup: () => sqlClient.end(),
    db,
    truncateTables: async () => {
      await db.execute(sql.raw(`TRUNCATE TABLE ${tableNames.join(", ")} CASCADE`));
    },
  };
}
