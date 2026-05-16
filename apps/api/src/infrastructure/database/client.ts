import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type DatabaseConfig = {
  appEnv: "development" | "production" | "test";
  url: string;
};

export function createDatabase(config: DatabaseConfig): PostgresJsDatabase<typeof schema> {
  const isSsl = config.appEnv === "production";
  const sqlClient = postgres(config.url, {
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  });

  return drizzle(sqlClient, { casing: "snake_case", schema });
}

export type Database = ReturnType<typeof createDatabase>;
