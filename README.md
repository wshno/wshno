# WSH — wshosting.org

Personal site for **Winther-Sørensen Hosting**. A React SPA that pays homage to the original 2011 wshosting.org design (orange-bordered "wrap" cards, head-image banner, Arial, three-page structure) but built on a modern Vite + React stack.

## Stack

- [Vite](https://vitejs.dev/) — dev server + build
- [React 19](https://react.dev/)
- [React Router 7](https://reactrouter.com/) (`react-router-dom`) — browser-history routing

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # preview the production build
```

## Project layout

```
.
├── public/
│   ├── head.jpg          # original banner photo (highway at dusk)
│   └── wsh-icon.svg      # WSH rack-stack favicon / logo
├── src/
│   ├── assets/
│   │   └── wsh-icon.svg  # imported version (so Vite hashes it in build)
│   ├── pages/
│   │   ├── About.jsx     # landing — about copy + legacy price table
│   │   ├── Projects.jsx  # tag-filtered list of projects
│   │   ├── Status.jsx    # live Valheim server status (polls /api/valheim/status.json)
│   │   └── Contact.jsx   # contact form (mailto: fallback, no backend)
│   ├── App.jsx           # shell — title bar, nav, banner, footer
│   ├── main.jsx          # entry point — mounts <BrowserRouter>
│   └── styles.css        # all styling — preserves original palette
├── server/
│   └── server.go         # stdlib-only static file server (container runtime)
├── Dockerfile            # multi-stage build → distroless runtime image
└── index.html            # Vite HTML entry
```

## Design tokens

The CSS preserves the original palette as custom properties at the top of `src/styles.css`:

| Token              | Value     | Use                                 |
|--------------------|-----------|-------------------------------------|
| `--orange`         | `#ffa600` | Borders, dividers                   |
| `--orange-soft`    | `#ffd380` | Active nav, table headers, buttons  |
| `--bg`             | `#f2f2f2` | Page background                     |
| `--ink`            | `#000`    | Body text                           |
| `--ink-dim`        | `#555`    | Meta / legend text                  |

## Routes

| Path         | Component              |
|--------------|------------------------|
| `/`          | `About`                |
| `/projects`  | `Projects`             |
| `/status`    | `Status`               |
| `/contact`   | `Contact`              |
| `*`          | falls back to `About`  |

## Deploying

The build outputs static files to `dist/`, so any static host works (Vercel, Netlify, GitHub Pages, etc.). Because we use `BrowserRouter`, a dumb static host needs to rewrite unknown paths to `/index.html` (single-page-app rewrite) — on Netlify drop a `public/_redirects` file with `/* /index.html 200`; on Vercel it's automatic. If you deploy under a subpath, set Vite's `base` option in `vite.config.js`.

The canonical deploy is a **container**: a multi-stage `Dockerfile` builds the site and serves it from `server/server.go` (a tiny stdlib-only Go file server — SPA fallback, immutable `/assets/` caching) on a **distroless, non-root** base, listening on port `8080`. CI (`.github/workflows/container.yml`) builds, Grype-scans, and publishes it to `ghcr.io/.../web` on tagged releases. Run it locally with:

```bash
docker build -t wsh-site .
docker run --rm -p 8080:8080 wsh-site   # http://localhost:8080
```

### PR preview environments

Label a pull request **`deploy-feature`** and CI deploys an ephemeral preview to the homelab cluster via GitOps (rendered into `hwinther/proxmox`, reconciled by Flux) at `https://wshno-<PR>.preview.wsh.no`. A sticky PR comment posts the URL; closing the PR tears the env down. The live `/status` data is production-only, so it shows "could not load" in previews.

## Contact form

`Contact.jsx` currently `mailto:`s the form contents — works on any static host with zero backend. To wire it to a real form handler (Formspree, Resend, your own endpoint), swap the `onSubmit` body for a `fetch()` to your endpoint.

## Credits

- Original 2011 design — Volker Mentzner ([mentzner.de](http://www.mentzner.de))
- Original banner photo — marek bernat, via sxc.hu
- Logo + this rebuild — the WSH organisation

## License

Code: MIT (you/me). Banner photo retains its original royalty-free license.
