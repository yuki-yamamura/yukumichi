import z from "zod";

export function createFloatSchema(inner: z.ZodNumber) {
  return z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Number.parseFloat(value)), {
      params: {
        kind: "invalid_float",
      },
    })
    .transform((value) => Number.parseFloat(value))
    .pipe(inner);
}
