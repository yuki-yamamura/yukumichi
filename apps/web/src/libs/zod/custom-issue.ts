import z from "zod";

export const customIssueParamsSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("invalid_float") }),
]);

export type CustomIssueParams = z.infer<typeof customIssueParamsSchema>;

export function toCustomIssueParams<const T extends CustomIssueParams>(params: T): T {
  return params;
}
