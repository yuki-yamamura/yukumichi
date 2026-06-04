import { faker } from "@faker-js/faker";
import { err, errAsync, ok } from "neverthrow";

import { createSpot, createSpotId } from "@/test/fixtures/spot";

import { GetSpotUsecase } from "./get";

import type { SpotRepository } from "@/domain/spot/repository";

describe("GetSpotUsecase", () => {
  describe("execute", () => {
    it("should return a spot related with id", async () => {
      // Given
      const spot = createSpot();
      const spotId = spot.id;

      const spotRepository = createSpotRepository({
        findById: vi.fn().mockReturnValue(ok(spot)),
      });
      const getSpotUsecase = GetSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await getSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(spot);
    });

    it("should return an error when a spot is not found", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        findById: vi.fn().mockReturnValue(err({ kind: "NOT_FOUND", message })),
      });
      const getSpotUsecase = GetSpotUsecase({
        spotRepository,
      });

      const spotId = createSpotId();
      const input = { spotId };

      // When
      const result = await getSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "NOT_FOUND", message });
    });

    it("should return a validation error when the spot id is invalid", async () => {
      // Given
      const spotRepository = createSpotRepository();
      const getSpotUsecase = GetSpotUsecase({ spotRepository });

      // When
      const result = await getSpotUsecase.execute({ spotId: "not-a-uuid" });

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
      const getSpotUsecase = GetSpotUsecase({ spotRepository });

      // When
      const result = await getSpotUsecase.execute({ spotId: createSpotId() });

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
      const getSpotUsecase = GetSpotUsecase({ spotRepository });

      // When
      const result = await getSpotUsecase.execute({ spotId: createSpotId() });

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
