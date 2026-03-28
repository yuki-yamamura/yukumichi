import { faker, fakerJA } from "@faker-js/faker";
import { uuidv7 } from "uuidv7";
import { Coordinate, Spot } from "../../features/spot/types/api";

function createCoordinate(overwrite?: Partial<Coordinate>): Coordinate {
  const coordinate: Coordinate = {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  };

  return {
    ...coordinate,
    ...overwrite,
  };
}

export function createSpot(overwrite?: Partial<Spot>): Spot {
  const spot: Spot = {
    id: uuidv7() as Spot["id"],
    name: fakerJA.lorem.words(2),
    coordinate: createCoordinate(),
  };

  return {
    ...spot,
    ...overwrite,
  };
}
