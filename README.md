# Yukumichi

## Prerequisites

- [mise](https://mise.jdx.dev/) — pins Node, pnpm, and other CLI versions (see `mise.toml`)
- [Docker](https://docs.docker.com/get-docker/) — runs Postgres locally
- Port `5432` free on the host

## First-time setup

```sh
mise install                                   # install pinned tool versions
pnpm install                                   # install workspace dependencies
cp apps/api/.env.example apps/api/.env         # API env
cp apps/web/.env.example apps/web/.env         # Web env
```

## Run the API

```sh
docker compose up -d postgres                  # start Postgres in the background
pnpm --filter @yukumichi/api db:migrate            # apply schema migrations
pnpm --filter @yukumichi/api dev                   # start the API on http://localhost:3010
```

Swagger UI: <http://localhost:3010/ui>

## Run the Web

```sh
pnpm --filter @yukumichi/web dev                   # start Next.js on http://localhost:3000
pnpm --filter @yukumichi/web storybook             # start Storybook on http://localhost:6006
```

The web app talks to the API at `NEXT_PUBLIC_API_BASE_URL`, so make sure the API is running first.
