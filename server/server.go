// Minimal static file server for the wsh-site SPA. Stdlib only — no third-party
// modules — so the distroless runtime image carries essentially nothing for a
// vulnerability scanner (Grype) to flag. Replaces the previous nginx:alpine runtime.
//
// Behaviour mirrors the old nginx.conf:
//   - hashed build assets under /assets/* are cached immutably for a year
//   - index.html (and every SPA fallback) is served no-cache so deploys take effect
//   - unknown paths fall back to index.html so React Router's BrowserRouter resolves
//     client-side routes (/projects, /status, /contact, ...)
//   - every response carries the security headers below
//
// Response compression is intentionally left to the ingress (Traefik) that fronts
// the container, matching how the site is actually served.
package main

import (
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

// The site loads nothing from other origins: Vite emits external scripts and stylesheets only, React's
// style props go through the CSSOM (which style-src does not govern), and /api/* is same-origin, routed
// by the ingress. The e2e suite fails on any violation, so a change that needs a new source (an asset
// small enough for Vite to inline as a data: URI, say) shows up in the PR.
const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; " +
	"font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; " +
	"frame-ancestors 'none'"

var securityHeaders = map[string]string{
	"Content-Security-Policy": contentSecurityPolicy,
	// Not includeSubDomains: that would force HTTPS on every *.wsh.no name, and not all of them have it.
	"Strict-Transport-Security": "max-age=31536000",
	"X-Content-Type-Options":    "nosniff",
	// frame-ancestors above supersedes this; kept for browsers that predate it.
	"X-Frame-Options":            "DENY",
	"Referrer-Policy":            "strict-origin-when-cross-origin",
	"Permissions-Policy":         "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
	"Cross-Origin-Opener-Policy": "same-origin",
}

func main() {
	root := envOr("WEB_ROOT", "/public")
	addr := envOr("WEB_ADDR", ":8080")
	index := filepath.Join(root, "index.html")

	files := http.FileServer(http.Dir(root))

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Normalise to a clean, rooted URL path; path.Clean collapses any "..",
		// so a joined filesystem path can't escape root.
		upath := path.Clean("/" + strings.TrimPrefix(r.URL.Path, "/"))

		for name, value := range securityHeaders {
			w.Header().Set(name, value)
		}

		if strings.HasPrefix(upath, "/assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "no-cache")
		}

		// Serve the real file when it exists; otherwise hand back index.html so the
		// SPA can route on the client.
		if fileExists(filepath.Join(root, filepath.FromSlash(upath))) {
			files.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Cache-Control", "no-cache")
		http.ServeFile(w, r, index)
	})

	srv := &http.Server{
		Addr:              addr,
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
	}
	log.Printf("wsh-site: serving %s on %s", root, addr)
	log.Fatal(srv.ListenAndServe())
}

func fileExists(p string) bool {
	info, err := os.Stat(p)
	return err == nil && !info.IsDir()
}

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
