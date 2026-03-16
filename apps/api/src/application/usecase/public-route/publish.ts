import type { TransactionRunner } from "@/application/shared/transaction-runner";
import type { PublicRouteId, PublicRouteDetail } from "@/domain/model/public-route/model";
import type { SpotId } from "@/domain/model/spot/model";
import type { UserId } from "@/domain/model/user/model";
import type { CreateSpotInput } from "@/domain/model/spot/repository";

type PublishPublicRouteInput = {
  routeId: PublicRouteId;
  userId: UserId;
  title: string;
  description: string | null;
  spots: Omit<CreateSpotInput, "userId">[];
};

type CreatePublishPublicRouteUsecaseInput = {
  transactionRunner: TransactionRunner;
};

export type PublishPublicRouteUsecase = {
  execute: (input: PublishPublicRouteInput) => Promise<PublicRouteDetail>;
};

export function createPublishPublicRouteUsecase({
  transactionRunner,
}: CreatePublishPublicRouteUsecaseInput): PublishPublicRouteUsecase {
  return {
    async execute(input) {
      return transactionRunner.run(async (repos) => {
        // 1. Create each spot (Spot aggregate)
        const spotIds: SpotId[] = [];
        for (const spotInput of input.spots) {
          const spot = await repos.spotRepository.create({
            ...spotInput,
            userId: input.userId,
          });
          spotIds.push(spot.id);
        }

        // 2. Create the public route (PublicRoute aggregate)
        await repos.publicRouteRepository.create({
          id: input.routeId,
          userId: input.userId,
          title: input.title,
          description: input.description,
        });

        // 3. Link spots to the route
        await repos.publicRouteRepository.addSpots(input.routeId, spotIds);

        // 4. Return the complete route detail
        const detail = await repos.publicRouteRepository.findDetail(input.routeId);
        if (!detail) throw new Error("Failed to create route");

        return detail;
      });
    },
  };
}
