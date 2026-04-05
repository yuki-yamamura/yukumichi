import type { DataIntegrityError } from "@/domain/error";
import type { Spot } from "@/domain/spot/models/spot";
import type { SpotRepository } from "@/domain/spot/repository";
import type { Result } from "neverthrow";

type ListSpotsUsecaseDeps = {
  spotRepository: SpotRepository;
};

export type ListSpotsUsecase = {
  execute: () => Promise<Result<Spot[], DataIntegrityError>>;
};

export function ListSpotsUsecase({ spotRepository }: ListSpotsUsecaseDeps): ListSpotsUsecase {
  return {
    execute: () => {
      return spotRepository.findMany();
    },
  };
}
