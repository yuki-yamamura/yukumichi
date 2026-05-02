import z from "zod";

import { toCustomIssueParams } from "./custom-issue";

export function createFloatSchema(
  inner: z.ZodNumber,
): z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber> {
  return z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Number.parseFloat(value)), {
      params: toCustomIssueParams({ kind: "invalid_float" }),
    })
    .transform((value) => Number.parseFloat(value))
    .pipe(inner);
}
