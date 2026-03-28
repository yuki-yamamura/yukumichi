import { err, ok } from "neverthrow";

import { archiveSpot, SpotId } from "@/domain/model/spot/spot";

import type { SpotAlreadyArchivedError, SpotNotFoundError } from "@/domain/model/spot/error";
import type { SpotRepository } from "@/domain/model/spot/repository";
import type { Result } from "neverthrow";

type ArchiveSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type ArchiveSpotUsecaseInput = {
  spotId: string;
};

export type ArchiveSpotUsecase = {
  execute: (
    input: ArchiveSpotUsecaseInput,
  ) => Promise<Result<void, SpotAlreadyArchivedError | SpotNotFoundError>>;
};

export function ArchiveSpotUsecase({ spotRepository }: ArchiveSpotUsecaseDeps): ArchiveSpotUsecase {
  return {
    execute: async (input) => {
      const spotId = SpotId.parse(input.spotId);
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
