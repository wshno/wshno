# WSH — wshosting.org

Personal site for **Winther-Sørensen Hosting**. A React SPA that pays homage to the original 2011 wshosting.org design (orange-bordered "wrap" cards, head-image banner, Arial, three-page structure) but built on a modern Vite + React stack.

## Stack

- [Vite](https://vitejs.dev/) — dev server + build
- [React 18](https://react.dev/)
- [React Router 6](https://reactrouter.com/) — browser-history routing

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
│   │   └── Contact.jsx   # contact form (mailto: fallback, no backend)
│   ├── App.jsx           # shell — title bar, nav, banner, footer
│   ├── main.jsx          # entry point — mounts <BrowserRouter>
│   └── styles.css        # all styling — preserves original palette
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
| `/contact`   | `Contact`              |
| `*`          | falls back to `About`  |

## Deploying

The build outputs static files to `dist/`. Any static host works (Vercel, Netlify, GitHub Pages, plain nginx). If you deploy under a subpath, set Vite's `base` option in `vite.config.js`.

Because we use `BrowserRouter`, the host needs to rewrite unknown paths to `/index.html` (single-page-app rewrite). On Netlify drop a `public/_redirects` file with `/* /index.html 200`; on Vercel it's automatic.

## Contact form

`Contact.jsx` currently `mailto:`s the form contents — works on any static host with zero backend. To wire it to a real form handler (Formspree, Resend, your own endpoint), swap the `onSubmit` body for a `fetch()` to your endpoint.

## Credits

- Original 2011 design — Volker Mentzner ([mentzner.de](http://www.mentzner.de))
- Original banner photo — marek bernat, via sxc.hu
- Logo + this rebuild — the WSH organisation

## License

Code: MIT (you/me). Banner photo retains its original royalty-free license.
