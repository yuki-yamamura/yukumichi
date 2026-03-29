import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";

import { errorResponseSchema, toApiError, toHttpStatus } from "@/presentation/schemas/error";
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
          400: {
            description: "Validation error",
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
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatus(apiError.code));
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
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatus(apiError.code));
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
          409: {
            description: "Already archived",
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
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
      zValidator("param", archiveSpotRequestParamsSchema),
      async (context) => {
        const { spotId } = context.req.valid("param");
        const result = await archiveSpotUsecase.execute({ spotId });

        return result.match(
          () => context.body(null, 204),
          (error) => {
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatus(apiError.code));
          },
        );
      },
    );
}
