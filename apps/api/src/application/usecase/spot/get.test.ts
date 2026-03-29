import { faker } from "@faker-js/faker";
import { err, ok } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { GetSpotUsecase } from "./get";

import type { SpotRepository } from "@/domain/model/spot/repository";

describe("GetSpotUsecase", () => {
  describe("execute", () => {
    it("should return a spot related with id", async () => {
      // Given
      const spot = createSpot();
      const spotId = spot.id;

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findById: vi.fn().mockResolvedValue(ok(spot)),
        findMany: vi.fn(),
      };
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
      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findById: vi.fn().mockResolvedValue(err({ kind: "not_found", message: "spot not found" })),
        findMany: vi.fn(),
      };
      const getSpotUsecase = GetSpotUsecase({
        spotRepository,
      });

      const spotId = faker.string.uuid({ version: 7 });
      const input = { spotId };

      // When
      const result = await getSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found", message: "spot not found" });
    });
  });
});
