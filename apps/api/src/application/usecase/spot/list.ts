import { Result } from "neverthrow";

import type { SpotRepository } from "../../../domain/model/spot/repository";
import type { Spot } from "../../../domain/model/spot/spot";

type ListSpotsUsecaseDeps = {
  spotRepository: SpotRepository;
};

export type ListSpotsUsecase = {
  execute: () => Promise<Result<Spot[], never>>;
};

export function ListSpotsUsecase({
  spotRepository,
}: ListSpotsUsecaseDeps): ListSpotsUsecase {
  return {
    execute: () => {
      return spotRepository.findMany();
    },
  };
}
