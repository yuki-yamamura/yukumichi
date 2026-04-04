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
    id: faker.string.uuid({ version: 7 }) as Spot["id"],
    name: fakerJA.lorem.words(2),
    description: faker.lorem.sentence(),
    coordinate: createCoordinate(),
  };

  return {
    ...spot,
    ...overrides,
  };
}
