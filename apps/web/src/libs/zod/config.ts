import z from "zod";

import { customIssueParamsSchema } from "./custom-issue";

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
        return { message: `${issue.minimum}以上の数値を入力してください` };
      }
      break;
    }
    case "too_big": {
      if (issue.origin === "number") {
        return { message: `${issue.maximum}以下の数値を入力してください` };
      }
      break;
    }
    case "custom": {
      const params = customIssueParamsSchema.safeParse(issue.params);
      if (params.success) {
        switch (params.data.kind) {
          case "invalid_float": {
            return { message: "数値を入力してください" };
          }
          default: {
            params.data.kind satisfies never;
          }
        }
      }
      break;
    }
  }
};

z.config({ customError: errorMap });
