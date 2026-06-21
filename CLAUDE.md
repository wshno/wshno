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

- **Container:** multi-stage `Dockerfile` (node:24-alpine build → `nginxinc/nginx-unprivileged:alpine` runtime) serving the static `dist/` on **port 8080**.
- **SPA routing depends on nginx:** because we use `BrowserRouter`, any non-SPA host needs unknown paths rewritten to `/index.html`. `nginx.conf` handles this (`try_files $uri $uri/ /index.html`) plus immutable caching for `/assets/`. If you deploy under a subpath, set Vite's `base` in `vite.config.js`.
- **CI/CD via reusable workflows:** the workflows in `.github/workflows/` are thin triggers that delegate to `hwinther/reusable-workflows` (pinned by commit SHA). `pr-build.yml` typechecks/builds PRs; `container.yml` builds + Grype-scans + publishes the image to `ghcr.io/.../web`; `tag-and-release.yml` tags then dispatches `container.yml` (a tag pushed via `GITHUB_TOKEN` does not itself trigger tag-push workflows, hence the explicit dispatch). When bumping the reusable-workflow version, update the pinned SHA in all three files.
- The Dockerfile sets `VITE_APP_VERSION` / `VITE_GIT_SHA` build args, but no source currently reads them — they're plumbing for a future version display.
