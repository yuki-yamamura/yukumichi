import type { ArchivedSpot, Spot, SpotId } from "./models/spot";
import type { ConflictError, DataIntegrityError, NotFoundError } from "@/domain/error";
import type { Result } from "neverthrow";

export type SpotRepository = {
  archive: (archivedSpot: ArchivedSpot) => Promise<Result<SpotId, ConflictError | NotFoundError>>;
  create: (spot: Spot) => Promise<Result<SpotId, never>>;
  findArchivedSpotById: (
    id: SpotId,
  ) => Promise<Result<ArchivedSpot, DataIntegrityError | NotFoundError>>;
  findById: (id: SpotId) => Promise<Result<Spot, DataIntegrityError | NotFoundError>>;
  findMany: () => Promise<Result<Spot[], DataIntegrityError>>;
  update: (spot: Spot) => Promise<Result<Spot, DataIntegrityError | NotFoundError>>;
};
