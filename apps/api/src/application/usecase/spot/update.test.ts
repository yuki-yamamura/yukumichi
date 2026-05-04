import { err, ok } from "neverthrow";

import { createCoordinate, createSpot, createSpotId } from "@/test/fixtures/spot";

import { UpdateSpotUsecase } from "./update";

describe("UpdateSpotUsecase", () => {
  describe("execute", () => {
    it("should update a spot and return noting", async () => {
      // Given
      const existingSpot = createSpot();
      const input = {
        description: "Updated description",
        id: existingSpot.id,
        latitude: 35.6895,
        longitude: 139.6917,
        name: "Updated Spot",
      };
      const updatedSpot = createSpot({
        coordinate: createCoordinate({
          latitude: input.latitude,
          longitude: input.longitude,
        }),
        description: input.description,
        id: input.id,
        name: input.name,
      });

      const spotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findArchivedSpotById: vi.fn(),
        findById: vi.fn().mockResolvedValue(ok(existingSpot)),
        findMany: vi.fn(),
        update: vi.fn().mockResolvedValue(ok(updatedSpot)),
      };
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBeUndefined();
    });

    it("should return an error when the spot to update is not found", async () => {
      // Given
      const input = {
        description: "Updated description",
        id: createSpotId(),
        latitude: 35.6895,
        longitude: 139.6917,
        name: "Updated Spot",
      };

      const spotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findArchivedSpotById: vi.fn(),
        findById: vi.fn().mockResolvedValue(err({ kind: "not_found", message: "Spot not found" })),
        findMany: vi.fn(),
        update: vi.fn(),
      };
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found", message: "Spot not found" });
    });

    it("should return a validation error for invalid coordinates", async () => {
      // Given
      const existingSpot = createSpot();
      const input = {
        description: "Updated description",
        id: existingSpot.id,
        latitude: 999, // Invalid latitude
        longitude: 139.6917,
        name: "Updated Spot",
      };

      const spotRepository = {
        archive: vi.fn(),
        create: vi.fn(),
        findArchivedSpotById: vi.fn(),
        findById: vi.fn().mockResolvedValue(ok(existingSpot)),
        findMany: vi.fn(),
        update: vi.fn(),
      };
      const updateSpotUsecase = UpdateSpotUsecase({
        spotRepository,
      });

      // When
      const result = await updateSpotUsecase.execute(input);

      // Then
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toMatchObject({ kind: "validation" });
    });
  });
});
