# Sanpo

## Local Development

### Prerequisites

- [mise](https://mise.jdx.dev/) — pins Node, pnpm, and other CLI versions (see `mise.toml`)
- [Docker](https://docs.docker.com/get-docker/) — runs Postgres locally
- Port `5432` free on the host

### First-time setup

```sh
mise install                                   # install pinned tool versions
pnpm install                                   # install workspace dependencies
cp apps/api/.env.example apps/api/.env         # API env (DATABASE_URL)
```

### Run the API

```sh
docker compose up -d postgres                  # start Postgres in the background
pnpm --filter @sanpo/api db:migrate            # apply schema migrations
pnpm --filter @sanpo/api dev                   # start the API on http://localhost:3010
```
