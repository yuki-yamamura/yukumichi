import { err, ok } from "neverthrow";

import { generateSpotId, Spot } from "@/domain/spot/models/spot";

import type { ValidationError } from "@/domain/error";
import type { SpotRepository } from "@/domain/spot/repository";
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
  execute: (input: CreateSpotUsecaseInput) => Promise<Result<void, ValidationError>>;
};

export function CreateSpotUsecase({ spotRepository }: CreateSpotUsecaseDeps): CreateSpotUsecase {
  return {
    execute: async (input) => {
      const spotResult = Spot({ id: generateSpotId(), ...input });
      if (spotResult.isErr()) {
        return err(spotResult.error);
      }

      const createResult = await spotRepository.create(spotResult.value);

      return createResult.andThen(() => ok());
    },
  };
}
