import z from "zod";

import { customIssueParamsSchema } from "./schema";

import type { $ZodErrorMap } from "zod/v4/core";

const errorMap: $ZodErrorMap = (issue) => {
  switch (issue.code) {
    case "invalid_type": {
      if (issue.expected === "string") {
        return { message: "必ず入力してください" };
      }
      break;
    }
    case "too_small": {
      if (issue.origin === "string" && issue.minimum === 1) {
        return { message: "必ず入力してください" };
      }
      if (issue.origin === "number") {
        return { message: `${String(issue.minimum)}以上の数値を入力してください` };
      }
      break;
    }
    case "too_big": {
      if (issue.origin === "number") {
        return { message: `${String(issue.maximum)}以下の数値を入力してください` };
      }
      break;
    }
    case "custom": {
      const params = customIssueParamsSchema.safeParse(issue.params);
      if (params.success) {
        // NOTE: Currently only one custom issue kind exists. The exhaustiveness check via `satisfies never` will fail compilation when a new kind is added.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (params.data.kind === "invalid_float") {
          return { message: "数値を入力してください" };
        }
        params.data.kind satisfies never;
      }
      break;
    }
  }
};

z.config({ customError: errorMap });
