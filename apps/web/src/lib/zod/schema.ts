import z from "zod";

export const customIssueParamsSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("invalid_float") }),
]);

type CustomIssueParams = z.infer<typeof customIssueParamsSchema>;

export function toCustomIssueParams<const T extends CustomIssueParams>(params: T): T {
  return params;
}

export function createFloatSchema(inner: z.ZodNumber) {
  return z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Number.parseFloat(value)), {
      params: toCustomIssueParams({ kind: "invalid_float" }),
    })
    .transform((value) => Number.parseFloat(value))
    .pipe(inner);
}
