import type { SpotAlreadyArchivedError, SpotNotFoundError } from "./error";
import type { ArchivedSpot, Spot, SpotId } from "./spot";
import type { Result } from "neverthrow";

export type SpotRepository = {
  archive: (
    archivedSpot: ArchivedSpot,
  ) => Promise<Result<SpotId, SpotAlreadyArchivedError | SpotNotFoundError>>;
  create: (spot: Spot) => Promise<Result<SpotId, never>>;
  findById: (id: SpotId) => Promise<Result<Spot, SpotNotFoundError>>;
  findMany: () => Promise<Result<Spot[], never>>;
};
