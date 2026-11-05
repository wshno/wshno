# --- static file server (stdlib-only Go binary; see server/server.go) ---
FROM golang:1.27-alpine AS server
WORKDIR /src
COPY server/go.mod ./
COPY server/server.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /server .

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

# --- runtime: distroless, nonroot, no shell or package manager ---
# Pinned to the digest (distroless has no version tags) so Dependabot (docker, weekly) opens a PR
# when Google rebuilds the image with Debian security fixes.
FROM gcr.io/distroless/static-debian13:nonroot@sha256:25ac8f0c3b2334a9eb05452266bd4697864a8c8ef0ef71e5e6480d7f92868329 AS runtime
COPY --from=server /server /server
COPY --from=build /app/dist /public
EXPOSE 8080
ENTRYPOINT ["/server"]
