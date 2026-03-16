import type {
  RouteSearchParams,
  RouteSearchResult,
  RouteSearchQueryService,
} from "@/application/query-service/route-search";

type CreateSearchPublicRoutesUsecaseInput = {
  routeSearchQueryService: RouteSearchQueryService;
};

export type SearchPublicRoutesUsecase = {
  execute: (params: RouteSearchParams) => Promise<RouteSearchResult[]>;
};

export function createSearchPublicRoutesUsecase({
  routeSearchQueryService,
}: CreateSearchPublicRoutesUsecaseInput): SearchPublicRoutesUsecase {
  return {
    execute: (params) => routeSearchQueryService.execute(params),
  };
}
