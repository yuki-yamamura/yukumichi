import { Coordinate } from "./coordinate";

describe("Coordinate", () => {
  it("should create a valid coordinate", () => {
    // When
    const result = Coordinate({
      latitude: 37.7749,
      longitude: -122.4194,
    });

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
    });
  });

  describe("boundary values", () => {
    it.each([
      { label: "negative boundary values", latitude: -90, longitude: -180 },
      { label: "positive boundary values", latitude: 90, longitude: 180 },
    ])("should accept $label", ({ latitude, longitude }) => {
      // When
      const result = Coordinate({ latitude, longitude });

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ latitude, longitude });
    });

    it.each([
      {
        label: "latitude is negatively out of range",
        latitude: -91,
        longitude: 0,
      },
      {
        label: "latitude is positively out of range",
        latitude: 91,
        longitude: 0,
      },
      {
        label: "longitude is negatively out of range",
        latitude: 0,
        longitude: -181,
      },
      {
        label: "longitude is positively out of range",
        latitude: 0,
        longitude: 181,
      },
    ])("should return an error when $label", ({ latitude, longitude }) => {
      // When
      const result = Coordinate({ latitude, longitude });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "VALIDATION",
        message: expect.any(String),
      });
    });
  });
});
