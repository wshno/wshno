import { useEffect, useState } from "react";

// Same-origin: Traefik routes /api/<game>/* to the in-cluster <game>-status snapshot service,
// which serves a curated JSON built from Prometheus. Grafana/Prometheus stay private.
// Add a game by appending one entry here — the backend (<game>-status service + /api route)
// lives in the cluster (proxmox), not this repo.
const SERVERS = [
  { name: "Valheim", endpoint: "/api/valheim/status.json" },
  { name: "Enshrouded", endpoint: "/api/enshrouded/status.json" },
  { name: "Satisfactory", endpoint: "/api/satisfactory/status.json" },
  { name: "Space Engineers", endpoint: "/api/spaceengineers/status.json" },
];
const POLL_MS = 30000;
const STALE_AFTER = 180; // seconds without a fresh snapshot before we distrust "up"

function Sparkline({ points, height = 60, stroke = "#ffa600" }) {
  if (!points || points.length < 2) return null;
  const width = 660;
  const ts = points.map((p) => p[0]);
  const vs = points.map((p) => p[1]);
  const minT = Math.min(...ts);
  const maxT = Math.max(...ts);
  const maxV = Math.max(1, ...vs);
  const x = (t) => ((t - minT) / (maxT - minT || 1)) * width;
  const y = (v) => height - (v / maxV) * (height - 4) - 2;
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label="Players online over the last 24 hours"
    >
      <path d={area} fill={stroke} opacity="0.15" />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function ago(sec) {
  const d = Math.max(0, Math.floor(Date.now() / 1000) - sec);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

const LABELS = {
  up: "Online",
  down: "Offline",
  stale: "Stale",
  loading: "…",
  unknown: "Unknown",
};

function ServerStatus({ name, endpoint }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(endpoint, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (alive) {
          setData(j);
          setErr(null);
        }
      } catch (e) {
        if (alive) setErr(e.message);
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [endpoint]);

  const stale = data && Date.now() / 1000 - data.updated > STALE_AFTER;
  const state = err && !data
    ? "unknown"
    : !data
      ? "loading"
      : stale
        ? "stale"
        : data.up === 1
          ? "up"
          : "down";

  // Satisfactory exposes a progression stat the others don't; show it only when present.
  const techTier = data?.techTier ?? data?.tech_tier ?? null;

  return (
    <article className="project">
      <div className="status-head">
        <h2>{data?.server || name}</h2>
        <span className={"status-pill status-" + state}>{LABELS[state]}</span>
      </div>

      <p className="meta">
        {data ? (
          <>
            Players: <strong>{data.players ?? "—"}</strong>
            {data.maxPlayers ? ` / ${data.maxPlayers}` : ""}
            {techTier != null ? (
              <>
                {" "}· tech tier <strong>{techTier}</strong>
              </>
            ) : null}{" "}
            · updated {ago(data.updated)}
          </>
        ) : err ? (
          "Could not load status right now."
        ) : (
          "Loading…"
        )}
      </p>

      {data?.history?.players?.length > 1 && (
        <>
          <Sparkline points={data.history.players} />
          <p className="legend">Players online — last 24 hours</p>
        </>
      )}
    </article>
  );
}

export default function Status() {
  return (
    <section className="wrap">
      <p>
        Live status of our public game servers. Snapshots from the cluster's
        metrics, refreshed about once a minute — no login required.
      </p>

      {SERVERS.map((s) => (
        <ServerStatus key={s.endpoint} name={s.name} endpoint={s.endpoint} />
      ))}
    </section>
  );
}
