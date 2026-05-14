import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // No backend yet — drop a mailto so it works on a static host.
    // Swap this for a fetch() to your form-handler when you have one.
    const body = encodeURIComponent(
      `From: ${form.name} <${form.email}>\n\n${form.message}`
    );
    window.location.href = `mailto:hello@wshosting.org?subject=Website%20contact&body=${body}`;
    setSent(true);
  };

  return (
    <section className="wrap">
      <p>
        The quickest way to reach me is email:{" "}
        <a href="mailto:hello@wshosting.org">hello@wshosting.org</a>. Or use the
        form below.
      </p>

      <form onSubmit={onSubmit}>
        <p style={{ margin: "10px 10px 0 10px" }}>
          <label htmlFor="n">Name</label>
        </p>
        <input
          id="n"
          type="text"
          value={form.name}
          onChange={set("name")}
          required
        />

        <p style={{ margin: "8px 10px 0 10px" }}>
          <label htmlFor="e">Email</label>
        </p>
        <input
          id="e"
          type="email"
          value={form.email}
          onChange={set("email")}
          required
        />

        <p style={{ margin: "8px 10px 0 10px" }}>
          <label htmlFor="m">Message</label>
        </p>
        <textarea
          id="m"
          value={form.message}
          onChange={set("message")}
          required
        />

        <div>
          <button type="submit">Send</button>
        </div>

        {sent && (
          <p className="legend" style={{ color: "#7a5a00" }}>
            Your mail client should have opened. If not, drop a line directly
            to <a href="mailto:hello@wshosting.org">hello@wshosting.org</a>.
          </p>
        )}
      </form>

      <p className="legend">WsHosting — Org. # 988 264 636 · Norway</p>
    </section>
  );
}
