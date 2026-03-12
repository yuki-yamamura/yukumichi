import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { PublicRouteId } from "@/domain/model/public-route/model";
import type { UserId } from "@/domain/model/user/model";

export function getPublicRouteDetailForUser(deps: {
  publicRouteRepository: PublicRouteRepository;
}) {
  return (routeId: PublicRouteId, userId: UserId) =>
    deps.publicRouteRepository.findDetailForUser(routeId, userId);
}
