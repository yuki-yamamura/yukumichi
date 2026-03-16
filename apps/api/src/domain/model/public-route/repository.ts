import type { UserId } from "@/domain/model/user/model";
import type { SpotId } from "@/domain/model/spot/model";
import type { PublicRouteId, PublicRoute, PublicRouteDetail, PersonalizedRouteDetail } from "./model";

export type CreatePublicRouteInput = {
  id: PublicRouteId;
  userId: UserId;
  title: string;
  description: string | null;
};

export type PublicRouteRepository = {
  findDetail: (routeId: PublicRouteId) => Promise<PublicRouteDetail | undefined>;
  findDetailForUser: (
    routeId: PublicRouteId,
    userId: UserId,
  ) => Promise<PersonalizedRouteDetail | undefined>;
  create: (input: CreatePublicRouteInput) => Promise<PublicRoute>;
  addSpots: (routeId: PublicRouteId, spotIds: SpotId[]) => Promise<void>;
};
