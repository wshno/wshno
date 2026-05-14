import { useMemo, useState } from "react";

const PROJECTS = [
  {
    title: "WSH VSCode Extension",
    year: "2026 — current",
    tags: ["vscode", "typescript", "tooling"],
    description:
      "An editor extension under active development. Surfacing utilities for hosting-related workflows directly inside the editor.",
    href: null,
  },
  {
    title: "wshosting.org (legacy)",
    year: "2007 – 2013",
    tags: ["php", "shared hosting", "domains"],
    description:
      "The original shared-hosting business — domains, email, web and game servers. Wound down years ago; this site is a tribute to its look.",
    href: null,
  },
  {
    title: "Game servers",
    year: "various",
    tags: ["irc", "gameserver"],
    description:
      "A long history of running IRC bouncers, dedicated game servers and sundry network experiments for friends and small communities.",
    href: null,
  },
];

export default function Projects() {
  const allTags = useMemo(() => {
    const s = new Set();
    PROJECTS.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s)];
  }, []);
  const [active, setActive] = useState("all");
  const filtered =
    active === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.includes(active));

  return (
    <section className="wrap">
      <p>
        A running list of what I'm working on — past, present, and the
        occasional side-quest. Filter by topic:
      </p>

      <div className="tags">
        {allTags.map((t) => (
          <button
            key={t}
            type="button"
            className={"tag" + (t === active ? " active" : "")}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.map((p, i) => (
        <article className="project" key={i}>
          <h2>{p.title}</h2>
          <p className="meta">{p.year}</p>
          <p>{p.description}</p>
          <div className="tags" style={{ margin: "4px 0 0 0" }}>
            {p.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          {p.href && (
            <a
              className="outlink"
              href={p.href}
              target="_blank"
              rel="noreferrer"
            >
              Visit →
            </a>
          )}
        </article>
      ))}

      {filtered.length === 0 && (
        <p className="legend">No projects match this filter.</p>
      )}
    </section>
  );
}
