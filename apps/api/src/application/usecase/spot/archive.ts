import { err, ok, Result } from "neverthrow";
import { SpotRepository } from "../../../domain/model/spot/repository";
import {
  SpotAlreadyArchivedError,
  SpotNotFoundError,
} from "../../../domain/model/spot/error";
import { archiveSpot, SpotId } from "../../../domain/model/spot/spot";

type ArchiveSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type ArchiveSpotUsecaseInput = {
  spotId: string;
};

export type ArchiveSpotUsecase = {
  execute: (
    input: ArchiveSpotUsecaseInput,
  ) => Promise<Result<void, SpotNotFoundError | SpotAlreadyArchivedError>>;
};

export function ArchiveSpotUsecase({
  spotRepository,
}: ArchiveSpotUsecaseDeps): ArchiveSpotUsecase {
  return {
    execute: async (input) => {
      const spotId = SpotId.parse(input.spotId);
      const spotResult = await spotRepository.findById(spotId);
      if (spotResult.isErr()) {
        return err(spotResult.error);
      }

      const archivedSpot = archiveSpot(spotResult.value);

      return (await spotRepository.archive(archivedSpot)).andThen(() => ok());
    },
  };
}
