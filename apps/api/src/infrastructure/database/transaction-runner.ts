import { createSpotRepository } from "../repositories/spot";
import { createPublicRouteRepository } from "../repositories/public-route";
import type { Database } from "./client";
import type { TransactionRunner } from "@/application/shared/transaction-runner";

export function createTransactionRunner(db: Database): TransactionRunner {
  return {
    run: (fn) =>
      db.transaction(async (tx) => {
        const repos = {
          spotRepository: createSpotRepository(tx),
          publicRouteRepository: createPublicRouteRepository(tx),
        };

        return fn(repos);
      }),
  };
}
