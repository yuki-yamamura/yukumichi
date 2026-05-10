import { desc, eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { inject } from "vitest";

import { createApp } from "@/app";
import { archivedSpots, spots } from "@/infrastructure/database/schema";
import { base62Encode } from "@/presentation/helpers/id";
import { getSpotResponseSchema, listSpotsResponseSchema } from "@/presentation/schemas/spot";
import { createTestDatabaseHelper } from "@/test/database/test-database-helper";
import { createSpot } from "@/test/fixtures/spot";

const appEnv = inject("appEnv");
const databaseUrl = inject("databaseUrl");
const env = { APP_ENV: appEnv, DATABASE_URL: databaseUrl };
const testDb = createTestDatabaseHelper(env);
const app = createApp(env);
const client = testClient(app);

const spotA = createSpot();
const spotB = createSpot();

beforeEach(async () => {
  await testDb.truncateTables();

  const fakeSpots = [spotA, spotB];
  for (const {
    coordinate: { latitude, longitude },
    description,
    id,
    name,
  } of fakeSpots) {
    await testDb.db.insert(spots).values({ description, id, latitude, longitude, name });
  }
});

afterAll(async () => {
  await testDb.cleanup();
});

describe("post /spots", () => {
  it("should create a new spot and return 201 status code", async () => {
    // When
    const response = await client.spots.$post({
      json: {
        latitude: 37.7749,
        longitude: -122.4194,
        name: "Test Spot",
      },
    });

    // Then
    expect(response.status).toBe(201);
    expect(await response.text()).toBe("");

    const rows = await testDb.db.select().from(spots).orderBy(desc(spots.createdAt));
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({
      createdAt: expect.any(Date),
      description: null,
      id: expect.any(String),
      latitude: 37.7749,
      longitude: -122.4194,
      name: "Test Spot",
      updatedAt: expect.any(Date),
    });
  });
});

describe("get /spots", () => {
  it("should return a success response with a list of spots", async () => {
    // When
    const response = await client.spots.$get();

    // Then
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(listSpotsResponseSchema.parse({ spots: [spotB, spotA] }));
  });
});

describe("get /spots/:spotId", () => {
  it("should return a success response with a specified spot", async () => {
    // When
    const response = await client.spots[":spotId"].$get({
      param: {
        spotId: base62Encode(spotA.id),
      },
    });

    // Then
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(getSpotResponseSchema.parse({ spot: spotA }));
  });
});

describe("patch /spots/:spotId", () => {
  it("should update a specified spot and return a success response", async () => {
    // When
    const response = await client.spots[":spotId"].$patch({
      json: {
        description: "Updated description",
        latitude: 10,
        longitude: 20,
        name: "Updated name",
      },
      param: {
        spotId: base62Encode(spotA.id),
      },
    });

    // Then
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");

    // Postcondition
    const rows = await testDb.db.select().from(spots).orderBy(desc(spots.createdAt));
    expect(rows).toHaveLength(2);

    expect(rows[0]).toEqual({
      createdAt: expect.any(Date),
      description: spotB.description,
      id: spotB.id,
      latitude: spotB.coordinate.latitude,
      longitude: spotB.coordinate.longitude,
      name: spotB.name,
      updatedAt: expect.any(Date),
    });

    expect(rows[1]).toEqual({
      createdAt: expect.any(Date),
      description: "Updated description",
      id: expect.any(String),
      latitude: 10,
      longitude: 20,
      name: "Updated name",
      updatedAt: expect.any(Date),
    });
  });
});

describe("post /spots/:spotId/archive", () => {
  it("should archive a specified spot and return a success response", async () => {
    // When
    const response = await client.spots[":spotId"].archive.$post({
      param: {
        spotId: base62Encode(spotA.id),
      },
    });

    // Then
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");

    // Postcondition
    const rows = await testDb.db
      .select()
      .from(archivedSpots)
      .where(eq(archivedSpots.spotId, spotA.id));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      archivedAt: expect.any(Date),
      spotId: spotA.id,
    });
  });
});
