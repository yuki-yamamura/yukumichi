import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";

import { errorResponseSchema } from "@/presentation/schemas/error";
import {
  archiveSpotRequestParamsSchema,
  createSpotRequestBodySchema,
  getSpotRequestParamsSchema,
  getSpotResponseSchema,
  listSpotsResponseSchema,
} from "@/presentation/schemas/spot";

import type { ArchiveSpotUsecase } from "@/application/usecase/spot/archive";
import type { CreateSpotUsecase } from "@/application/usecase/spot/create";
import type { GetSpotUsecase } from "@/application/usecase/spot/get";
import type { ListSpotsUsecase } from "@/application/usecase/spot/list";

type SpotRouteDeps = {
  archiveSpotUsecase: ArchiveSpotUsecase;
  createSpotUsecase: CreateSpotUsecase;
  getSpotUsecase: GetSpotUsecase;
  listSpotsUsecase: ListSpotsUsecase;
};

export function createSpotRoute({
  createSpotUsecase,
  listSpotsUsecase,
  getSpotUsecase,
  archiveSpotUsecase,
}: SpotRouteDeps) {
  return new Hono()
    .post(
      "/spots",
      describeRoute({
        tags: ["spots"],
        description: "Create a new spot",
        responses: {
          201: { description: "Spot created successfully" },
          500: {
            description: "Domain validation error",
            content: {
              "application/json": {
                schema: resolver(errorResponseSchema),
              },
            },
          },
        },
      }),
      zValidator("json", createSpotRequestBodySchema),
      async (context) => {
        const json = context.req.valid("json");
        const result = await createSpotUsecase.execute(json);

        return result.match(
          () => context.body(null, 201),
          (error) => {
            switch (error.kind) {
              case "validation": {
                return context.json({ error: "failed to parse spot" }, 500);
              }
            }
          },
        );
      },
    )
    .get(
      "/spots",
      describeRoute({
        tags: ["spots"],
        description: "List all spots",
        responses: {
          200: {
            description: "Returns a list of spots",
            content: {
              "application/json": {
                schema: resolver(listSpotsResponseSchema),
              },
            },
          },
        },
      }),
      async (context) => {
        const result = await listSpotsUsecase.execute();

        return context.json({ spots: result._unsafeUnwrap() });
      },
    )
    .get(
      "/spots/:spotId",
      describeRoute({
        tags: ["spots"],
        description: "Get a spot by ID",
        responses: {
          200: {
            description: "Returns the spot",
            content: {
              "application/json": {
                schema: resolver(getSpotResponseSchema),
              },
            },
          },
          404: {
            description: "Spot not found",
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
          },
        },
      }),
      zValidator("param", getSpotRequestParamsSchema),
      async (context) => {
        const { spotId } = context.req.valid("param");
        const result = await getSpotUsecase.execute({ spotId });

        return result.match(
          (spot) => context.json({ spot }),
          (error) => {
            switch (error.kind) {
              case "not_found": {
                return context.json({ error: `spot is not found by ${spotId}` }, 404);
              }
            }
          },
        );
      },
    )
    .post(
      "/spots/:spotId/archive",
      describeRoute({
        tags: ["spots"],
        description: "Archive a spot",
        responses: {
          204: { description: "Spot archived successfully" },
          404: {
            description: "Spot not found",
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
          },
        },
      }),
      zValidator("param", archiveSpotRequestParamsSchema),
      async (context) => {
        const { spotId } = context.req.valid("param");
        const result = await archiveSpotUsecase.execute({ spotId });

        return result.match(
          () => context.body(null, 204),
          (error) => {
            switch (error.kind) {
              case "not_found": {
                return context.json({ error: `spot is not found by ${spotId}` }, 404);
              }
            }
          },
        );
      },
    );
}
