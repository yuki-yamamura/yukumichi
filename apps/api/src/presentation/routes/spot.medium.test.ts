import { faker } from "@faker-js/faker";
import { testClient } from "hono/testing";
import { inject } from "vitest";

import { createApp } from "@/app";
import { SpotId } from "@/domain/model/spot/spot";
import { spots } from "@/infrastructure/database/schema";
import { createTestDatabase } from "@/test/database/helpers";
import { createCoordinate, createSpot } from "@/test/fixtures/spot";

const databaseUrl = inject("databaseUrl");
const testDb = createTestDatabase(databaseUrl);
const app = createApp({ databaseUrl });
const client = testClient(app);

describe("post /spots", () => {
  const coordinate = createCoordinate({
    latitude: 34.0522,
    longitude: 118.2437,
  });
  const spotId = SpotId.parse(faker.string.uuid({ version: 7 }));
  const spot = createSpot({
    id: spotId,
    name: "Test Spot",
    coordinate,
  });

  beforeEach(async () => {
    await testDb.truncateTables();

    const {
      id,
      name,
      coordinate: { latitude, longitude },
    } = spot;
    await testDb.db.insert(spots).values({ id, name, latitude, longitude });
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  it("should create a new spot and return success response", async () => {
    // When
    const response = await client.spots.$post({
      json: {
        name: "Test Spot",
        latitude: 37.7749,
        longitude: -122.4194,
      },
    });

    // Then
    expect(response.status).toBe(201);
    expect(await response.text()).toBe("");

    // Postcondition
    const rows = await testDb.db.select().from(spots);
    expect(rows).toHaveLength(2);
    expect(rows[1]).toEqual({
      id: expect.any(String),
      name: "Test Spot",
      latitude: 37.7749,
      longitude: -122.4194,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
