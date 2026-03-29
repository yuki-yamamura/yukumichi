import { createCoordinate, createSpot } from "@/test/fixtures/spot";

import { archiveSpot, Spot } from "./spot";

describe("Spot", () => {
  it("should create a valid spot", () => {
    // Given
    const coordinate = createCoordinate({ latitude: 0, longitude: 0 });

    // When
    const result = Spot({
      id: "019654e0-b1b8-7714-9e09-c0a76b5ef7c0",
      name: "Test Park",
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      id: "019654e0-b1b8-7714-9e09-c0a76b5ef7c0",
      name: "Test Park",
      coordinate,
    });
  });

  it("should return a validation error when id is not a UUIDv7", () => {
    // When
    const result = Spot({
      id: "not-a-uuid",
      name: "Test Park",
      latitude: 0,
      longitude: 0,
    });

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "validation" });
  });

  it("should return a validation error when coordinates are invalid", () => {
    // When
    const result = Spot({
      id: "019654e0-b1b8-7714-9e09-c0a76b5ef7c0",
      name: "Test Park",
      latitude: 999,
      longitude: 0,
    });

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "validation" });
  });
});

describe("archiveSpot", () => {
  it("should return a spot with archivedAt set", () => {
    // Given
    const spot = createSpot();

    // When
    const archived = archiveSpot(spot);

    // Then
    expect(archived).toEqual({
      ...spot,
      archivedAt: expect.any(Date),
    });
  });
});
