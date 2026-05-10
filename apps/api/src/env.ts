import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  APP_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
