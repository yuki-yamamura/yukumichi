import { SpotId } from "@/domain/model/spot/spot";

import type { SpotNotFoundError } from "@/domain/model/spot/error";
import type { SpotRepository } from "@/domain/model/spot/repository";
import type { Spot } from "@/domain/model/spot/spot";
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
  ) => Promise<Result<Spot, SpotNotFoundError>>;
};

export function GetSpotUsecase({
  spotRepository,
}: GetSpotUsecaseDeps): GetSpotUsecase {
  return {
    execute: async ({ spotId }) => {
      return await spotRepository.findById(SpotId.parse(spotId));
    },
  };
}
