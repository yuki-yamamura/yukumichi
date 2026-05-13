/// <reference types="@vitest/browser/matchers" />

import "vitest";
import type z from "zod";

interface CustomMatchers<R = unknown> {
  toHaveBeenCalledWithFormData<Schema extends z.ZodObject<z.ZodRawShape>>(
    schema: Schema,
    expected: z.infer<Schema>,
  ): R;
}

declare module "vitest" {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
