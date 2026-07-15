import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export const metadata = {
  title: "Privacy Policy — ENDEX",
  description:
    "How ENDEX handles your data. Your injury records stay in your browser; we collect only what's needed to run your account.",
}

export default function PrivacyPage() {
  return (
    <AuthShell
      eyebrow="Privacy"
      title="Privacy Policy"
      wide
      footer={
        <>
          <Link href="/terms" className="auth-link">Terms of Service</Link>
          <br />
          <Link href="/" className="auth-link-subtle">Back to home</Link>
        </>
      }
    >
      <p className="auth-doc-meta">Last updated: May 2026</p>

      <div className="auth-doc-callout">
        <strong>Plain-English summary</strong>
        <p>
          Your injury records, ratings, and statements stay{" "}
          <strong>in your browser</strong>. We don&rsquo;t upload them to our
          servers. The only data we keep server-side is what we need to run
          your account (email + auth) and process your payment. You can export
          or delete your local data at any time using the in-app export tools.
        </p>
      </div>

      <div className="auth-doc">
        <h2>1. Who we are</h2>
        <p>
          ENDEX is operated by CG Web Lab, LLC (&ldquo;ENDEX,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
          ENDEX is a documentation and organization tool for veterans preparing
          their own VA disability claim materials. It is not a VA product, is
          not affiliated with or endorsed by the U.S. Department of Veterans
          Affairs, and does not file claims on your behalf.
        </p>

        <h2>2. What stays on your device</h2>
        <p>
          The substance of what you put into ENDEX — your injuries, ratings,
          timelines, secondary conditions, special claims, and personal
          statements — is stored locally in your browser&rsquo;s storage. We
          don&rsquo;t see it, our servers don&rsquo;t store it, and it isn&rsquo;t
          transmitted anywhere by the app.
        </p>
        <p>
          That has consequences you should be aware of:
        </p>
        <ul>
          <li>
            <strong>Clearing your browser data wipes your records.</strong>
            Use the in-app <em>Export</em> button regularly to save a file copy
            you control.
          </li>
          <li>
            <strong>Records don&rsquo;t sync across devices automatically.</strong>
            To move data, export from one device and import on the other.
          </li>
          <li>
            <strong>Anyone with access to your device&rsquo;s browser profile can
            read your data.</strong> Use a passcode/biometric on your device.
          </li>
        </ul>

        <h2>3. What we do collect server-side</h2>
        <p>
          To run your account and bill you, a small amount of data does live on
          our infrastructure (Supabase) and our payment processor (Stripe):
        </p>
        <ul>
          <li>
            <strong>Account identity:</strong> email address; if you sign in with
            Google or Apple, the basic profile fields they return (name, email,
            and a unique provider ID). We store no password — Supabase hashes
            and salts it on its end if you use email/password.
          </li>
          <li>
            <strong>Access state:</strong> whether you signed up via subscription
            or access key, and which plan or key you hold.
          </li>
          <li>
            <strong>Subscription metadata (Stripe):</strong> Stripe customer ID,
            subscription ID, plan, billing status, and renewal/cancellation
            dates. Card numbers are handled by Stripe and never touch our
            servers.
          </li>
          <li>
            <strong>Auth session cookies:</strong> a Supabase session cookie that
            keeps you signed in. You can clear it at any time by signing out.
          </li>
          <li>
            <strong>Operational logs:</strong> request logs (timestamp, route,
            status, anonymized request ID) for security and debugging. Logs are
            retained on a rolling basis and don&rsquo;t include the contents of
            your injury records.
          </li>
          <li>
            <strong>Visit analytics:</strong> when a page loads, we record the
            page path, referrer, your IP address, browser user agent,
            approximate location derived from the IP (country, region, city,
            and coordinates), and — if you are signed in — your account ID.
            This is used to understand which features get used and to detect
            abuse. No injury data and no content from your records is included.
          </li>
        </ul>

        <h2>4. How your data is used</h2>
        <ul>
          <li>To create and maintain your account, sign you in, and protect against unauthorized access.</li>
          <li>To process subscription payments and grant or revoke access based on billing status.</li>
          <li>To respond to support requests you initiate.</li>
          <li>To detect, investigate, and prevent abuse, fraud, and security incidents.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal data. We do not use your
          data to train AI models. We do not use your data for advertising.
        </p>

        <h2>5. Service providers we share data with</h2>
        <p>
          We use a short list of subprocessors to operate the service. They
          receive only the data they need to perform their function:
        </p>
        <ul>
          <li><strong>Supabase</strong> — hosted Postgres + auth (account identity, session, access state).</li>
          <li><strong>Stripe</strong> — payment processing (billing identity, subscription state, card data on Stripe&rsquo;s side).</li>
          <li><strong>Axiom</strong> — operational logging (request metadata, no record content).</li>
          <li><strong>ip-api.com</strong> — IP geolocation for visit analytics (receives the visitor IP address when edge headers don&rsquo;t already provide a location).</li>
          <li><strong>Google &amp; Apple</strong> — only if you use Sign in with Google or Apple, the OAuth handshake passes through them.</li>
          <li><strong>Hosting/CDN</strong> — the platform that serves the application (request routing, no record content).</li>
        </ul>

        <h2>6. Your rights</h2>
        <p>
          Because the bulk of your data lives on your own device, you have direct
          control over it: export, edit, or delete it at any time from inside the
          app. For the limited account data we hold server-side:
        </p>
        <ul>
          <li><strong>Access:</strong> request a copy of the account data we have.</li>
          <li><strong>Correction:</strong> update inaccurate account info from your settings or by contacting us.</li>
          <li><strong>Deletion:</strong> close your account and we will delete your account record. Some Stripe billing records must be retained for tax/audit reasons.</li>
          <li><strong>Withdraw consent:</strong> stop using the service and clear your local browser storage.</li>
        </ul>
        <p>
          To exercise any of these, email{" "}
          <a href="mailto:veterans@endexclaims.com">veterans@endexclaims.com</a>.
          Residents of California, the EU/UK, and other jurisdictions with
          stronger privacy rights have the additional rights afforded by their
          local laws and may exercise them via the same address.
        </p>

        <h2>7. Security</h2>
        <p>
          We use industry-standard transport encryption (HTTPS) for everything
          between your browser and our servers. Account passwords are hashed by
          our auth provider. Card data is handled by Stripe under PCI-DSS. No
          system is perfectly secure — if you suspect a breach, please contact
          us immediately.
        </p>

        <h2>8. International users</h2>
        <p>
          ENDEX is operated from the United States. By using the service, you
          consent to your account data being processed in the United States and
          in the regions of our subprocessors.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy as the service evolves. Material changes
          will be announced in the app and via email to active subscribers. The
          &ldquo;Last updated&rdquo; date at the top reflects the most recent revision.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:veterans@endexclaims.com">veterans@endexclaims.com</a>.
        </p>
      </div>
    </AuthShell>
  )
}
