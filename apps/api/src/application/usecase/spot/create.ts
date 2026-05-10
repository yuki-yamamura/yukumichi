import { okAsync } from "neverthrow";

import { generateSpotId, Spot } from "@/domain/spot/models/spot";

import type { DatabaseError, ValidationError } from "@/domain/error";
import type { SpotRepository } from "@/domain/spot/repository";
import type { ResultAsync } from "neverthrow";

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
  execute: (input: CreateSpotUsecaseInput) => ResultAsync<void, DatabaseError | ValidationError>;
};

export function CreateSpotUsecase({ spotRepository }: CreateSpotUsecaseDeps): CreateSpotUsecase {
  return {
    execute: ({ description, ...rest }) => {
      return Spot({ description: description ?? null, id: generateSpotId(), ...rest })
        .asyncAndThen((spot) => spotRepository.create(spot))
        .andThen(() => okAsync());
    },
  };
}
