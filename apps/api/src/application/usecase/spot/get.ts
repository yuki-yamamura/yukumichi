import { Result } from "neverthrow";
import { SpotRepository } from "../../../domain/model/spot/repository";
import { Spot, SpotId } from "../../../domain/model/spot/spot";
import { SpotNotFoundError } from "../../../domain/model/spot/error";

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
