import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { PersonalizedRouteDetail, PublicRouteId } from "@/domain/model/public-route/model";
import type { UserId } from "@/domain/model/user/model";

type CreateGetPublicRouteDetailForUserUsecaseInput = {
  publicRouteRepository: PublicRouteRepository;
};

type GetPublicRouteDetailForUserUsecase = {
  execute: (routeId: PublicRouteId, userId: UserId) => Promise<PersonalizedRouteDetail | undefined>;
};

export function createGetPublicRouteDetailForUserUsecase({
  publicRouteRepository,
}: CreateGetPublicRouteDetailForUserUsecaseInput): GetPublicRouteDetailForUserUsecase {
  return {
    execute: (routeId: PublicRouteId, userId: UserId) => {
      return publicRouteRepository.findDetailForUser(routeId, userId);
    },
  };
}
