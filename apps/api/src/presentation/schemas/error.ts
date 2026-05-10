import z from "zod";

import { errorCodeMap } from "@/presentation/constants/error";

export const errorResponseSchema = z.object({
  code: z.enum(Object.values(errorCodeMap)),
  message: z.string(),
});
