# Base stage for shared dependencies
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/eslint-config/package.json packages/eslint-config/
RUN pnpm install

# Build stage
FROM base AS builder
COPY . .
RUN pnpm --filter @sanpo/api build

# Production stage for AWS Lambda
FROM public.ecr.aws/lambda/nodejs:24 AS production
COPY --from=builder /app/apps/api/dist/index.js ${LAMBDA_TASK_ROOT}/
CMD ["index.handler"]
