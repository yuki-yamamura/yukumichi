import type { SpotRepository } from "@/domain/model/spot/repository";

export class ListSpotsByUserUseCase {
  constructor(private readonly spotRepository: SpotRepository) {}

  execute(userId: string) {
    return this.spotRepository.findByUserId(userId);
  }
}
