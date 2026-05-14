import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import wshIcon from "./assets/wsh-icon.svg";

const PAGES = [
  { path: "/", label: "About Us", title: "WsHosting.Org / About" },
  { path: "/projects", label: "Projects", title: "WsHosting.Org / Projects" },
  { path: "/contact", label: "Contact", title: "WsHosting.Org / Contact" },
];

export default function App() {
  const loc = useLocation();
  const current =
    PAGES.find((p) => p.path === loc.pathname) || PAGES[0];

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
        <Route path="/contact" element={<Contact />} />
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
