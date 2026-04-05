import { faker } from "@faker-js/faker";

import { SpotId } from "@/domain/spot/model/spot";

import type { Coordinate } from "@/domain/spot/model/coordinate";
import type { Spot } from "@/domain/spot/model/spot";

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
    description: faker.lorem.sentence(),
    coordinate,
  };

  return {
    ...spot,
    ...overrides,
  };
}
