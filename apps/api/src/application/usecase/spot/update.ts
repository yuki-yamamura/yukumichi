import { errAsync, ok } from "neverthrow";

import { Spot, SpotId } from "@/domain/spot/models/spot";

import type {
  DatabaseError,
  DataIntegrityError,
  NotFoundError,
  ValidationError,
} from "@/domain/error";
import type { SpotRepository } from "@/domain/spot/repository";
import type { ResultAsync } from "neverthrow";

type UpdateSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type UpdateSpotUsecaseInput = {
  id: string;
} & Partial<{
  description: string;
  latitude: number;
  longitude: number;
  name: string;
}>;

export type UpdateSpotUsecase = {
  execute: (
    input: UpdateSpotUsecaseInput,
  ) => ResultAsync<void, DatabaseError | DataIntegrityError | NotFoundError | ValidationError>;
};

export function UpdateSpotUsecase({ spotRepository }: UpdateSpotUsecaseDeps): UpdateSpotUsecase {
  return {
    execute: ({ id, ...rest }) => {
      const idResult = SpotId.safeParse(id);
      if (!idResult.success) {
        return errAsync({ kind: "validation", message: idResult.error.message });
      }

      return spotRepository
        .findById(idResult.data)
        .andThen((existingSpot) =>
          Spot({
            description: existingSpot.description,
            id: existingSpot.id,
            latitude: existingSpot.coordinate.latitude,
            longitude: existingSpot.coordinate.longitude,
            name: existingSpot.name,
            ...rest,
          }),
        )
        .andThen((spot) => spotRepository.update(spot))
        .andThen(() => ok());
    },
  };
}
