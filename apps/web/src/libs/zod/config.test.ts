import "./config";
import z from "zod";

import { createFloatSchema } from "./schema";

describe("errorMap", () => {
  it("should return a mapped error message for invalid float", () => {
    // Given
    const schema = createFloatSchema(z.number());

    // When
    const result = schema.safeParse("abc");

    // Then
    expect(result.success).toBe(false);
    expect(result.error?.issues.at(0)?.message).toBe("数値を入力してください");
  });

  it("should return an original error message if the issue code is not handled", () => {
    // Given
    const schema = z.unknown().refine(() => false, {
      params: {
        kind: "no-such-kind",
      },
    });

    // When
    const result = schema.safeParse("abc");

    // Then
    expect(result.success).toBe(false);
    expect(result.error?.issues.at(0)?.message).toBe("Invalid input");
  });
});
