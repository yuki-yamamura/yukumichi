import { zValidator as baseZodValidator } from "@hono/zod-validator";
import z from "zod";

import { toApiError, toHttpStatus } from "@/presentation/schemas/error";

import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

const buildZValidator = <Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema,
) =>
  baseZodValidator(target, schema, (result, context) => {
    if (!result.success) {
      return context.json(
        toApiError({
          kind: "validation",
          message: z.prettifyError(result.error),
        }),
        toHttpStatus("VALIDATION_ERROR"),
      );
    }
  });

export function zValidator<Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema,
): ReturnType<typeof buildZValidator<Target, Schema>> {
  return buildZValidator(target, schema);
}
