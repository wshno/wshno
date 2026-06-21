# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`wsh-site` — the personal site for Winther-Sørensen Hosting (wshosting.org). A small Vite + React single-page app that recreates the original 2011 design (orange-bordered "wrap" cards, head-image banner, three-page structure) on a modern stack.

## Commands

```bash
npm install
npm run dev      # vite dev server, http://localhost:5173 (auto-opens browser)
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

There is **no lint or test setup** — `package.json` defines only `dev`/`build`/`preview`, and CI runs with `node_test_enabled: false`. Don't reference a test runner that doesn't exist; if adding tests, also flip that flag in `.github/workflows/pr-build.yml`. Node 24 is the CI/build version.

## Architecture

- **Stack:** Vite 8 + React 19 + React Router 7 (`react-router-dom`), all `.jsx`, no TypeScript. (The README still says React 18 / Router 6 — it's stale; trust `package.json`.)
- **Entry flow:** `src/main.jsx` mounts `<BrowserRouter>` → `src/App.jsx` is the shell (title bar, nav, banner, footer) and declares the `<Routes>`. Pages live in `src/pages/`.
- **Routes:** `/` → About, `/projects` → Projects, `/status` → Status, `/contact` → Contact, `*` falls back to About.
- **Adding/removing a page requires two edits in `App.jsx` that must stay in sync:** the `PAGES` array (drives the nav menu *and* the per-route `document.title`) and the `<Routes>` block. They are separate declarations — updating one without the other silently breaks the nav or the route.
- **Styling:** all CSS is in `src/styles.css`. The 2011 palette is preserved as CSS custom properties at the top of that file (`--orange`, `--orange-soft`, `--bg`, `--ink`, `--ink-dim`); reuse these tokens rather than hardcoding colors.
- **Assets:** import from `src/assets/` (Vite hashes them) for anything that needs cache-busting; files in `public/` (e.g. `head.jpg`) are served verbatim.

## Backend-dependent behavior

This repo has **no backend**. Two pages reach outward at runtime:

- **`Status.jsx`** polls `GET /api/valheim/status.json` same-origin every 30s. In production, Traefik routes `/api/valheim/*` to an in-cluster `valheim-status` snapshot service (curated JSON derived from Prometheus). Locally that path 404s, and the page degrades to an "Unknown"/error state — expected. It also has staleness logic (`STALE_AFTER = 180s`) that demotes a stale "up" snapshot.
- **`Contact.jsx`** uses a `mailto:` fallback (no form backend). To wire a real handler, replace the `onSubmit` body with a `fetch()`.

## Deployment

- **Container:** multi-stage `Dockerfile` ends on **`gcr.io/distroless/static-debian13:nonroot`** and serves `dist/` on **port 8080** as nonroot. The runtime is **`server/server.go`** — a ~60-line, **stdlib-only** Go static file server (no third-party modules), built `CGO_ENABLED=0`. This replaced `nginx:alpine` specifically to kill base-image CVEs: distroless has no shell/package manager and the stdlib-only binary leaves Grype essentially nothing to flag. Don't add Go dependencies to `server/` without reason — the empty dependency graph is the feature. Response compression is delegated to the Traefik ingress, not done in-container.
- **SPA routing lives in `server.go`:** because we use `BrowserRouter`, unknown paths must fall back to `/index.html` so client-side routes resolve. `server.go` does this (the `nginx try_files` equivalent), plus immutable caching for `/assets/*` and `no-cache` for `index.html`. If you deploy under a subpath, set Vite's `base` in `vite.config.js`.
- **CI/CD via reusable workflows:** the workflows in `.github/workflows/` are thin triggers delegating to `hwinther/reusable-workflows` (pinned by commit SHA — currently `v1.65.0`, the same SHA in *every* workflow file; update them together). `pr-build.yml` typechecks/builds PRs; `container.yml` builds + Grype-scans + publishes the image to `ghcr.io/.../web`; `tag-and-release.yml` tags then dispatches `container.yml` (a tag pushed via `GITHUB_TOKEN` does not itself trigger tag-push workflows, hence the explicit dispatch).
- **Per-PR preview envs (GitOps):** add the **`deploy-feature`** label to a PR and `container.yml`'s `preview` job hands the just-built image's tag + digest to `gitops-preview-upsert.yml`, which renders a per-PR overlay into **`hwinther/proxmox`** (`clusters/production/apps/previews/wshno`); Flux serves it at `https://wshno-<PR>.preview.wsh.no`. `pr-preview-cleanup.yml` tears it down on PR close. **Prerequisites** (outside this repo): that `previews/wshno/` tree with a `template/` dir (`overlay.namespace.yaml.tpl`, `overlay.kustomization.yaml.tpl`) + parent `kustomization.yaml` must exist in `hwinther/proxmox`, and repo secrets `PROXMOX_GITOPS_APP_ID` / `PROXMOX_GITOPS_APP_PRIVATE_KEY` (the proxmox-gitops-bot app) must be set. The live `/status` data is production-only, so it reads "could not load" in previews.
- The Dockerfile sets `VITE_APP_VERSION` / `VITE_GIT_SHA` build args, but no source currently reads them — they're plumbing for a future version display.
