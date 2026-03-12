import { z } from "zod";
import type { UserId } from "@/domain/model/user/model";
import type { Spot } from "@/domain/model/spot/model";

export const PublicRouteId = z.guid().brand<"PublicRouteId">();

export type PublicRouteId = z.infer<typeof PublicRouteId>;

export type PublicRoute = {
  id: PublicRouteId;
  userId: UserId;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicRouteDetail = PublicRoute & {
  spots: Spot[];
};

export type PersonalizedRouteDetail = PublicRouteDetail & {
  isBookmarked: boolean;
};
