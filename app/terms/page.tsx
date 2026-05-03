import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export const metadata = {
  title: "Terms of Service — ENDEX",
  description:
    "Terms governing your use of ENDEX. ENDEX is a documentation tool — not a VA product, not legal advice, not medical advice.",
}

export default function TermsPage() {
  return (
    <AuthShell
      eyebrow="Terms"
      title="Terms of Service"
      wide
      footer={
        <>
          <Link href="/privacy" className="auth-link">Privacy Policy</Link>
          <br />
          <Link href="/" className="auth-link-subtle">Back to home</Link>
        </>
      }
    >
      <p className="auth-doc-meta">Last updated: May 2026</p>

      <div className="auth-doc-callout">
        <strong>Read this first</strong>
        ENDEX is a <strong>documentation and organization tool</strong> — not a
        VA decision engine, not a law firm, and not a medical provider.
        ENDEX is <strong>not affiliated with or endorsed by the U.S.
        Department of Veterans Affairs.</strong> Ratings shown in the app are
        <em> estimates</em> based on general VA criteria and are not official
        determinations. Before you file anything, talk to a VSO, a
        VA-accredited claims agent, or a disability attorney.
      </div>

      <div className="auth-doc">
        <h2>1. Agreement to these terms</h2>
        <p>
          By creating an account or using ENDEX (the &ldquo;Service&rdquo;), you
          agree to these Terms of Service (&ldquo;Terms&rdquo;) and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you don&rsquo;t agree,
          don&rsquo;t use the Service. ENDEX is operated by CG Web Lab, LLC
          (&ldquo;ENDEX,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
        </p>

        <h2>2. What ENDEX is — and isn&rsquo;t</h2>
        <p>
          ENDEX helps you organize your injury records and prepare materials for
          the VA disability-claims process.
        </p>
        <p>
          <strong>ENDEX does not:</strong>
        </p>
        <ul>
          <li>File claims with the VA on your behalf.</li>
          <li>Make official decisions, ratings, or determinations.</li>
          <li>Guarantee any rating, outcome, or benefit award.</li>
          <li>
            Create, complete, alter, review, or submit Disability Benefits
            Questionnaires (DBQs). DBQs must be completed only by qualified
            medical professionals using accurate medical information.
          </li>
          <li>
            Diagnose conditions or provide medical advice. Rely on qualified
            medical professionals for diagnosis, treatment, and medical
            documentation.
          </li>
          <li>
            Provide legal advice. For legal questions about your claim, consult
            a VSO, VA-accredited claims agent, or disability attorney.
          </li>
        </ul>
        <p>
          The ratings and percentages displayed in the app are <strong>estimates</strong>{" "}
          generated from general VA rating criteria as published in 38 C.F.R.
          Part 4 and similar materials. Actual VA decisions depend on
          adjudicator review of your specific medical evidence and
          circumstances. Estimates may differ from VA outcomes.
        </p>

        <h2>3. Not affiliated with the VA</h2>
        <p>
          ENDEX is not a U.S. government website, is not affiliated with the
          Department of Veterans Affairs, and is not endorsed by any government
          agency. References to VA forms, criteria, or processes are for
          educational and organizational purposes only.
        </p>

        <h2>4. Your account</h2>
        <p>
          To use ENDEX you create an account using email/password, Sign in with
          Google, or Sign in with Apple. You are responsible for keeping your
          credentials confidential and for everything that happens under your
          account. You must be at least 18 years old.
        </p>

        <h2>5. Subscription, billing, and access keys</h2>
        <ul>
          <li>
            <strong>Subscription channel:</strong> ENDEX is offered as a recurring
            subscription processed by Stripe. The price displayed at signup
            applies for the current billing period; subsequent renewals are at
            the then-current price.
          </li>
          <li>
            <strong>Cancel anytime:</strong> you can cancel from your account
            page at any time. Cancellation stops future renewals; access
            continues through the end of the current paid period. We don&rsquo;t
            issue prorated refunds for partial periods, except where required by
            law.
          </li>
          <li>
            <strong>Access keys:</strong> if you signed up via Channel 02
            (access key), the key grants the access tier and duration printed
            on the key. Keys are non-transferable once redeemed.
          </li>
          <li>
            <strong>Failed payments:</strong> if a charge fails, your access may
            be suspended until payment is current.
          </li>
          <li>
            <strong>Taxes:</strong> stated prices do not include applicable
            taxes; you are responsible for any sales/VAT/GST.
          </li>
        </ul>

        <h2>6. Your data and your records</h2>
        <p>
          Your injury records, ratings, timelines, secondary conditions, special
          claims, and personal statements are stored locally in your browser.
          You retain all rights in the content you create.
        </p>
        <p>
          Because that content lives on your device:
        </p>
        <ul>
          <li>You are responsible for backing it up. Use the in-app export tools to save copies you control.</li>
          <li>Clearing your browser data, switching devices, or browser updates can delete your records. We can&rsquo;t recover them.</li>
          <li>
            We grant you a limited, non-exclusive, non-transferable license to
            use the Service for your own personal claim-preparation purposes.
          </li>
        </ul>
        <p>
          For more on what data we do hold server-side, see the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>7. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service to commit fraud, file false claims, or violate any law.</li>
          <li>Reverse-engineer, scrape, or attempt to extract source code or other users&rsquo; data.</li>
          <li>Interfere with the Service&rsquo;s security, performance, or integrity (e.g., automated abuse, DDoS, exploiting vulnerabilities).</li>
          <li>Resell, sublicense, or redistribute access to the Service or access keys.</li>
          <li>Use the Service to provide claims-preparation services to third parties for compensation, except as expressly permitted by us in writing.</li>
        </ul>

        <h2>8. Intellectual property</h2>
        <p>
          ENDEX, the ENDEX wordmark, the application code, design system, and
          any educational content we publish are owned by CG Web Lab, LLC and
          are protected by copyright, trademark, and other laws. These Terms
          don&rsquo;t transfer any ownership.
        </p>

        <h2>9. Third-party services</h2>
        <p>
          Sign-in providers (Google, Apple), payment processing (Stripe), and
          hosting/auth infrastructure (Supabase) are governed by their own
          terms. ENDEX is not responsible for the conduct, terms, or content of
          third-party services.
        </p>

        <h2>10. Termination</h2>
        <p>
          You can stop using the Service at any time and delete your account by
          contacting us. We may suspend or terminate access if you violate
          these Terms, abuse the Service, or fail to pay. On termination, your
          right to access the Service ends; your locally stored records remain
          on your device until you delete them.
        </p>

        <h2>11. Disclaimers</h2>
        <p>
          <strong>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo;</strong>
          To the fullest extent permitted by law, ENDEX disclaims all warranties,
          express or implied, including warranties of merchantability, fitness
          for a particular purpose, non-infringement, accuracy, and
          uninterrupted operation. We do not warrant that ratings, calculations,
          or organizational outputs will match VA decisions, and you assume the
          risk of relying on them.
        </p>

        <h2>12. No liability</h2>
        <p>
          <strong>To the fullest extent permitted by applicable law, ENDEX
          and its owners, officers, employees, contractors, agents, and
          licensors have no liability to you for any claim arising out of or
          related to the Service or these Terms.</strong> This includes,
          without limitation, any direct, indirect, incidental, consequential,
          special, exemplary, or punitive damages, and any loss of profits,
          revenues, data, records, business, opportunity, claim outcome,
          benefit award, or goodwill, whether based in contract, tort
          (including negligence), strict liability, statute, or any other
          legal theory, and whether or not we have been advised of the
          possibility of such damages.
        </p>
        <p>
          You acknowledge that ENDEX is a documentation and organization
          tool, that any ratings or estimates it produces are not VA
          determinations, and that you are solely responsible for the
          decisions you make with respect to your VA claim. You assume the
          full risk of relying on the Service.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion or limitation of
          certain damages, so portions of the above may not apply to you. In
          those jurisdictions, our liability is limited to the minimum amount
          permitted by applicable law.
        </p>

        <h2>13. Indemnification</h2>
        <p>
          You agree to indemnify and hold ENDEX harmless from any claim,
          damage, or expense (including reasonable attorneys&rsquo; fees) arising
          from your use of the Service or violation of these Terms.
        </p>

        <h2>14. Changes to these terms</h2>
        <p>
          We may update these Terms as the Service evolves. Material changes
          will be announced in the app or via email to active subscribers. Your
          continued use of the Service after a change takes effect constitutes
          acceptance of the updated Terms.
        </p>

        <h2>15. Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href="mailto:veterans@endexclaims.com">veterans@endexclaims.com</a>.
        </p>
      </div>
    </AuthShell>
  )
}
