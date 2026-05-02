import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}

export default async function setup({
  provide,
}: TestProject): Promise<() => Promise<void>> {
  const container = await new PostgreSqlContainer("postgres:17-alpine").start();
  const url = container.getConnectionUri();

  const client = postgres(url, { max: 1 });
  await migrate(drizzle(client), {
    migrationsFolder: "./drizzle",
  });
  await client.end();

  provide("databaseUrl", url);

  return async (): Promise<void> => {
    await container.stop();
  };
}
