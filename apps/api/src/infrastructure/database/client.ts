import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import type { Logger, ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction, PgQueryResultHKT } from "drizzle-orm/pg-core";

const logger: Logger = {
  logQuery(query, params) {
    const sql = query.replace(/\$(\d+)/g, (_, i) => {
      const v = params[Number(i) - 1];
      return typeof v === "string" ? `'${v}'` : String(v);
    });
    console.log(
      "\n" +
        "=".repeat(60) +
        "\n" +
        `[SQL] ${sql}\n` +
        "=".repeat(60) +
        "\n",
    );
  },
};

export type Database = ReturnType<typeof createDatabase>;

export type Transaction = PgTransaction<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type DbClient = Database | Transaction;

export function createDatabase(url: string) {
  const sql = postgres(url);
  return drizzle(sql, { schema, casing: "snake_case", logger });
}
