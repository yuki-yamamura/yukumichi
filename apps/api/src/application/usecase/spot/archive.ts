import { err, ok } from "neverthrow";

import { archiveSpot } from "@/domain/spot/models/spot";

import type { ConflictError, DataIntegrityError, NotFoundError } from "@/domain/error";
import type { SpotId } from "@/domain/spot/models/spot";
import type { SpotRepository } from "@/domain/spot/repository";
import type { Result } from "neverthrow";

type ArchiveSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type ArchiveSpotUsecaseInput = {
  spotId: SpotId;
};

export type ArchiveSpotUsecase = {
  execute: (
    input: ArchiveSpotUsecaseInput,
  ) => Promise<Result<void, ConflictError | DataIntegrityError | NotFoundError>>;
};

export function ArchiveSpotUsecase({ spotRepository }: ArchiveSpotUsecaseDeps): ArchiveSpotUsecase {
  return {
    execute: async ({ spotId }) => {
      const archivedResult = await spotRepository.findArchivedSpotById(spotId);
      if (archivedResult.isOk()) {
        return err({ kind: "conflict", message: `spot is already archived: ${spotId}` });
      }
      if (archivedResult.error.kind === "data_integrity") {
        return err(archivedResult.error);
      }

      const spotResult = await spotRepository.findById(spotId);
      if (spotResult.isErr()) {
        return err(spotResult.error);
      }

      const archivedSpot = archiveSpot(spotResult.value);
      const archiveResult = await spotRepository.archive(archivedSpot);

      return archiveResult.andThen(() => ok());
    },
  };
}
