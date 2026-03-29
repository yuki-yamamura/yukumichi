import { faker } from "@faker-js/faker";
import { ok } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { CreateSpotUsecase } from "./create";

import type { SpotRepository } from "@/domain/model/spot/repository";

describe("CreateSpotUsecase", () => {
  describe("execute", () => {
    it("should create a spot", async () => {
      // Given
      const spot = createSpot();

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn().mockResolvedValue(ok(spot.id)),
        findById: vi.fn(),
        findMany: vi.fn(),
      };
      const createSpotUsecase = CreateSpotUsecase({ spotRepository });

      const input = {
        name: faker.location.street(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
    });

    it("should return a validation error for invalid coordinates", async () => {
      // Given
      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        findMany: vi.fn(),
      };
      const createSpotUsecase = CreateSpotUsecase({ spotRepository });

      const input = {
        name: faker.location.street(),
        latitude: 999, // Invalid latitude
        longitude: faker.location.longitude(),
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "validation" });
    });
  });
});
