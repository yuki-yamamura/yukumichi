import { err, ok } from "./result";

describe("ok", () => {
  it("should return an successful result", () => {
    // When
    const result = ok(10);

    // Then
    expect(result).toEqual({
      isErr: false,
      isOk: true,
      value: 10,
    });
  });
});

describe("err", () => {
  it("should return a native error as result", () => {
    // When
    const result = err(new Error("Something went wrong"));

    // Then
    expect(result).toEqual({
      error: new Error("Something went wrong"),
      isErr: true,
      isOk: false,
    });
  });

  it("should return an app error as result", () => {
    // When
    const result = err({ code: "UNKNOWN_ERROR", message: "Something went wrong" });

    // Then
    expect(result).toEqual({
      error: { code: "UNKNOWN_ERROR", message: "Something went wrong" },
      isErr: true,
      isOk: false,
    });
  });
});
