import { Result } from "neverthrow";

import type { ArchivedSpot, Spot, SpotId } from "./spot";
import { SpotAlreadyArchivedError, SpotNotFoundError } from "./error";

export type SpotRepository = {
  create: (spot: Spot) => Promise<Result<SpotId, never>>;
  findMany: () => Promise<Result<Spot[], never>>;
  findById: (id: SpotId) => Promise<Result<Spot, SpotNotFoundError>>;
  archive: (
    archivedSpot: ArchivedSpot,
  ) => Promise<Result<SpotId, SpotNotFoundError | SpotAlreadyArchivedError>>;
};
