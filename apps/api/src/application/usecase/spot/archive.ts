import { errAsync, okAsync } from "neverthrow";

import { archiveSpot, SpotId } from "@/domain/spot/models/spot";

import type {
  ConflictError,
  DatabaseError,
  DataIntegrityError,
  NotFoundError,
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
    ConflictError | DatabaseError | DataIntegrityError | NotFoundError | ValidationError
  >;
};

export function ArchiveSpotUsecase({ spotRepository }: ArchiveSpotUsecaseDeps): ArchiveSpotUsecase {
  return {
    execute: (input) => {
      const idResult = SpotId.safeParse(input.spotId);
      if (!idResult.success) {
        return errAsync({ kind: "validation", message: idResult.error.message });
      }

      return spotRepository
        .findArchivedSpotById(idResult.data)
        .andThen((archivedSpot) => {
          return errAsync({
            kind: "conflict" as const,
            message: `Spot is already archived: ${archivedSpot.id}`,
          });
        })
        .orElse((error) =>
          error.kind === "not_found" ? spotRepository.findById(idResult.data) : errAsync(error),
        )
        .andThen((spot) => {
          const archivedSpot = archiveSpot(spot);

          return spotRepository.archive(archivedSpot);
        })
        .andThen(() => okAsync());
    },
  };
}
