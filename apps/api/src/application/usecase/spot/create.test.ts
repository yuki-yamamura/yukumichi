import { faker } from "@faker-js/faker";
import { ok } from "neverthrow";

import { SpotId } from "@/domain/model/spot/spot";

import { CreateSpotUsecase } from "./create";

import type { SpotRepository } from "@/domain/model/spot/repository";

describe("CreateSpotUsecase", () => {
  describe("execute", () => {
    it("should create a spot", async () => {
      // Given
      const spotId = SpotId.parse(faker.string.uuid({ version: 7 }));

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn().mockResolvedValue(ok(spotId)),
        findById: vi.fn(),
        findMany: vi.fn(),
      };
      const createSpotUsecase = CreateSpotUsecase({ spotRepository });

      const input = {
        name: "Test Park",
        latitude: 35.6762,
        longitude: 139.6503,
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
      expect(spotRepository.create).toHaveBeenCalledOnce();
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
        name: "Test Park",
        latitude: 999,
        longitude: 139.6503,
      };

      // When
      const result = await createSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "validation" });
      expect(spotRepository.create).not.toHaveBeenCalled();
    });
  });
});
