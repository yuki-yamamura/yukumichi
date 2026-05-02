import { err, ok } from "neverthrow";

import { Spot, SpotId } from "@/domain/spot/models/spot";

import type { DataIntegrityError, NotFoundError, ValidationError } from "@/domain/error";
import type { SpotRepository } from "@/domain/spot/repository";
import type { Result } from "neverthrow";

type UpdateSpotUsecaseDeps = {
  spotRepository: SpotRepository;
};

type UpdateSpotUsecaseInput = {
  id: string;
} & Partial<{
  description: string;
  latitude: number;
  longitude: number;
  name: string;
}>;

export type UpdateSpotUsecase = {
  execute: (
    input: UpdateSpotUsecaseInput,
  ) => Promise<Result<void, DataIntegrityError | NotFoundError | ValidationError>>;
};

export function UpdateSpotUsecase({ spotRepository }: UpdateSpotUsecaseDeps): UpdateSpotUsecase {
  return {
    execute: async ({ id, ...rest }) => {
      console.log("execute runs");
      const idResult = SpotId.safeParse(id);
      if (!idResult.success) {
        return err({ kind: "validation", message: idResult.error.message });
      }
      console.log("id parsed");
      const existingSpotResult = await spotRepository.findById(idResult.data);
      if (existingSpotResult.isErr()) {
        return err(existingSpotResult.error);
      }
      console.log("existing spot found");

      const spotResult = Spot({
        description: existingSpotResult.value.description,
        id: existingSpotResult.value.id,
        latitude: existingSpotResult.value.coordinate.latitude,
        longitude: existingSpotResult.value.coordinate.longitude,
        name: existingSpotResult.value.name,
        ...rest,
      });
      if (spotResult.isErr()) {
        return err(spotResult.error);
      }
      console.log("spot created");

      const updateResult = await spotRepository.update(spotResult.value);
      console.log("update success");

      return updateResult.andThen(() => ok());
    },
  };
}
