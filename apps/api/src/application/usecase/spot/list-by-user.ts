import type { SpotRepository } from "@/domain/model/spot/repository";
import type { Spot } from "@/domain/model/spot/model";
import type { UserId } from "@/domain/model/user/model";

type CreateListSpotsByUserUsecaseInput = {
  spotRepository: SpotRepository;
};

type ListSpotsByUserUsecase = {
  execute: (userId: UserId) => Promise<Spot[]>;
};

export function createListSpotsByUserUsecase({
  spotRepository,
}: CreateListSpotsByUserUsecaseInput): ListSpotsByUserUsecase {
  return {
    execute: (userId: UserId) => {
      return spotRepository.findByUserId(userId);
    },
  };
}
