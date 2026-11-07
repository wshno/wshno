# --- frontend deps ---
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- frontend build ---
FROM node:26-alpine AS build
ARG APP_VERSION=unknown
ARG GIT_SHA=unknown
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV VITE_APP_VERSION=${APP_VERSION}
ENV VITE_GIT_SHA=${GIT_SHA}
RUN npm run build

# --- runtime: wshno/static-server (stdlib-only Go server on distroless, nonroot, no shell) ---
# static-server.json is the SPA fallback, the security headers and the /assets/ cache rule. Tag and
# digest pinned, so Dependabot (docker, weekly) opens a PR for each static-server release, which is
# also how distroless rebuilds with Debian security fixes arrive.
FROM ghcr.io/wshno/static-server/server:0.1.0@sha256:9036422e3de9c774cc26a0f7ecf05e04bef2fea162653ec248691ee8c90abb94 AS runtime
COPY static-server.json /etc/static-server/config.json
COPY --from=build /app/dist /public
