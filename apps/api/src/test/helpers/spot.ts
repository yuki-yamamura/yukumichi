import { faker, fakerJA } from "@faker-js/faker";
import { type Coordinate } from "@/domain/model/spot/coordinate";

export function createCoordinate(overwrite?: Partial<Coordinate>): Coordinate {
  const coordinate: Coordinate = {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  };

  return {
    ...coordinate,
    ...overwrite,
  };
}
