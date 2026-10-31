import { Link } from 'react-router-dom'

// Privacy Policy for the Skylens Android app. Deep-linked from the Google Play
// listing (App content → Privacy policy). Content mirrors the app's actual data
// flows — see the data-flow audit. Kept out of the top nav; titled via App.jsx.
export default function SkylensPrivacy() {
  return (
    <>
      <section className="wrap">
        <h2>Skylens — Privacy Policy</h2>
        <p className="legend">Last updated: 15 July 2026</p>
        <p>
          Skylens is an augmented-reality plane- and ship-spotter for Android, developed and operated by WsHosting
          (Winther-Sørensen Hosting, Org. # 988 264 636), Norway (&quot;we&quot;, &quot;us&quot;). This policy explains
          what data the Skylens app and its backend service process, why, and the choices you have. It applies to the
          Skylens Android app and the backend service at <code>skylens.wsh.no</code>.
        </p>
      </section>

      <section className="wrap">
        <h2>The short version</h2>
        <ul>
          <li>
            The camera is only ever shown live on screen so we can draw labels over the real sky. Skylens{' '}
            <strong>never</strong> takes photos, records video, or uploads any camera imagery.
          </li>
          <li>
            <strong>No advertising, no analytics, no tracking or profiling</strong> of any kind. There are no
            third-party ad or analytics SDKs in the app.
          </li>
          <li>
            We keep <strong>no user-account database</strong>. Sign-in is handled by our identity provider, and our
            servers do not store a profile about you.
          </li>
          <li>
            The main personal data we handle is your <strong>device location</strong>, which is needed to work out which
            aircraft and vessels are around you.
          </li>
        </ul>
      </section>

      <section className="wrap">
        <h2>Information we process, and why</h2>

        <h2>Location</h2>
        <p>
          <strong>What:</strong> your device&apos;s location — latitude, longitude and, where available, altitude — at
          precise (fine) accuracy.
        </p>
        <p>
          <strong>Why:</strong> Skylens needs to know where you are to select the aircraft, vessels and airports within
          your chosen radius and to project their labels onto the correct point of the sky.
        </p>
        <p>
          <strong>How it is used:</strong> when you connect to the live feed, your coordinates and chosen radius are
          sent to our backend so the feed can be filtered to your surroundings. When you are outside the area covered by
          our primary feed, your coordinates are forwarded to ADS-B Exchange (see the table below) to fetch aircraft for
          your location. Your coordinates are held only in memory for the duration of your session — they are not
          written to any database.
        </p>
        <p>
          <strong>Stays on your device:</strong> the high-frequency location and motion used to keep labels steady as
          you move the phone is processed on your device only and is never transmitted.
        </p>
        <p>
          <strong>Demo mode:</strong> if you use Skylens in demo mode, no real location is read or sent.
        </p>

        <h2>Camera</h2>
        <p>
          Skylens shows the live camera preview so it can draw aircraft and vessel labels over the real sky. The camera
          image is rendered on your device only. Skylens does not capture, save, or transmit any photos or video, and no
          image ever leaves your phone.
        </p>

        <h2>Device sensors</h2>
        <p>
          Skylens reads the compass, accelerometer and gyroscope to know which way your phone is pointing, so labels
          line up with the sky. These readings are used on your device only and are never sent anywhere.
        </p>

        <h2>Account and sign-in</h2>
        <p>
          To use the live feed you sign in through our identity provider (Authelia) at <code>auth.wsh.no</code> using
          OpenID Connect. When you sign in, the provider issues your app secure tokens. Those tokens can contain your
          email address, username and group membership, and are stored securely on your device using Android&apos;s
          hardware-backed secure storage. They are sent to our backend to authorise your requests.
        </p>
        <p>
          Our backend <strong>does not keep a user database</strong> — it checks your token to authorise each request
          but does not store an account profile for you. Your account itself is held by the identity provider.
        </p>

        <h2>App settings</h2>
        <p>
          Your preferences — layer toggles, radius, calibration trim, and the demo-mode and onboarding flags — are
          stored only on your device. They contain no personal information and never leave the phone.
        </p>

        <h2>Diagnostic logs</h2>
        <p>
          To keep the service running and to diagnose problems, our backend records short-lived operational logs. These
          can include the coordinates you subscribed with and your account identifier, so a fault can be traced to a
          session. They are retained for up to 14 days and then automatically deleted. You can ask us to delete them
          sooner — see <Link to="/skylens/delete-data">Deleting your data</Link>.
        </p>
      </section>

      <section className="wrap">
        <h2>How your information is shared</h2>
        <p>
          We do not sell your data and never share it for advertising. To provide the service, limited data is sent to
          the following providers:
        </p>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>What is sent</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Authelia (auth.wsh.no)</td>
              <td>Your sign-in and the tokens it issues</td>
              <td>Identity provider / sign-in (operated by us)</td>
            </tr>
            <tr>
              <td>ADS-B Exchange (via RapidAPI)</td>
              <td>Your coordinates and radius, when you are outside our primary feed</td>
              <td>Fetch nearby aircraft for your location</td>
            </tr>
            <tr>
              <td>OpenSky Network</td>
              <td>Aircraft identifier (ICAO hex) only</td>
              <td>Aircraft type / registration lookup</td>
            </tr>
            <tr>
              <td>FlightAware AeroAPI</td>
              <td>Flight callsign, only when you tap &quot;Route&quot;</td>
              <td>Flight origin / destination</td>
            </tr>
            <tr>
              <td>BarentsWatch (AIS &amp; ship register)</td>
              <td>Vessel identifier (MMSI) only</td>
              <td>Vessel and ship-register details</td>
            </tr>
            <tr>
              <td>CelesTrak / SatNOGS</td>
              <td>Nothing specific to you</td>
              <td>Satellite orbits and transmitter data</td>
            </tr>
            <tr>
              <td>Google Maps (Android map screen)</td>
              <td>Your map viewport / interactions</td>
              <td>Render the map tiles</td>
            </tr>
          </tbody>
        </table>
        <p className="legend">
          None of the aircraft-, vessel- or satellite-lookup providers receive your identity. Some providers operate
          outside Norway/the EEA (for example, in the United States); data sent to them is limited to what is listed
          above.
        </p>
      </section>

      <section className="wrap">
        <h2>How long we keep data</h2>
        <ul>
          <li>
            <strong>Location:</strong> only in memory during your session; in diagnostic logs for up to 14 days, then
            automatically deleted.
          </li>
          <li>
            <strong>Sign-in tokens and app settings:</strong> on your device until you sign out or uninstall the app.
          </li>
          <li>
            <strong>Account profile:</strong> we hold none — your account lives with the identity provider.
          </li>
        </ul>
      </section>

      <section className="wrap">
        <h2>Legal basis and your rights</h2>
        <p>
          We process your location on the basis of your <strong>consent</strong>, which you give through the Android
          location permission and by choosing the live feed; you can withdraw it at any time by revoking the permission
          or using demo mode. We process your account data to provide the service you request, and we keep short-lived
          diagnostic logs on the basis of our legitimate interest in running a secure, reliable service.
        </p>
        <p>
          If you are in the EEA, you have the right to access, correct, delete, restrict or object to the processing of
          your personal data, and to data portability. To exercise these rights or delete your data, see{' '}
          <Link to="/skylens/delete-data">Deleting your data</Link>. You also have the right to lodge a complaint with
          the Norwegian Data Protection Authority (Datatilsynet).
        </p>
      </section>

      <section className="wrap">
        <h2>Security</h2>
        <p>
          Traffic between the app and our backend is encrypted in transit (HTTPS/WSS). Your sign-in tokens are held in
          Android&apos;s secure, hardware-backed storage and removed when you sign out.
        </p>
      </section>

      <section className="wrap">
        <h2>Children</h2>
        <p>Skylens is not directed to children under 13, and we do not knowingly collect personal data from them.</p>
      </section>

      <section className="wrap">
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will change the &quot;Last updated&quot; date above and, for
          significant changes, note it in the app.
        </p>
      </section>

      <section className="wrap">
        <h2>Contact</h2>
        <p>
          Questions about privacy, or a request about your data? Email{' '}
          <a href="mailto:skylens@wshosting.org?subject=Skylens%20privacy">skylens@wshosting.org</a>. See also{' '}
          <Link to="/skylens/delete-data">Deleting your data</Link>.
        </p>
        <p className="legend">Data controller: WsHosting (Winther-Sørensen Hosting) · Org. # 988 264 636 · Norway</p>
      </section>
    </>
  )
}
