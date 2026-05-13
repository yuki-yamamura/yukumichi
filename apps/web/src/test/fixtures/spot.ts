import { faker, fakerJA } from "@faker-js/faker";

import type { Coordinate, Spot } from "@/features/spot/types/api";

function createCoordinate(overrides?: Partial<Coordinate>): Coordinate {
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
  const spot: Spot = {
    coordinate: createCoordinate(),
    description: faker.lorem.sentence(),
    id: faker.string.uuid({ version: 7 }),
    name: fakerJA.lorem.words(2),
  };

  return {
    ...spot,
    ...overrides,
  };
}
