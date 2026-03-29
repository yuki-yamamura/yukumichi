import { ok } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { ListSpotsUsecase } from "./list";

import type { SpotRepository } from "@/domain/model/spot/repository";

describe("ListSpotsUsecase", () => {
  describe("execute", () => {
    it("should return spots", async () => {
      // Given
      const spotA = createSpot();
      const spotB = createSpot();

      const spotRepository: SpotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        findMany: vi.fn().mockResolvedValue(ok([spotA, spotB])),
      };
      const listSpotsUsecase = ListSpotsUsecase({ spotRepository });

      // When
      const result = await listSpotsUsecase.execute();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([spotA, spotB]);
    });
  });
});
