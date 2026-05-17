# Yukumichi

## Prerequisites

- [mise](https://mise.jdx.dev/) — pins Node, pnpm, and other CLI versions (see `mise.toml`)
- [Docker](https://docs.docker.com/get-docker/) — runs Postgres locally
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) — for AWS access and Terraform state
- Port `5432` free on the host

## First-time setup

```sh
mise install                                                  # install pinned tool versions
pnpm install                                                  # install workspace dependencies
cp apps/api/.env.example apps/api/.env                        # API env
cp apps/web/.env.example apps/web/.env                        # Web env
aws sso login --sso-session yukumichi                         # log into AWS
terraform -chdir=infrastructure/environments/production init  # init Terraform backend
```

## Run the API

```sh
docker compose up -d postgres                  # start Postgres in the background
pnpm --filter @yukumichi/api db:migrate        # apply schema migrations
pnpm --filter @yukumichi/api dev               # start the API on http://localhost:3010
```

Swagger UI: <http://localhost:3010/ui>

## Run the Web

The web app talks to the API with environment variables, so make sure the API is running first.

```sh
pnpm --filter @yukumichi/web dev               # start Next.js on http://localhost:3000
pnpm --filter @yukumichi/web storybook         # start Storybook on http://localhost:6006
```

## Deployment

- Web: Cloudflare Workers (via OpenNext)
- API: AWS Lambda (Docker image)
- Database: AWS RDS PostgreSQL
- CI deploys on merge to `main` branch

## Documentation

- [`wiki/guideline/`](./wiki/guideline/) — development guidelines
- [`wiki/user-manual/`](./wiki/user-manual/) — operational manuals for production
