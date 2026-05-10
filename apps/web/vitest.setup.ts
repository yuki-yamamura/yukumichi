import { expect } from "vitest";

import type { FormValidateAsyncFn, ServerFormState } from "@tanstack/react-form";
import type { MockedFunction } from "vitest";
import type z from "zod";

import "@/libs/zod";

expect.extend({
  toHaveBeenCalledWithFormData<
    Schema extends z.ZodObject<z.ZodRawShape>,
    Value extends z.infer<Schema>,
  >(
    action: MockedFunction<
      (formData: FormData) => Promise<ServerFormState<Value, FormValidateAsyncFn<any>> | undefined>
    >,
    schema: Schema,
    expected: Value,
  ) {
    const formData = action.mock.calls[0][0];
    const data = Object.fromEntries(formData.entries());
    const result = schema.safeParse(data);

    if (!result.success) {
      return {
        actual: result.error,
        expected: "valid FormData",
        message: () => "failed to parse FormData with the provided schema",
        pass: false,
      };
    }

    expect(action).toHaveBeenCalledOnce();
    expect(result.data).toEqual(expected);

    return {
      actual: result.data,
      expected,
      message: () => "action was called with the expected FormData",
      pass: true,
    };
  },
});
