import { faker } from "@faker-js/faker";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { err, ok } from "neverthrow";

import { base62Encode } from "@/presentation/schemas/id";
import { getSpotResponseSchema, listSpotsResponseSchema } from "@/presentation/schemas/spot";
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
        updateSpotUsecase: { execute: vi.fn() },
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
        updateSpotUsecase: { execute: vi.fn() },
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
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$post({
        json: {
          latitude: 91, // Invalid latitude (greater than 90)
          longitude: faker.location.longitude(),
          name: faker.location.street(),
        },
      });

      // Then
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ code: "VALIDATION_ERROR" });
    });

    it("should return 400 with a field path when longitude is out of range", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$post({
        json: {
          latitude: faker.location.latitude(),
          longitude: 181, // Invalid longitude (greater than 180)
          name: faker.location.street(),
        },
      });

      // Then
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ code: "VALIDATION_ERROR" });
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
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots.$get();

      // Then
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(listSpotsResponseSchema.parse({ spots }));
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
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].$get({
        param: { spotId: base62Encode(spot.id) },
      });

      // Then
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(getSpotResponseSchema.parse({ spot }));
    });

    it("should return 400 status code when spotId is not a valid Base62-encoded ID", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn() },
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
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: {
          execute: vi.fn().mockResolvedValue(
            err({
              kind: "not_found",
              message: faker.lorem.sentence(),
            }),
          ),
        },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].$get({
        param: {
          spotId: base62Encode(createSpotId()),
        },
      });

      // Then
      expect(response.status).toBe(404);
      expect(await response.json()).toMatchObject({ code: "NOT_FOUND_ERROR" });
    });
  });

  describe("patch /spots/:spotId", () => {
    it("should update a spot and return 204 status code", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn().mockResolvedValue(ok()) },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].$patch({
        json: {
          name: "Updated Spot Name",
        },
        param: { spotId: base62Encode(createSpotId()) },
      });

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
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].$patch({
        json: {
          name: "Updated Spot Name",
        },
        param: { spotId: "not-a-uuid" },
      });

      // Then
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ code: "VALIDATION_ERROR" });
    });

    it("should return 404 status code when a spot is not found", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: { execute: vi.fn() },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: {
          execute: vi
            .fn()
            .mockResolvedValue(err({ kind: "not_found", message: faker.lorem.sentence() })),
        },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const result = await client.spots[":spotId"]["$patch"]({
        json: {
          name: "Updated name",
        },
        param: { spotId: base62Encode(createSpotId()) },
      });

      // Then
      expect(result.status).toBe(404);
      expect(await result.json()).toMatchObject({ code: "NOT_FOUND_ERROR" });
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
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId: base62Encode(createSpotId()) },
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
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId: "not-a-uuid" },
      });

      // Then
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ code: "VALIDATION_ERROR" });
    });

    it("should return 404 status code when a spot is not found", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: {
          execute: vi
            .fn()
            .mockResolvedValue(err({ kind: "not_found", message: faker.lorem.sentence() })),
        },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId: base62Encode(createSpotId()) },
      });

      // Then
      expect(response.status).toBe(404);
      expect(await response.json()).toMatchObject({ code: "NOT_FOUND_ERROR" });
    });

    it("should return 409 status code when a spot is already archived", async () => {
      // Given
      const spotRoute = createSpotRoute({
        archiveSpotUsecase: {
          execute: vi
            .fn()
            .mockResolvedValue(err({ kind: "conflict", message: base62Encode(createSpotId()) })),
        },
        createSpotUsecase: { execute: vi.fn() },
        getSpotUsecase: { execute: vi.fn() },
        listSpotsUsecase: { execute: vi.fn() },
        updateSpotUsecase: { execute: vi.fn() },
      });
      const client = testClient(new Hono().route("/spots", spotRoute));

      // When
      const response = await client.spots[":spotId"].archive.$post({
        param: { spotId: base62Encode(createSpotId()) },
      });

      // Then
      expect(response.status).toBe(409);
      expect(await response.json()).toMatchObject({ code: "CONFLICT_ERROR" });
    });
  });
});
