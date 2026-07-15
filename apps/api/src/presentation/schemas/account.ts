import z from "zod";

import { accountIdSchema } from "@/domain/account/models/account";
import { emailSchema } from "@/domain/email";

export const accountResponseSchema = z.object({
  account: z.object({
    email: emailSchema,
    id: accountIdSchema,
  }),
});
