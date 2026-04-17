import { faker } from "@faker-js/faker";

import { SpotId } from "@/domain/spot/models/spot";
import { spotIdOutputSchema } from "@/presentation/schemas/id";

import type { Coordinate } from "@/domain/spot/models/coordinate";
import type { Spot } from "@/domain/spot/models/spot";

export function createSpotId(): string {
  return spotIdOutputSchema.parse(faker.string.uuid({ version: 7 }));
}

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
