import { SpotId } from "@/domain/spot/models/spot";

import type { DataIntegrityError, NotFoundError } from "@/domain/error";
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
  ) => Promise<Result<Spot, DataIntegrityError | NotFoundError>>;
};

export function GetSpotUsecase({ spotRepository }: GetSpotUsecaseDeps): GetSpotUsecase {
  return {
    execute: async ({ spotId }) => {
      return await spotRepository.findById(SpotId.parse(spotId));
    },
  };
}
