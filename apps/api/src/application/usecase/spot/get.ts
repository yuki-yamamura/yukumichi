import { err } from "neverthrow";

import { SpotId } from "@/domain/spot/models/spot";

import type { DataIntegrityError, NotFoundError, ValidationError } from "@/domain/error";
import type { Spot } from "@/domain/spot/models/spot";
import type { SpotRepository } from "@/domain/spot/repository";
import type { Result } from "neverthrow";

type GetSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type GetSpotUsecaseInput = {
  spotId: string;
};

export type GetSpotUsecase = {
  execute: (
    input: GetSpotUsecaseInput,
  ) => Promise<Result<Spot, DataIntegrityError | NotFoundError | ValidationError>>;
};

export function GetSpotUsecase({ spotRepository }: GetSpotUsecaseDeps): GetSpotUsecase {
  return {
    execute: async (input) => {
      const idResult = SpotId.safeParse(input.spotId);
      if (!idResult.success) {
        return err({ kind: "validation", message: idResult.error.message });
      }

      return await spotRepository.findById(idResult.data);
    },
  };
}
