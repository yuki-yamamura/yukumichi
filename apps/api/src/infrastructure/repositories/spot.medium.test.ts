import { eq } from "drizzle-orm";
import { inject } from "vitest";

import { archivedSpots, spots } from "@/infrastructure/database/schema";
import { createTestDatabase } from "@/test/database/helpers";
import { createCoordinate, createSpot, createSpotId } from "@/test/fixtures/spot";

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
      const id = createSpotId();
      const spot = createSpot({
        coordinate: createCoordinate({
          latitude: 0,
          longitude: 0,
        }),
        description: "A nice park to relax",
        id,
        name: "Test Park",
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
        createdAt: expect.any(Date),
        description: spot.description,
        id: spot.id,
        latitude: spot.coordinate.latitude,
        longitude: spot.coordinate.longitude,
        name: spot.name,
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
          coordinate: { latitude, longitude },
          description,
          id,
          name,
        } = spot;
        await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });
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
          coordinate: { latitude, longitude },
          description,
          id,
          name,
        } = spot;
        await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });
      }
      await testDb.db.insert(archivedSpots).values({ archivedAt: new Date(), spotId: spotB.id });

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
        coordinate: { latitude, longitude },
        description,
        id,
        name,
      } = spot;
      await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });

      // When
      const result = await repository.findById(spot.id);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(spot);
    });

    it("should return not_found when the spot does not exist", async () => {
      // Given
      const id = createSpotId();

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
        coordinate: { latitude, longitude },
        description,
        id,
        name,
      } = spot;
      await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });
      await testDb.db.insert(archivedSpots).values({ archivedAt: new Date(), spotId: spot.id });

      // When
      const result = await repository.findById(spot.id);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found", message: expect.any(String) });
    });
  });

  describe("update", () => {
    it("should update a spot and return the updated spot", async () => {
      // Given
      const spot = createSpot();
      const updatedSpot = createSpot({
        coordinate: createCoordinate({
          latitude: 20,
          longitude: 30,
        }),
        description: "Updated description",
        id: spot.id,
        name: "Updated name",
      });

      const {
        coordinate: { latitude, longitude },
        description,
        id,
        name,
      } = spot;
      await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });

      // When
      const result = await repository.update(updatedSpot);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(updatedSpot);

      // Postcondition
      const rows = await testDb.db.select().from(spots).where(eq(spots.id, spot.id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual({
        createdAt: expect.any(Date),
        description: updatedSpot.description,
        id: updatedSpot.id,
        latitude: updatedSpot.coordinate.latitude,
        longitude: updatedSpot.coordinate.longitude,
        name: updatedSpot.name,
        updatedAt: expect.any(Date),
      });
    });

    it("should return not_found when the spot does not exist", async () => {
      // Given
      const spot = createSpot();

      // When
      const result = await repository.update(spot);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "not_found",
        message: expect.any(String),
      });
    });

    it("should return not_found when the spot is archived", async () => {
      // Given
      const spot = createSpot();
      const updatedSpot = createSpot({
        ...spot,
        name: "Updated name",
      });

      const {
        coordinate: { latitude, longitude },
        description,
        id,
        name,
      } = spot;
      await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });
      await testDb.db.insert(archivedSpots).values({ archivedAt: new Date(), spotId: spot.id });

      // When
      const result = await repository.update(updatedSpot);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: "not_found",
        message: expect.any(String),
      });
    });
  });

  describe("archive", () => {
    it("should store an archived spot and return its id", async () => {
      // Given
      const spot = createSpot();
      const {
        coordinate: { latitude, longitude },
        description,
        id,
        name,
      } = spot;
      await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });
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
        archivedAt,
        spotId: spot.id,
      });
    });
  });
});
