import z from "zod";

import type { $ZodErrorMap } from "zod/v4/core";

const errorMap: $ZodErrorMap = (issue) => {
  if (issue.code === "custom" && issue.params?.kind === "invalid_float") {
    return { message: "数値を入力してください" };
  }

  switch (issue.code) {
    case "invalid_type": {
      if (issue.expected === "string") {
        return { message: "必ず入力してください" };
      }
    }
    case "too_small": {
      if (issue.origin === "string" && issue.minimum === 1) {
        return { message: "必ず入力してください" };
      }
      if (issue.origin === "number") {
        return { message: `${issue.minimum}以上の数値を入力してください` };
      }
    }
    case "too_big": {
      if (issue.origin === "number") {
        return { message: `${issue.maximum}以下の数値を入力してください` };
      }
    }
  }
};

z.config({ customError: errorMap });
