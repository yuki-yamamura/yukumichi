import type { PublicRouteRepository } from "@/domain/model/public-route/repository";

export class GetPublicRouteWithBookmarkUseCase {
  constructor(private readonly publicRouteRepository: PublicRouteRepository) {}

  execute(routeId: string, userId: string) {
    return this.publicRouteRepository.findWithSpotsAndBookmark(routeId, userId);
  }
}
