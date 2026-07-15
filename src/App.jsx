import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import Status from "./pages/Status.jsx";
import SkylensPrivacy from "./pages/SkylensPrivacy.jsx";
import SkylensDeleteData from "./pages/SkylensDeleteData.jsx";
import wshIcon from "./assets/wsh-icon.svg";

const PAGES = [
  { path: "/", label: "About Us", title: "WsHosting.Org / About" },
  { path: "/projects", label: "Projects", title: "WsHosting.Org / Projects" },
  { path: "/status", label: "Status", title: "WsHosting.Org / Status" },
  { path: "/contact", label: "Contact", title: "WsHosting.Org / Contact" },
];

// Pages with their own route + title but intentionally NOT in the top nav —
// app-specific legal pages deep-linked from the Skylens Google Play listing.
const UNLISTED_PAGES = [
  { path: "/skylens/privacy", title: "WsHosting.Org / Skylens Privacy Policy" },
  { path: "/skylens/delete-data", title: "WsHosting.Org / Skylens Data Deletion" },
];

export default function App() {
  const loc = useLocation();
  const current =
    PAGES.find((p) => p.path === loc.pathname) ||
    UNLISTED_PAGES.find((p) => p.path === loc.pathname) ||
    PAGES[0];

  useEffect(() => {
    document.title = current.title;
  }, [current.title]);

  return (
    <>
      <div id="pagetitle" className="wrap">
        <div className="title-row">
          <img src={wshIcon} alt="WSH logo" />
          <h1>{current.title}</h1>
        </div>
      </div>

      <nav id="navmenu" className="wrap">
        <ul>
          {PAGES.map((p) => (
            <li key={p.path}>
              <NavLink
                to={p.path}
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {p.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div id="header" className="wrap" role="img" aria-label="Highway at dusk" />

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/status" element={<Status />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/skylens/privacy" element={<SkylensPrivacy />} />
        <Route path="/skylens/delete-data" element={<SkylensDeleteData />} />
        <Route path="*" element={<About />} />
      </Routes>

      <footer id="footer" className="wrap">
        <p>
          WsHosting © 2007 – {new Date().getFullYear()} · Org. # 988 264 636 ·{" "}
          <span style={{ opacity: 0.7 }}>Winther-Sørensen Hosting</span>
        </p>
      </footer>
    </>
  );
}
