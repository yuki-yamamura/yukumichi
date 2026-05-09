import { errAsync, okAsync } from "neverthrow";

import { createCoordinate, createSpot, createSpotId } from "@/test/fixtures/spot";

import { UpdateSpotUsecase } from "./update";

import type { SpotRepository } from "@/domain/spot/repository";

describe("UpdateSpotUsecase", () => {
  describe("execute", () => {
    it("should update a spot and return noting", async () => {
      // Given
      const existingSpot = createSpot();
      const input = {
        description: "Updated description",
        id: existingSpot.id,
        latitude: 35.6895,
        longitude: 139.6917,
        name: "Updated Spot",
      };
      const updatedSpot = createSpot({
        coordinate: createCoordinate({
          latitude: input.latitude,
          longitude: input.longitude,
        }),
        description: input.description,
        id: input.id,
        name: input.name,
      });

      const spotRepository = createSpotRepository({
        findById: vi.fn().mockReturnValue(okAsync(existingSpot)),
        update: vi.fn().mockReturnValue(okAsync(updatedSpot)),
      });
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBeUndefined();
    });

    it("should return an error when the spot to update is not found", async () => {
      // Given
      const input = {
        description: "Updated description",
        id: createSpotId(),
        latitude: 35.6895,
        longitude: 139.6917,
        name: "Updated Spot",
      };

      const spotRepository = createSpotRepository({
        findById: vi
          .fn()
          .mockReturnValue(errAsync({ kind: "not_found", message: "Spot not found" })),
      });
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "not_found" });
    });

    it("should return a validation error when an input has an invalid value", async () => {
      // Given
      const existingSpot = createSpot();
      const input = {
        description: "Updated description",
        id: existingSpot.id,
        latitude: 999, // Invalid latitude
        longitude: 139.6917,
        name: "Updated Spot",
      };

      const spotRepository = createSpotRepository({
        findById: vi.fn().mockReturnValue(okAsync(existingSpot)),
      });
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "validation" });
    });
  });
});

function createSpotRepository(overwrites: Partial<SpotRepository> = {}): SpotRepository {
  const defaultRepository: SpotRepository = {
    archive: vi.fn(),
    create: vi.fn(),
    findArchivedSpotById: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  };

  return { ...defaultRepository, ...overwrites };
}
