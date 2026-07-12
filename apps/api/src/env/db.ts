import "dotenv/config";

import z from "zod";

export const dbEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

export const dbEnv = dbEnvSchema.parse(process.env);
