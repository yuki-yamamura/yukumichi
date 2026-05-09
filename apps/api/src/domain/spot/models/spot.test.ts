import { faker } from "@faker-js/faker";

import { createCoordinate, createSpot, createSpotId } from "@/test/fixtures/spot";

import { archiveSpot, generateSpotId, Spot } from "./spot";

describe("Spot", () => {
  it("should create a valid spot", () => {
    // Given
    const spotId = createSpotId();
    const coordinate = createCoordinate();

    // When
    const result = Spot({
      description: null,
      id: spotId,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: "Test Park",
    });

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      coordinate,
      description: null,
      id: spotId,
      name: "Test Park",
    });
  });

  it("should return a validation error when coordinate is invalid", () => {
    // Given
    const spotId = createSpotId();
    const coordinate = createCoordinate({
      longitude: 999, // Invalid longitude
    });

    // When
    const result = Spot({
      description: null,
      id: spotId,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: faker.location.street(),
    });

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toEqual({ kind: "validation", message: expect.any(String) });
  });
});

describe("generateSpotId", () => {
  it("should return a valid id", () => {
    // When
    const result = generateSpotId();

    // Then
    expect(result).toEqual(expect.any(String));
  });
});

describe("archiveSpot", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return an archived spot", () => {
    // Given
    const now = new Date("2026-03-29T00:00:00Z");
    vi.setSystemTime(now);

    const spot = createSpot();

    // When
    const result = archiveSpot(spot);

    // Then
    expect(result).toEqual({
      ...spot,
      archivedAt: now,
    });
  });
});
