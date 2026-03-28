import { uuidv7 } from "uuidv7";
import { inject } from "vitest";

import { Spot, SpotId } from "@/domain/model/spot/spot";
import { createTestDatabase, truncateTables } from "@/test/helpers/database";
import { createCoordinate } from "@/test/helpers/spot";

import { SpotRepository } from "./spot";

import type { SpotRepository as SpotRepositoryType } from "@/domain/model/spot/repository";
import type { TestDatabase } from "@/test/helpers/database";

describe("SpotRepository", () => {
  let testDb: TestDatabase;
  let repository: SpotRepositoryType;

  beforeAll(() => {
    const databaseUrl = inject("databaseUrl");
    testDb = createTestDatabase(databaseUrl);
    repository = SpotRepository(testDb.db);
  });

  beforeEach(async () => {
    await truncateTables(testDb.db);
  });

  afterAll(async () => {
    await testDb.cleanup();
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
