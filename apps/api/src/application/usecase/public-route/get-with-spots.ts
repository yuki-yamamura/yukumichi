import type { PublicRouteRepository } from "@/domain/model/public-route/repository";

export class GetPublicRouteWithSpotsUseCase {
  constructor(private readonly publicRouteRepository: PublicRouteRepository) {}

  execute(routeId: string) {
    return this.publicRouteRepository.findWithSpots(routeId);
  }
}
