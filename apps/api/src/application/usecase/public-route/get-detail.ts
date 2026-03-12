import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { PublicRouteId } from "@/domain/model/public-route/model";

export function getPublicRouteDetail(deps: {
  publicRouteRepository: PublicRouteRepository;
}) {
  return function execute(routeId: PublicRouteId) {
    return deps.publicRouteRepository.findDetail(routeId);
  };
}
