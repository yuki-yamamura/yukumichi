import { getTableName, isTable, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/infrastructure/database/schema";

import type { Database } from "@/infrastructure/database/client";

const tableNames = Object.values(schema)
  .filter(isTable)
  .map((table) => getTableName(table));

type TestDatabase = {
  db: Database;
  cleanup: () => Promise<void>;
  truncateTables: () => Promise<void>;
};

export function createTestDatabase(url: string): TestDatabase {
  const client = postgres(url);
  const db = drizzle(client, { casing: "snake_case", schema });

  return {
    cleanup: () => client.end(),
    db,
    truncateTables: async () => {
      await db.execute(sql.raw(`TRUNCATE TABLE ${tableNames.join(", ")} CASCADE`));
    },
  };
}
