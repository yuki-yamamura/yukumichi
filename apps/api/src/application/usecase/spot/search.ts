import type { SpotRepository, SpotSearchFilter } from "@/domain/model/spot/repository";
import type { Spot } from "@/domain/model/spot/model";

type CreateSearchSpotsUsecaseInput = {
  spotRepository: SpotRepository;
};

export type SearchSpotsUsecase = {
  execute: (filter: SpotSearchFilter) => Promise<Spot[]>;
};

export function createSearchSpotsUsecase({
  spotRepository,
}: CreateSearchSpotsUsecaseInput): SearchSpotsUsecase {
  return {
    execute: (filter) => spotRepository.search(filter),
  };
}
