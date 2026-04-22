import { defineConfig } from "drizzle-kit";

import { env } from "./src/env";

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/infrastructure/database/schema/index.ts",
});
