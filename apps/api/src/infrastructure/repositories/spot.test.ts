import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { uuidv7 } from "uuidv7";
import { inject } from "vitest";

import { Spot, SpotId } from "@/domain/model/spot/spot";
import * as schema from "@/infrastructure/database/schema";
import { truncateTables } from "@/test/helpers/database";
import { createCoordinate } from "@/test/helpers/spot";

import { SpotRepository } from "./spot";

const client = postgres(inject("databaseUrl"));
const db = drizzle(client, { schema, casing: "snake_case" });

describe("SpotRepository", () => {
  const repository = SpotRepository(db);

  beforeEach(async () => {
    await truncateTables(db);
  });

  afterAll(async () => {
    await client.end();
  });

  it("should create a spot and find it by ID", async () => {
    // Given
    const id = SpotId.parse(uuidv7());
    const coordinate = createCoordinate();
    const spot = Spot({
      id,
      name: "Test Park",
      ...coordinate,
    })._unsafeUnwrap();

    // When
    const createResult = await repository.create(spot);

    // Then
    expect(createResult.isOk()).toBe(true);

    // When
    const findResult = await repository.findById(id);

    // Then
    expect(findResult.isOk()).toBe(true);
    const found = findResult._unsafeUnwrap();
    expect(found.name).toBe("Test Park");
    expect(found.coordinate.latitude).toBe(coordinate.latitude);
    expect(found.coordinate.longitude).toBe(coordinate.longitude);
  });

  it("should list all non-archived spots", async () => {
    // Given
    const id = SpotId.parse(uuidv7());
    const spot = Spot({
      id,
      name: "Listed Park",
      ...createCoordinate(),
    })._unsafeUnwrap();
    await repository.create(spot);

    // When
    const result = await repository.findMany();

    // Then
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toHaveLength(1);
  });

  it("should not find an archived spot by ID", async () => {
    // Given
    const id = SpotId.parse(uuidv7());
    const spot = Spot({
      id,
      name: "Archived Park",
      ...createCoordinate(),
    })._unsafeUnwrap();
    await repository.create(spot);
    await repository.archive({ ...spot, archivedAt: new Date() });

    // When
    const result = await repository.findById(id);

    // Then
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "not_found" });
  });
});
