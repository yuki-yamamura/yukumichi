import type { SpotRepository } from "@/domain/model/spot/repository";
import type { UserId } from "@/domain/model/user/model";

export function listSpotsByUser(deps: { spotRepository: SpotRepository }) {
  return (userId: UserId) => deps.spotRepository.findByUserId(userId);
}
