import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export function createDatabase(url: string): PostgresJsDatabase<typeof schema> {
  const ssl = url.includes("rds.amazonaws.com");
  const sql = postgres(url, {
    ssl: ssl ? { rejectUnauthorized: false } : false,
  });

  return drizzle(sql, { casing: "snake_case", schema });
}

export type Database = ReturnType<typeof createDatabase>;
