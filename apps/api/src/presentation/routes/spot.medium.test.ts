import { testClient } from "hono/testing";
import { inject } from "vitest";

import { createApp } from "@/app";
import { spots } from "@/infrastructure/database/schema";
import { createTestDatabase } from "@/test/database/helpers";

const databaseUrl = inject("databaseUrl");
const testDb = createTestDatabase(databaseUrl);
const app = createApp({ databaseUrl });
const client = testClient(app);

describe("post /spots", () => {
  beforeEach(async () => {
    await testDb.truncateTables();
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
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      id: expect.any(String),
      name: "Test Spot",
      latitude: 37.7749,
      longitude: -122.4194,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
