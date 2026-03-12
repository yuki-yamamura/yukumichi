import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { PublicRouteDetail, PublicRouteId } from "@/domain/model/public-route/model";

type GetPublicRouteDetailUsecaseInput = {
  publicRouteRepository: PublicRouteRepository;
};

export type GetPublicRouteDetailUsecase = {
  execute: (routeId: PublicRouteId) => Promise<PublicRouteDetail | undefined>;
};

export function createGetPublicRouteDetailUsecase({
  publicRouteRepository,
}: GetPublicRouteDetailUsecaseInput): GetPublicRouteDetailUsecase {
  return {
    execute: (routeId: PublicRouteId) => {
      return publicRouteRepository.findDetail(routeId);
    },
  };
}
