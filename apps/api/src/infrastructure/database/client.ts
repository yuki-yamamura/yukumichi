import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export function createDatabase(url: string) {
  const sql = postgres(url);

  return drizzle(sql, { schema, casing: "snake_case" });
}

export type Database = ReturnType<typeof createDatabase>;
