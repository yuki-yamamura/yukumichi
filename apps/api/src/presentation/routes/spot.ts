import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

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
      zValidator(
        "json",
        z.object({
          name: z.string().min(1),
          latitude: z.number(),
          longitude: z.number(),
        }),
      ),
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
    .get("/spots", async (context) => {
      const result = await listSpotsUsecase.execute();

      return context.json({ spots: result._unsafeUnwrap() });
    })
    .get(
      "/spots/:spotId",
      zValidator("param", z.object({ spotId: z.uuidv7() })),
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
      zValidator("param", z.object({ spotId: z.uuidv7() })),
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
