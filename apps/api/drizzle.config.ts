import { defineConfig } from "drizzle-kit";

import { dbEnv } from "./src/env/db";

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: dbEnv.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/infrastructure/database/schema/index.ts",
});
