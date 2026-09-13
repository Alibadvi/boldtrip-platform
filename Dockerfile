FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://boldtrip-platform.onrender.com
RUN DATABASE_URL=postgresql://build:build@localhost/build PAYLOAD_SECRET=build-only-not-a-production-secret-123456 NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} pnpm build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN corepack enable
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
CMD ["/bin/sh", "-c", "if [ \"$DEPLOYMENT_MODE\" = \"preview\" ]; then ./node_modules/.bin/payload migrate; fi && exec ./node_modules/.bin/next start"]
