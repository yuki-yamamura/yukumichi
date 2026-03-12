import type { UserId } from "@/domain/model/user/model";
import type { PublicRouteId, PublicRouteDetail, PersonalizedRouteDetail } from "./model";

export type PublicRouteRepository = {
  findDetail: (routeId: PublicRouteId) => Promise<PublicRouteDetail | undefined>;
  findDetailForUser: (
    routeId: PublicRouteId,
    userId: UserId,
  ) => Promise<PersonalizedRouteDetail | undefined>;
};
