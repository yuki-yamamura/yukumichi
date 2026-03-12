# Base stage for shared dependencies
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install

# Development stage
FROM base AS development
COPY . .
EXPOSE 3010
ENTRYPOINT ["pnpm", "--filter", "@sanpo/api", "dev"]

# Build stage
FROM base AS builder
COPY . .
RUN pnpm --filter @sanpo/api build

# Production stage
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS production
WORKDIR /app
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=builder /app/apps/api/dist/index.js .
ENV PORT=3010
EXPOSE 3010
CMD ["index.js"]
