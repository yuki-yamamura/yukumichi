import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export function createDatabase(url: string) {
  const ssl = url.includes("rds.amazonaws.com");
  const sql = postgres(url, {
    ssl: ssl ? { rejectUnauthorized: false } : false,
  });

  return drizzle(sql, { schema, casing: "snake_case" });
}

export type Database = ReturnType<typeof createDatabase>;
