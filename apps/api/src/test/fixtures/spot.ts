import { faker } from "@faker-js/faker";

import { SpotId } from "@/domain/model/spot/spot";

import type { Coordinate } from "@/domain/model/spot/coordinate";
import type { Spot } from "@/domain/model/spot/spot";

export function createCoordinate(overrides?: Partial<Coordinate>): Coordinate {
  const coordinate: Coordinate = {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  };

  return {
    ...coordinate,
    ...overrides,
  };
}

export function createSpot(overrides?: Partial<Spot>): Spot {
  const coordinate = createCoordinate();

  const spot: Spot = {
    id: SpotId.parse(faker.string.uuid({ version: 7 })),
    name: faker.location.street(),
    description: null,
    coordinate,
  };

  return {
    ...spot,
    ...overrides,
  };
}
