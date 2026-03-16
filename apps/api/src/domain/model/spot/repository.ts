import type { UserId } from "@/domain/model/user/model";
import type { Spot, SpotId } from "./model";

export type CreateSpotInput = {
  id: SpotId;
  userId: UserId;
  name: string;
  latitude: number;
  longitude: number;
};

export type SpotSearchFilter = {
  userId: UserId;
  name?: string;
  latitudeRange?: { min: number; max: number };
  longitudeRange?: { min: number; max: number };
};

export type SpotRepository = {
  findByUserId: (userId: UserId) => Promise<Spot[]>;
  search: (filter: SpotSearchFilter) => Promise<Spot[]>;
  create: (input: CreateSpotInput) => Promise<Spot>;
};
