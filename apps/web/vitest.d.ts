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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
