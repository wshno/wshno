import { Link } from "react-router-dom";

// Account / data deletion page for the Skylens Android app. Required by Google
// Play's account-deletion policy and linked from the Play listing's Data safety
// form. Reachable on the web without the app. Kept out of the top nav; titled
// via App.jsx. See also SkylensPrivacy.jsx.
export default function SkylensDeleteData() {
  return (
    <>
      <section className="wrap">
        <h2>Skylens — Deleting your data</h2>
        <p className="legend">Last updated: 15 July 2026</p>
        <p>
          This page explains what data Skylens holds and how to delete it,
          including your account. It is part of our{" "}
          <Link to="/skylens/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section className="wrap">
        <h2>What data exists</h2>
        <ul>
          <li>
            <strong>Your account</strong> (email, username, group membership) —
            held by our identity provider (Authelia at <code>auth.wsh.no</code>),
            not in a Skylens database.
          </li>
          <li>
            <strong>Sign-in tokens and app settings</strong> — stored only on your
            device.
          </li>
          <li>
            <strong>Short-lived diagnostic logs</strong> — may contain the
            coordinates you subscribed with and your account identifier; deleted
            automatically after up to 14 days.
          </li>
        </ul>
        <p>
          Skylens keeps no server-side profile, no photos, and no history of where
          you have been beyond those short-lived logs.
        </p>
      </section>

      <section className="wrap">
        <h2>1 — Delete data on your device (immediate)</h2>
        <ul>
          <li>
            <strong>Sign out</strong> in the app&apos;s Settings — this removes your
            stored sign-in tokens from the device.
          </li>
          <li>
            <strong>Uninstall Skylens</strong> — this removes all app data (tokens
            and settings) from your phone.
          </li>
        </ul>
      </section>

      <section className="wrap">
        <h2>2 — Delete your account</h2>
        <p>
          Because your account is held by our identity provider, email us at{" "}
          <a href="mailto:skylens@wshosting.org?subject=Skylens%20account%20deletion">
            skylens@wshosting.org
          </a>{" "}
          from the address on your account (or include your username) and ask us to
          delete your Skylens account. We will delete the account and confirm within
          30 days.
        </p>
      </section>

      <section className="wrap">
        <h2>3 — Delete diagnostic logs sooner</h2>
        <p>
          Diagnostic logs expire automatically within 14 days. If you would like us
          to purge them sooner, email{" "}
          <a href="mailto:skylens@wshosting.org?subject=Skylens%20log%20deletion">
            skylens@wshosting.org
          </a>{" "}
          and we will remove logs associated with your account.
        </p>
      </section>

      <section className="wrap">
        <h2>What we keep</h2>
        <p>
          We do not retain a user profile, so once your account is deleted and the
          app is uninstalled, no personal data about you remains — other than
          diagnostic logs, which expire automatically within 14 days (or sooner on
          request). We may keep minimal records where required by law.
        </p>
      </section>

      <section className="wrap">
        <h2>How to reach us</h2>
        <p>
          Email{" "}
          <a href="mailto:skylens@wshosting.org?subject=Skylens%20data%20deletion">
            skylens@wshosting.org
          </a>{" "}
          with the subject &quot;Skylens data deletion&quot;. We respond to deletion
          requests within 30 days.
        </p>
        <p className="legend">
          Data controller: WsHosting (Winther-Sørensen Hosting) · Org. # 988 264 636
          · Norway
        </p>
      </section>
    </>
  );
}
