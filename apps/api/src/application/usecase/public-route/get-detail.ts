import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { PublicRouteId } from "@/domain/model/public-route/model";

export function getPublicRouteDetail(deps: {
  publicRouteRepository: PublicRouteRepository;
}) {
  return (routeId: PublicRouteId) =>
    deps.publicRouteRepository.findDetail(routeId);
}
