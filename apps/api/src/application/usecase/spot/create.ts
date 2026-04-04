import { err, ok } from "neverthrow";
import { uuidv7 } from "uuidv7";

import { Spot } from "@/domain/model/spot/spot";

import type { SpotValidationError } from "@/domain/model/spot/error";
import type { SpotRepository } from "@/domain/model/spot/repository";
import type { Result } from "neverthrow";

type CreateSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type CreateSpotUsecaseInput = {
  latitude: number;
  longitude: number;
  name: string;
  description?: string;
};

export type CreateSpotUsecase = {
  execute: (input: CreateSpotUsecaseInput) => Promise<Result<void, SpotValidationError>>;
};

export function CreateSpotUsecase({ spotRepository }: CreateSpotUsecaseDeps): CreateSpotUsecase {
  return {
    execute: async (input) => {
      const spotResult = Spot({ id: uuidv7(), ...input });
      if (spotResult.isErr()) {
        return err(spotResult.error);
      }

      const createResult = await spotRepository.create(spotResult.value);

      return createResult.andThen(() => ok());
    },
  };
}
