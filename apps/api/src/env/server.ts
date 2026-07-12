import "dotenv/config";

import z from "zod";

import { dbEnvSchema } from "./db";

const envSchema = z.object({
  ...dbEnvSchema.shape,
  APP_ENV: z.enum(["development", "production", "test"]),
  AWS_REGION: z.string().min(1),
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_USER_POOL_ID: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
