import { desc, eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { inject } from "vitest";

import { createApp } from "@/app";
import { archivedSpots, spots } from "@/infrastructure/database/schema";
import { spotIdOutputSchema } from "@/presentation/schemas/id";
import { toSpotResponse } from "@/presentation/schemas/spot";
import { createTestDatabase } from "@/test/database/helpers";
import { createSpot } from "@/test/fixtures/spot";

const databaseUrl = inject("databaseUrl");
const testDb = createTestDatabase(databaseUrl);
const app = createApp({ databaseUrl });
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
  it("should create a new spot and return created status", async () => {
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

    // Postcondition
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
    expect(await response.json()).toEqual({
      spots: [toSpotResponse(spotB), toSpotResponse(spotA)],
    });
  });
});

describe("get /spots/:spotId", () => {
  it("should return a success response with a specified spot", async () => {
    // When
    const response = await client.spots[":spotId"].$get({
      param: {
        spotId: spotIdOutputSchema.parse(spotA.id),
      },
    });

    // Then
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ spot: toSpotResponse(spotA) });
  });
});

describe("post /spots/:spotId/archive", () => {
  it("should archive a specified spot and return a success response", async () => {
    // When
    const response = await client.spots[":spotId"].archive.$post({
      param: {
        spotId: spotIdOutputSchema.parse(spotA.id),
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
