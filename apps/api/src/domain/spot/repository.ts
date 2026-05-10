import type { ArchivedSpot, Spot, SpotId } from "./models/spot";
import type { DatabaseError, DataIntegrityError, NotFoundError } from "@/domain/error";
import type { ResultAsync } from "neverthrow";

export type SpotRepository = {
  archive: (archivedSpot: ArchivedSpot) => ResultAsync<SpotId, DatabaseError>;
  create: (spot: Spot) => ResultAsync<SpotId, DatabaseError>;
  findArchivedSpotById: (
    id: SpotId,
  ) => ResultAsync<ArchivedSpot, DatabaseError | DataIntegrityError | NotFoundError>;
  findById: (id: SpotId) => ResultAsync<Spot, DatabaseError | DataIntegrityError | NotFoundError>;
  findMany: () => ResultAsync<Spot[], DatabaseError | DataIntegrityError>;
  update: (spot: Spot) => ResultAsync<Spot, DatabaseError | DataIntegrityError | NotFoundError>;
};
