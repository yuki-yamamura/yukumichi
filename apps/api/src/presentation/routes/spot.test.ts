import { faker } from "@faker-js/faker";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { err, ok } from "neverthrow";

import { spotIdOutputSchema } from "@/presentation/schemas/id";
import { toSpotResponse } from "@/presentation/schemas/spot";
import { createSpot, createSpotId } from "@/test/fixtures/spot";

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

      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$post({
        json: {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          name: faker.location.street(),
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

      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$post({
        json: {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          name: "", // Invalid name (empty string)
        },
      });

      // Then
      expect(response.status).toBe(400);
    });

    it("should return 400 with a field path when latitude is out of range", async () => {
      // Given
      const createSpotUsecase = { execute: vi.fn() };
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase,
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$post({
        json: {
          latitude: 91,
          longitude: faker.location.longitude(),
          name: faker.location.street(),
        },
      });

      // Then
      expect(response.status).toBe(400);
      const body = (await response.json()) as { code: string; message: string };
      expect(body.code).toBe("VALIDATION_ERROR");
      expect(body.message).toContain("latitude");
      expect(createSpotUsecase.execute).not.toHaveBeenCalled();
    });

    it("should return 400 with a field path when longitude is out of range", async () => {
      // Given
      const createSpotUsecase = { execute: vi.fn() };
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase,
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$post({
        json: {
          latitude: faker.location.latitude(),
          longitude: 181,
          name: faker.location.street(),
        },
      });

      // Then
      expect(response.status).toBe(400);
      const body = (await response.json()) as { code: string; message: string };
      expect(body.code).toBe("VALIDATION_ERROR");
      expect(body.message).toContain("longitude");
      expect(createSpotUsecase.execute).not.toHaveBeenCalled();
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

      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$get();

      // Then
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ spots: spots.map((spot) => toSpotResponse(spot)) });
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

      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].$get({
        param: { spotId: spotIdOutputSchema.parse(spot.id) },
      });

      // Then
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ spot: toSpotResponse(spot) });
    });

    it("should return 400 status code when spotId is not a valid Base62-encoded ID", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(new Hono().route("/spots", spotRoute));

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

      const client = testClient(new Hono().route("/spots", spotRoute));

      const spotId = spotIdOutputSchema.parse(createSpotId());

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

      const client = testClient(new Hono().route("/spots", spotRoute));

      const spotId = spotIdOutputSchema.parse(createSpotId());

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId },
      });

      // Then
      expect(response.status).toBe(204);
      expect(await response.text()).toBe("");
    });

    it("should return 400 status code when spotId is not a valid Base62-encoded ID", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(new Hono().route("/spots", spotRoute));

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

      const client = testClient(new Hono().route("/spots", spotRoute));
      const spotId = spotIdOutputSchema.parse(createSpotId());

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

    it("should return 409 status code when a spot is already archived", async () => {
      // Given
      const message = faker.lorem.sentence();
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: {
          execute: vi.fn().mockResolvedValue(err({ kind: "conflict", message })),
        },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
      });

      const client = testClient(new Hono().route("/spots", spotRoute));
      const spotId = spotIdOutputSchema.parse(createSpotId());

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId },
      });

      // Then
      expect(response.status).toBe(409);
      expect(await response.json()).toEqual({
        code: "CONFLICT_ERROR",
        message,
      });
    });
  });
});
