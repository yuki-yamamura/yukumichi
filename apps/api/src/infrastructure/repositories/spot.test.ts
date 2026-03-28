import { eq } from "drizzle-orm";
import { uuidv7 } from "uuidv7";
import { inject } from "vitest";

import { SpotId } from "@/domain/model/spot/spot";
import { archivedSpots, spots } from "@/infrastructure/database/schema";
import { createTestDatabase } from "@/test/database/helpers";
import { createCoordinate, createSpot } from "@/test/fixtures/spot";

import { SpotRepository } from "./spot";

const databaseUrl = inject("databaseUrl");
const testDb = createTestDatabase(databaseUrl);
const repository = SpotRepository(testDb.db);

describe("SpotRepository", () => {
  beforeEach(async () => {
    await testDb.truncateTables();
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  describe("create", () => {
    it("should store a spot and return its id", async () => {
      // Given
      const id = SpotId.parse(uuidv7());
      const spot = createSpot({
        id,
        name: "Test Park",
        coordinate: createCoordinate({
          latitude: 0,
          longitude: 0,
        }),
      });

      // When
      const result = await repository.create(spot);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(id);

      // Postcondition
      const rows = await testDb.db.select().from(spots).where(eq(spots.id, id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual({
        id: spot.id,
        name: spot.name,
        latitude: spot.coordinate.latitude,
        longitude: spot.coordinate.longitude,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("findMany", () => {
    it("should list all non-archived spots", async () => {
      // Given
      const expected = [createSpot(), createSpot()];

      for (const spot of expected) {
        const {
          id,
          name,
          coordinate: { latitude, longitude },
        } = spot;
        await testDb.db.insert(spots).values({ id, name, latitude, longitude });
      }

      // When
      const result = await repository.findMany();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(expected);
    });

    it("should filter an archived spot", async () => {
      // Given
      const spotA = createSpot();
      const spotB = createSpot();

      for (const spot of [spotA, spotB]) {
        const {
          id,
          name,
          coordinate: { latitude, longitude },
        } = spot;
        await testDb.db.insert(spots).values({ id, name, latitude, longitude });
      }
      await testDb.db.insert(archivedSpots).values({ spotId: spotB.id, archivedAt: new Date() });

      // When
      const result = await repository.findMany();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([spotA]);
    });
  });
});
