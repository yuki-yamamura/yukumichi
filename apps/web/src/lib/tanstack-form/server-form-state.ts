import type { DeepKeys, ServerFormState } from "@tanstack/react-form";

export function createServerFormState<T>(
  values: T,
  fields: Partial<Record<DeepKeys<T>, { message: string }[]>>,
): ServerFormState<T, undefined> {
  return {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- This type difference is caused by TanStack Form's internal type definitions.
    errorMap: {
      onServer: { fields },
    } as never,
    errors: [],
    values,
  };
}
