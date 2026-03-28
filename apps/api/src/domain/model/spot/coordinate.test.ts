import { createCoordinate } from "../../../test/helpers/spot";
import { Coordinate } from "./coordinate";

describe("Coordinate", () => {
  it("should create a valid coordinate", () => {
    // Given
    const expected = createCoordinate({
      latitude: 0,
      longitude: 0,
    });

    // When
    const result = Coordinate(expected);

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      latitude: expected.latitude,
      longitude: expected.longitude,
    });
  });

  describe("boundary values", () => {
    it.each([
      { label: "negative boundary values", latitude: -90, longitude: -180 },
      { label: "positive boundary values", latitude: 90, longitude: 180 },
    ])("should accept $label", ({ latitude, longitude }) => {
      // When
      const result = Coordinate(createCoordinate({ latitude, longitude }));

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ latitude, longitude });
    });

    it.each([
      { label: "latitude is negatively out of range", latitude: -91, longitude: 0 },
      { label: "latitude is positively out of range", latitude: 91, longitude: 0 },
      { label: "longitude is negatively out of range", latitude: 0, longitude: -181 },
      { label: "longitude is positively out of range", latitude: 0, longitude: 181 },
    ])("should return an error when $label", ({ latitude, longitude }) => {
      // When
      const result = Coordinate(createCoordinate({ latitude, longitude }));

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({
        kind: "validation",
        message: expect.any(String),
      });
    });
  });
});
