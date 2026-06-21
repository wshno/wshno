// Minimal static file server for the wsh-site SPA. Stdlib only — no third-party
// modules — so the distroless runtime image carries essentially nothing for a
// vulnerability scanner (Grype) to flag. Replaces the previous nginx:alpine runtime.
//
// Behaviour mirrors the old nginx.conf:
//   - hashed build assets under /assets/* are cached immutably for a year
//   - index.html (and every SPA fallback) is served no-cache so deploys take effect
//   - unknown paths fall back to index.html so React Router's BrowserRouter resolves
//     client-side routes (/projects, /status, /contact, ...)
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

func main() {
	root := envOr("WEB_ROOT", "/public")
	addr := envOr("WEB_ADDR", ":8080")
	index := filepath.Join(root, "index.html")

	files := http.FileServer(http.Dir(root))

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Normalise to a clean, rooted URL path; path.Clean collapses any "..",
		// so a joined filesystem path can't escape root.
		upath := path.Clean("/" + strings.TrimPrefix(r.URL.Path, "/"))

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
