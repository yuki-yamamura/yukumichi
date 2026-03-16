import type { PublicRouteRepository } from "@/domain/model/public-route/repository";
import type { SpotRepository } from "@/domain/model/spot/repository";

export type Repositories = {
  spotRepository: SpotRepository;
  publicRouteRepository: PublicRouteRepository;
};

export type TransactionRunner = {
  run: <T>(fn: (repos: Repositories) => Promise<T>) => Promise<T>;
};
