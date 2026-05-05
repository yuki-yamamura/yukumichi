import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";

import { zValidator } from "@/presentation/middlewares/zod-validator";
import { errorResponseSchema, toApiError, toHttpStatus } from "@/presentation/schemas/error";
import {
  createSpotRequestBodySchema,
  getSpotResponseSchema,
  listSpotsResponseSchema,
  spotParamSchema,
  updateSpotRequestBodySchema,
} from "@/presentation/schemas/spot";

import type { ArchiveSpotUsecase } from "@/application/usecase/spot/archive";
import type { CreateSpotUsecase } from "@/application/usecase/spot/create";
import type { GetSpotUsecase } from "@/application/usecase/spot/get";
import type { ListSpotsUsecase } from "@/application/usecase/spot/list";
import type { UpdateSpotUsecase } from "@/application/usecase/spot/update";

type SpotRouteDeps = {
  archiveSpotUsecase: ArchiveSpotUsecase;
  createSpotUsecase: CreateSpotUsecase;
  getSpotUsecase: GetSpotUsecase;
  listSpotsUsecase: ListSpotsUsecase;
  updateSpotUsecase: UpdateSpotUsecase;
};

export function createSpotRoute({
  archiveSpotUsecase,
  createSpotUsecase,
  getSpotUsecase,
  listSpotsUsecase,
  updateSpotUsecase,
}: SpotRouteDeps) {
  return new Hono()
    .post(
      "/",
      describeRoute({
        description: "Create a new spot",
        responses: {
          201: {
            description: "Spot created successfully",
          },
          400: {
            content: {
              "application/json": {
                schema: resolver(errorResponseSchema),
              },
            },
            description: "Validation error",
          },
        },
        tags: ["spots"],
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
      "/",
      describeRoute({
        description: "List all spots",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: resolver(listSpotsResponseSchema),
              },
            },
            description: "Returns a list of spots",
          },
        },
        tags: ["spots"],
      }),
      async (context) => {
        const result = await listSpotsUsecase.execute();

        return result.match(
          (spots) => context.json(listSpotsResponseSchema.parse({ spots })),
          (error) => {
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatus(apiError.code));
          },
        );
      },
    )
    .get(
      "/:spotId",
      describeRoute({
        description: "Get a spot by ID",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: resolver(getSpotResponseSchema),
              },
            },
            description: "Returns the spot",
          },
          404: {
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
            description: "Spot not found",
          },
        },
        tags: ["spots"],
      }),
      zValidator("param", spotParamSchema),
      async (context) => {
        const { spotId } = context.req.valid("param");
        const result = await getSpotUsecase.execute({ spotId });

        return result.match(
          (spot) => context.json(getSpotResponseSchema.parse({ spot })),
          (error) => {
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatus(apiError.code));
          },
        );
      },
    )
    .patch(
      "/:spotId",
      describeRoute({
        description: "Update a spot",
        responses: {
          204: {
            description: "Spot updated successfully",
          },
          400: {
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
            description: "Validation error",
          },
          404: {
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
            description: "Spot not found",
          },
        },
        tags: ["spots"],
      }),
      zValidator("param", spotParamSchema),
      zValidator("json", updateSpotRequestBodySchema),
      async (context) => {
        const { spotId } = context.req.valid("param");
        const json = context.req.valid("json");

        const result = await updateSpotUsecase.execute({ id: spotId, ...json });

        return result.match(
          () => context.body(null, 204),
          (error) => {
            const apiError = toApiError(error);

            return context.json(apiError, toHttpStatus(apiError.code));
          },
        );
      },
    )
    .post(
      "/:spotId/archive",
      describeRoute({
        description: "Archive a spot",
        responses: {
          204: { description: "Spot archived successfully" },
          404: {
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
            description: "Spot not found",
          },
          409: {
            content: {
              "application/json": { schema: resolver(errorResponseSchema) },
            },
            description: "Already archived",
          },
        },
        tags: ["spots"],
      }),
      zValidator("param", spotParamSchema),
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
