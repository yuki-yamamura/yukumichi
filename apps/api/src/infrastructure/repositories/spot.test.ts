import { eq } from "drizzle-orm";
import { inject } from "vitest";

import { generateSpotId } from "@/domain/spot/models/spot";
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
      const id = generateSpotId();
      const spot = createSpot({
        id,
        name: "Test Park",
        coordinate: createCoordinate({
          latitude: 0,
          longitude: 0,
        }),
        description: "A nice park to relax",
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
        description: spot.description,
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
      const spotA = createSpot();
      const spotB = createSpot();

      for (const spot of [spotA, spotB]) {
        const {
          id,
          name,
          description,
          coordinate: { latitude, longitude },
        } = spot;
        await testDb.db.insert(spots).values({ id, name, description, latitude, longitude });
      }

      // When
      const result = await repository.findMany();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([spotB, spotA]);
    });

    it("should filter an archived spot", async () => {
      // Given
      const spotA = createSpot();
      const spotB = createSpot();

      for (const spot of [spotA, spotB]) {
        const {
          id,
          name,
          description,
          coordinate: { latitude, longitude },
        } = spot;
        await testDb.db.insert(spots).values({ id, name, description, latitude, longitude });
      }
      await testDb.db.insert(archivedSpots).values({ spotId: spotB.id, archivedAt: new Date() });

      // When
      const result = await repository.findMany();

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([spotA]);
    });
  });

  describe("findById", () => {
    it("should return a spot by id", async () => {
      // Given
      const spot = createSpot();
      const {
        id,
        name,
        coordinate: { latitude, longitude },
        description,
      } = spot;
      await testDb.db.insert(spots).values({ id, name, description, latitude, longitude });

      // When
      const result = await repository.findById(spot.id);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(spot);
    });

    it("should return not_found when the spot does not exist", async () => {
      // Given
      const id = generateSpotId();

      // When
      const result = await repository.findById(id);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found", message: expect.any(String) });
    });

    it("should return not_found when the spot is archived", async () => {
      // Given
      const spot = createSpot();
      const {
        id,
        name,
        coordinate: { latitude, longitude },
        description,
      } = spot;
      await testDb.db.insert(spots).values({ id, name, description, latitude, longitude });
      await testDb.db.insert(archivedSpots).values({ spotId: spot.id, archivedAt: new Date() });

      // When
      const result = await repository.findById(spot.id);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found", message: expect.any(String) });
    });
  });

  describe("archive", () => {
    it("should store an archived spot and return its id", async () => {
      // Given
      const spot = createSpot();
      const {
        id,
        name,
        coordinate: { latitude, longitude },
        description,
      } = spot;
      await testDb.db.insert(spots).values({ id, name, description, latitude, longitude });
      const archivedAt = new Date();

      // When
      const result = await repository.archive({ ...spot, archivedAt });

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(spot.id);

      // Postcondition
      const rows = await testDb.db
        .select()
        .from(archivedSpots)
        .where(eq(archivedSpots.spotId, spot.id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual({
        spotId: spot.id,
        archivedAt,
      });
    });
  });
});
