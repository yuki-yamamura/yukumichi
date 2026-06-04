import { errAsync, okAsync } from "neverthrow";

import { archiveSpot, SpotId } from "@/domain/spot/models/spot";

import type {
  DatabaseError,
  DataIntegrityError,
  NotFoundError,
  SpotDuplicatedError,
  ValidationError,
} from "@/domain/error";
import type { SpotRepository } from "@/domain/spot/repository";
import type { ResultAsync } from "neverthrow";

type ArchiveSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type ArchiveSpotUsecaseInput = {
  spotId: string;
};

export type ArchiveSpotUsecase = {
  execute: (
    input: ArchiveSpotUsecaseInput,
  ) => ResultAsync<
    void,
    DatabaseError | DataIntegrityError | NotFoundError | SpotDuplicatedError | ValidationError
  >;
};

export function ArchiveSpotUsecase({ spotRepository }: ArchiveSpotUsecaseDeps): ArchiveSpotUsecase {
  return {
    execute: ({ spotId }) =>
      SpotId(spotId).asyncAndThen((spotId) =>
        spotRepository
          .findArchivedSpotById(spotId)
          .andThen((archivedSpot) =>
            errAsync({
              kind: "SPOT_DUPLICATED" as const,
              message: `Spot is already archived: ${archivedSpot.id}`,
            }),
          )
          .orElse((error) =>
            error.kind === "NOT_FOUND" ? spotRepository.findById(spotId) : errAsync(error),
          )
          .andThen((spot) => spotRepository.archive(archiveSpot(spot)))
          .andThen(() => okAsync()),
      ),
  };
}
