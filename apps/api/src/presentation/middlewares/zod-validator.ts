import { zValidator as baseZodValidator } from "@hono/zod-validator";
import z from "zod";

import { toApiError } from "@/presentation/helpers/error";

import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

export function zValidator<Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema,
) {
  return baseZodValidator(target, schema, (result, context) => {
    if (!result.success) {
      return context.json(
        toApiError({
          kind: "validation",
          message: z.prettifyError(result.error),
        }),
        400,
      );
    }
  });
}
