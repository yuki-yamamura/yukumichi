import { faker } from "@faker-js/faker";

import { createCoordinate, createSpot, createSpotId } from "@/test/fixtures/spot";

import { archiveSpot, generateSpotId, Spot, SpotId } from "./spot";

describe("Spot", () => {
  it("should create a valid spot", () => {
    // Given
    const id = createSpotId();
    const coordinate = createCoordinate({ latitude: 0, longitude: 0 });

    // When
    const result = Spot({
      id,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: "Test Park",
    });

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      coordinate,
      description: null,
      id,
      name: "Test Park",
    });
  });

  it("should return a validation error when coordinates are invalid", () => {
    // Given
    const params = {
      id: createSpotId(),
      latitude: faker.location.latitude(),
      longitude: 999, // Invalid longitude
      name: faker.location.street(),
    };

    // When
    const result = Spot(params);

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toEqual({ kind: "validation", message: expect.any(String) });
  });
});

describe("generateSpotId", () => {
  it("returns a valid SpotId each call", () => {
    const first = generateSpotId();
    const second = generateSpotId();

    expect(first).not.toBe(second);
    expect(SpotId.safeParse(first).success).toBe(true);
    expect(SpotId.safeParse(second).success).toBe(true);
  });
});

describe("archiveSpot", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a spot with archivedAt set", () => {
    // Given
    const now = new Date("2026-03-29T00:00:00Z");
    vi.setSystemTime(now);

    const spot = createSpot();

    // When
    const archivedSpot = archiveSpot(spot);

    // Then
    expect(archivedSpot).toEqual({
      ...spot,
      archivedAt: now,
    });
  });
});
