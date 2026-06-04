import { faker } from "@faker-js/faker";
import { errAsync, okAsync } from "neverthrow";

import { createSpot, createSpotId } from "@/test/fixtures/spot";

import { ArchiveSpotUsecase } from "./archive";

import type { SpotRepository } from "@/domain/spot/repository";

describe("ArchiveSpotUsecase", () => {
  describe("execute", () => {
    it("should archive a spot related with id", async () => {
      // Given
      const spot = createSpot();
      const spotId = spot.id;

      const spotRepository = createSpotRepository({
        archive: vi.fn().mockReturnValue(okAsync(spot.id)),
        findArchivedSpotById: vi
          .fn()
          .mockReturnValue(errAsync({ kind: "NOT_FOUND", message: faker.lorem.sentence() })),
        findById: vi.fn().mockReturnValue(okAsync(spot)),
      });
      const archiveSpotUsecase = ArchiveSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await archiveSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
    });

    it("should return an error when a spot is not found", async () => {
      // Given
      const spotId = createSpotId();
      const message = faker.lorem.sentence();

      const spotRepository = createSpotRepository({
        findArchivedSpotById: vi
          .fn()
          .mockReturnValue(errAsync({ kind: "NOT_FOUND", message: faker.lorem.sentence() })),
        findById: vi.fn().mockReturnValue(errAsync({ kind: "NOT_FOUND", message })),
      });
      const archiveSpotUsecase = ArchiveSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await archiveSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "NOT_FOUND", message });
    });

    it("should return an error when a spot is already archived", async () => {
      // Given
      const spot = createSpot();
      const spotId = spot.id;
      const archivedSpot = { ...spot, archivedAt: faker.date.past() };

      const spotRepository = createSpotRepository({
        findArchivedSpotById: vi.fn().mockReturnValue(okAsync(archivedSpot)),
      });
      const archiveSpotUsecase = ArchiveSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await archiveSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "SPOT_DUPLICATED",
        message: expect.any(String),
      });
    });

    it("should return a validation error when the spot id is invalid", async () => {
      // Given
      const spotRepository = createSpotRepository();
      const archiveSpotUsecase = ArchiveSpotUsecase({ spotRepository });

      // When
      const result = await archiveSpotUsecase.execute({ spotId: "not-a-uuid" });

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
        findArchivedSpotById: vi.fn().mockReturnValue(errAsync({ kind: "DATABASE", message })),
      });
      const archiveSpotUsecase = ArchiveSpotUsecase({ spotRepository });

      // When
      const result = await archiveSpotUsecase.execute({ spotId: createSpotId() });

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATABASE", message });
    });

    it("should return a data integrity error when the repository data is corrupted", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        findArchivedSpotById: vi
          .fn()
          .mockReturnValue(errAsync({ kind: "DATA_INTEGRITY", message })),
      });
      const archiveSpotUsecase = ArchiveSpotUsecase({ spotRepository });

      // When
      const result = await archiveSpotUsecase.execute({ spotId: createSpotId() });

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
