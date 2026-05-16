import z from "zod";

const serverEnvSchema = z.object({
  API_BASE_URL: z.url(),
  MOCK_API_ENABLED: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export const serverEnv = serverEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  MOCK_API_ENABLED: process.env.MOCK_API_ENABLED,
});
