import { mustBeSuccess, mustBeSuccessAll } from "./must-be-success";
import { err, ok } from "./result";

describe("mustBeSuccess", () => {
  it("should return the value when the result is succeeded", () => {
    // When
    const value = mustBeSuccess(ok(10));

    // Then
    expect(value).toBe(10);
  });

  it("should throw the error when the result is not succeeded", () => {
    // Given
    const error = { code: "UNKNOWN_ERROR", message: "Something went wrong" };

    // When / Then
    expect(() => mustBeSuccess(err(error))).toThrow(error);
  });
});

describe("mustBeSuccessAll", () => {
  it("should return the values when all the results are succeeded", () => {
    // Given
    const expected = [
      {
        person: {
          age: 20,
          id: 1,
          name: "Alice",
        },
      },
      {
        persons: [
          { age: 20, id: 1, name: "Alice" },
          { age: 20, id: 2, name: "Bob" },
        ],
      },
    ];

    // When
    const values = mustBeSuccessAll([ok(expected[0]), ok(expected[1])]);

    // Then
    expect(values).toEqual(expected);
  });

  it("should throw the first error when some of the result is not succeeded", () => {
    // Given
    const errorA = { code: "UNKNOWN_ERROR", message: "Something went wrong inside A" };
    const errorB = { code: "UNKNOWN_ERROR", message: "Something went wrong inside B" };

    // When / Then
    expect(() =>
      mustBeSuccessAll([
        ok({
          person: {
            age: 20,
            id: 1,
            name: "Alice",
          },
        }),
        err(errorA),
        ok({
          persons: [
            { age: 20, id: 1, name: "Alice" },
            { age: 20, id: 2, name: "Bob" },
          ],
        }),
        err(errorB),
      ]),
    ).toThrow(errorA);
  });
});
