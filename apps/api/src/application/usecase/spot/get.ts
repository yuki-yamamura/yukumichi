import { errAsync } from "neverthrow";

import { SpotId } from "@/domain/spot/models/spot";

import type {
  DatabaseError,
  DataIntegrityError,
  NotFoundError,
  ValidationError,
} from "@/domain/error";
import type { Spot } from "@/domain/spot/models/spot";
import type { SpotRepository } from "@/domain/spot/repository";
import type { ResultAsync } from "neverthrow";

type GetSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type GetSpotUsecaseInput = {
  spotId: string;
};

export type GetSpotUsecase = {
  execute: (
    input: GetSpotUsecaseInput,
  ) => ResultAsync<Spot, DatabaseError | DataIntegrityError | NotFoundError | ValidationError>;
};

export function GetSpotUsecase({ spotRepository }: GetSpotUsecaseDeps): GetSpotUsecase {
  return {
    execute: ({ spotId }) => {
      const idResult = SpotId.safeParse(spotId);
      if (!idResult.success) {
        return errAsync({ kind: "validation", message: idResult.error.message });
      }

      return spotRepository.findById(idResult.data);
    },
  };
}
