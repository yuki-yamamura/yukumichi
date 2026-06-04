import { faker } from "@faker-js/faker";
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
          .mockReturnValue(errAsync({ kind: "NOT_FOUND", message: "Spot not found" })),
      });
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "NOT_FOUND",
        message: expect.any(String),
      });
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
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "VALIDATION",
        message: expect.any(String),
      });
    });

    it("should return a database error when the repository fails", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        findById: vi.fn().mockReturnValue(errAsync({ kind: "DATABASE", message })),
      });
      const updateSpotUsecase = UpdateSpotUsecase({ spotRepository });

      // When
      const result = await updateSpotUsecase.execute({
        id: createSpotId(),
        name: "Updated",
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATABASE", message });
    });

    it("should return a data integrity error when the repository data is corrupted", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        findById: vi.fn().mockReturnValue(errAsync({ kind: "DATA_INTEGRITY", message })),
      });
      const updateSpotUsecase = UpdateSpotUsecase({ spotRepository });

      // When
      const result = await updateSpotUsecase.execute({
        id: createSpotId(),
        name: "Updated",
      });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATA_INTEGRITY", message });
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
