import { faker } from "@faker-js/faker";
import { errAsync, okAsync } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { CreateSpotUsecase } from "./create";

import type { SpotRepository } from "@/domain/spot/repository";

describe("CreateSpotUsecase", () => {
  describe("execute", () => {
    it("should create a spot", async () => {
      // Given
      const spot = createSpot();

      const spotRepository = createSpotRepository({
        create: vi.fn().mockReturnValue(okAsync(spot.id)),
      });
      const createSpotUsecase = CreateSpotUsecase({ spotRepository });

      const input = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        name: faker.location.street(),
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
    });

    it("should return a validation error for invalid coordinates", async () => {
      // Given
      const spotRepository = createSpotRepository();
      const createSpotUsecase = CreateSpotUsecase({ spotRepository });

      const input = {
        latitude: 999, // Invalid latitude
        longitude: faker.location.longitude(),
        name: faker.location.street(),
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "validation",
        message: expect.any(String),
      });
    });

    it("should return a database error when the repository fails", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        create: vi.fn().mockReturnValue(errAsync({ kind: "database", message })),
      });
      const createSpotUsecase = CreateSpotUsecase({ spotRepository });

      const input = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        name: faker.location.street(),
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "database", message });
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
