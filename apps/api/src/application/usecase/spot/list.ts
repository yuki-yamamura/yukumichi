import type { DatabaseError, DataIntegrityError } from "@/domain/error";
import type { Spot } from "@/domain/spot/models/spot";
import type { SpotRepository } from "@/domain/spot/repository";
import type { ResultAsync } from "neverthrow";

type ListSpotsUsecaseDeps = {
  spotRepository: SpotRepository;
};

export type ListSpotsUsecase = {
  execute: () => ResultAsync<Spot[], DatabaseError | DataIntegrityError>;
};

export function ListSpotsUsecase({ spotRepository }: ListSpotsUsecaseDeps): ListSpotsUsecase {
  return {
    execute: () => spotRepository.findMany(),
  };
}
