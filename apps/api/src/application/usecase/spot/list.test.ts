import { faker } from "@faker-js/faker";
import { errAsync, ok } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { ListSpotsUsecase } from "./list";

import type { SpotRepository } from "@/domain/spot/repository";

describe("ListSpotsUsecase", () => {
  describe("execute", () => {
    it("should return spots", async () => {
      // Given
      const spots = [createSpot(), createSpot()];

      const spotRepository = createSpotRepository({
        findMany: vi.fn().mockResolvedValue(ok(spots)),
      });
      const listSpotsUsecase = ListSpotsUsecase({ spotRepository });

      // When
      const result = await listSpotsUsecase.execute();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(spots);
    });

    it("should return a database error when the repository fails", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        findMany: vi.fn().mockReturnValue(errAsync({ kind: "DATABASE", message })),
      });
      const listSpotsUsecase = ListSpotsUsecase({ spotRepository });

      // When
      const result = await listSpotsUsecase.execute();

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "DATABASE", message });
    });

    it("should return a data integrity error when the repository data is corrupted", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRepository = createSpotRepository({
        findMany: vi.fn().mockReturnValue(errAsync({ kind: "DATA_INTEGRITY", message })),
      });
      const listSpotsUsecase = ListSpotsUsecase({ spotRepository });

      // When
      const result = await listSpotsUsecase.execute();

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
