import { z } from "zod";
import { UserId } from "@/domain/model/user/model";
import { Spot } from "@/domain/model/spot/model";

export const PublicRouteId = z.uuid().brand<"PublicRouteId">();
export type PublicRouteId = z.infer<typeof PublicRouteId>;

export const PublicRoute = z.object({
  id: PublicRouteId,
  userId: UserId,
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PublicRoute = z.infer<typeof PublicRoute>;

export const PublicRouteDetail = PublicRoute.extend({
  spots: z.array(Spot),
});
export type PublicRouteDetail = z.infer<typeof PublicRouteDetail>;

export const PersonalizedRouteDetail = PublicRouteDetail.extend({
  isBookmarked: z.boolean(),
});
export type PersonalizedRouteDetail = z.infer<typeof PersonalizedRouteDetail>;

export function createPublicRouteDetail(input: unknown): PublicRouteDetail {
  return PublicRouteDetail.parse(input);
}

export function createPersonalizedRouteDetail(
  input: unknown,
): PersonalizedRouteDetail {
  return PersonalizedRouteDetail.parse(input);
}
