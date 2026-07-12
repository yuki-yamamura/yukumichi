import z from "zod";

import { emailSchema } from "@/domain/email";

export const signUpRequestBodySchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
});

export const confirmSignUpRequestBodySchema = z.object({
  code: z.string().min(1),
  email: emailSchema,
});
