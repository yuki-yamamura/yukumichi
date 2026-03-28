import { err, ok, Result } from "neverthrow";

import { SpotRepository } from "../../../domain/model/spot/repository";
import { SpotValidationError } from "../../../domain/model/spot/error";
import { Spot } from "../../../domain/model/spot/spot";
import { uuidv7 } from "uuidv7";

type CreateSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type CreateSpotUsecaseInput = {
  name: string;
  latitude: number;
  longitude: number;
};

export type CreateSpotUsecase = {
  execute: (
    input: CreateSpotUsecaseInput,
  ) => Promise<Result<void, SpotValidationError>>;
};

export function CreateSpotUsecase({
  spotRepository,
}: CreateSpotUsecaseDeps): CreateSpotUsecase {
  return {
    execute: async (input) => {
      const spotResult = Spot({ id: uuidv7(), ...input });
      if (spotResult.isErr()) {
        return err(spotResult.error);
      }

      return (await spotRepository.create(spotResult.value)).andThen(() =>
        ok(),
      );
    },
  };
}
