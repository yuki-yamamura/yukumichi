import { ok } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { ListSpotsUsecase } from "./list";

import type { SpotRepository } from "@/domain/spot/repository";

describe("ListSpotsUsecase", () => {
  describe("execute", () => {
    it("should return spots", async () => {
      // Given
      const spots = [createSpot(), createSpot()];

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findArchivedSpotById: vi.fn(),
        findById: vi.fn(),
        findMany: vi.fn().mockResolvedValue(ok(spots)),
        update: vi.fn(),
      };
      const listSpotsUsecase = ListSpotsUsecase({ spotRepository });

      // When
      const result = await listSpotsUsecase.execute();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(spots);
    });
  });
});
