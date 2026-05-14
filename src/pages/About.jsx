import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <section className="wrap">
        <p>
          WsHosting is a one-person company that historically dealt with web
          hosting, email and game servers. These days it's mostly a home for
          personal projects, experiments, and the occasional tool released into
          the wild.
        </p>
        <p>&nbsp;</p>
      </section>

      <section className="wrap">
        <p>
          The original price list — preserved here as a museum piece. Nothing
          on it is currently for sale, but if you have a project in mind feel
          free to <Link to="/contact">get in touch</Link>.
        </p>

        <table summary="historical pricelist">
          <tbody>
            <tr>
              <th>Package</th>
              <th>Details</th>
              <th>Price</th>
            </tr>
            <tr>
              <td>Simplicity</td>
              <td>100 MB storage, 10 GB transfer</td>
              <td>$5 / mo</td>
            </tr>
            <tr>
              <td>Moderation</td>
              <td>500 MB storage, 50 GB transfer</td>
              <td>$10 / mo</td>
            </tr>
            <tr>
              <td>Complexity</td>
              <td>1000 MB storage, 100 GB transfer</td>
              <td>$15 / mo</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td>Setup fee</td>
              <td style={{ color: "red" }}>$0</td>
            </tr>
            <tr>
              <td>Domain name registration (com / net / org)</td>
              <td>$9 / year</td>
            </tr>
          </tbody>
        </table>

        <p className="legend">
          Archived from <code>wshosting.org</code>, c. 2011. Current rates by
          quote only.
        </p>
      </section>
    </>
  );
}
