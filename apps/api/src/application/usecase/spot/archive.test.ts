import { faker } from "@faker-js/faker";
import { err, ok } from "neverthrow";

import { createSpot, createSpotId } from "@/test/fixtures/spot";

import { ArchiveSpotUsecase } from "./archive";

import type { SpotRepository } from "@/domain/spot/repository";

describe("ArchiveSpotUsecase", () => {
  describe("execute", () => {
    it("should archive a spot related with id", async () => {
      // Given
      const spot = createSpot();
      const spotId = spot.id;

      const spotRepository: SpotRepository = {
        archive: vi.fn().mockResolvedValue(ok(spot.id)),
        create: vi.fn(),
        findArchivedSpotById: vi
          .fn()
          .mockResolvedValue(err({ kind: "not_found", message: faker.lorem.sentence() })),
        findById: vi.fn().mockResolvedValue(ok(spot)),
        findMany: vi.fn(),
        update: vi.fn(),
      };
      const archiveSpotUsecase = ArchiveSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await archiveSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBeUndefined();
    });

    it("should return an error when a spot is not found", async () => {
      // Given
      const spotId = createSpotId();
      const message = faker.lorem.sentence();

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findArchivedSpotById: vi
          .fn()
          .mockResolvedValue(err({ kind: "not_found", message: faker.lorem.sentence() })),
        findById: vi.fn().mockResolvedValue(err({ kind: "not_found", message })),
        findMany: vi.fn(),
        update: vi.fn(),
      };
      const archiveSpotUsecase = ArchiveSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await archiveSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found", message });
    });

    it("should return an error when a spot is already archived", async () => {
      // Given
      const spot = createSpot();
      const spotId = spot.id;
      const archivedSpot = { ...spot, archivedAt: faker.date.past() };

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findArchivedSpotById: vi.fn().mockResolvedValue(ok(archivedSpot)),
        findById: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      };
      const archiveSpotUsecase = ArchiveSpotUsecase({
        spotRepository,
      });

      const input = { spotId };

      // When
      const result = await archiveSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "conflict" });
    });
  });
});
