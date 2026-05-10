import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

import type { Env } from "@/env";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export function createDatabase(env: Env): PostgresJsDatabase<typeof schema> {
  const isSsl = env.APP_ENV === "production";
  const sqlClient = postgres(env.DATABASE_URL, {
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  });

  return drizzle(sqlClient, { casing: "snake_case", schema });
}

export type Database = ReturnType<typeof createDatabase>;
