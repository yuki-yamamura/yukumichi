import { faker } from "@faker-js/faker";
import { testClient } from "hono/testing";
import { err, ok } from "neverthrow";

import { createSpot } from "@/test/fixtures/spot";

import { createSpotRoute } from "./spot";

describe("createSpotRoute", () => {
  describe("post /spots", () => {
    it("should create a new spot and return 201 status code", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn().mockResolvedValue(ok()) },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots.$post({
        json: {
          name: faker.location.street(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      });

      // Then
      expect(response.status).toBe(201);
      expect(await response.text()).toBe("");
    });

    it("should return 400 status code when schema violation is found", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots.$post({
        json: {
          name: "", // Invalid name (empty string)
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      });

      // Then
      expect(response.status).toBe(400);
    });

    it("should return 400 status code when invalid parameters are specified", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: {
          execute: vi.fn().mockResolvedValue(err({ kind: "validation", message })),
        },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots.$post({
        json: {
          name: faker.location.street(),
          latitude: 999, // Invalid latitude
          longitude: faker.location.longitude(),
        },
      });

      // Then
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        code: "VALIDATION_ERROR",
        message,
      });
    });
  });

  describe("get /spots", () => {
    it("should return 200 status code with spots", async () => {
      // Given
      const spots = [createSpot(), createSpot()];

      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn().mockResolvedValue(ok(spots)) },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots.$get();

      // Then
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ spots });
    });
  });

  describe("get /spots/:spotId", () => {
    it("should return 200 status code with a spot", async () => {
      // Given
      const spot = createSpot();

      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn().mockResolvedValue(ok(spot)) },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots[":spotId"].$get({
        param: { spotId: spot.id },
      });

      // Then
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ spot });
    });

    it("should return 400 status code when spotId is not a UUID v7", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots[":spotId"].$get({
        param: { spotId: "not-a-uuid" },
      });

      // Then
      expect(response.status).toBe(400);
    });

    it("should return 404 status code when a spot is not found", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: {
          execute: vi.fn().mockResolvedValue(err({ kind: "not_found", message })),
        },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      const spotId = faker.string.uuid({ version: 7 });

      // When
      const response = await client.spots[":spotId"].$get({
        param: { spotId },
      });

      // Then
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        code: "NOT_FOUND_ERROR",
        message,
      });
    });
  });

  describe("post /spots/:spotId/archive", () => {
    it("should return 204 status code", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn().mockResolvedValue(ok()) },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      const spotId = faker.string.uuid({ version: 7 });

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId },
      });

      // Then
      expect(response.status).toBe(204);
      expect(await response.text()).toBe("");
    });

    it("should return 400 status code when spotId is not a UUID v7", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId: "not-a-uuid" },
      });

      // Then
      expect(response.status).toBe(400);
    });

    it("should return 404 status code when a spot is not found", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: {
          execute: vi.fn().mockResolvedValue(err({ kind: "not_found", message })),
        },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(spotRoute);
      const spotId = faker.string.uuid({ version: 7 });

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId },
      });

      // Then
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        code: "NOT_FOUND_ERROR",
        message,
      });
    });
  });
});
