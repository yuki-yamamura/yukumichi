import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

declare module "vitest" {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}

let container: StartedPostgreSqlContainer;

export async function setup({ provide }: { provide: (key: "databaseUrl", value: string) => void }) {
  container = await new PostgreSqlContainer("postgres:17-alpine").start();

  const url = container.getConnectionUri();
  const client = postgres(url, { max: 1 });
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.end();

  provide("databaseUrl", url);
}

export async function teardown() {
  if (!container) {
    return;
  }

  await container.stop();
}
