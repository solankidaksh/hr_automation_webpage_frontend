import LegalPageLayout from "../components/LegalPageLayout";
import LegalSection from "../components/LegalSection";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" effectiveDate="July 2026">
      <p className="legal-intro">
        This Privacy Policy explains how HR Automation Portal collects, uses, stores, and
        protects user information.
      </p>

      <LegalSection title="1. Information We Collect">
        <p>We may collect the following information when you use the Portal:</p>
        <ul>
          <li>Google account information (name, email, profile picture)</li>
          <li>Files explicitly selected by the user</li>
          <li>Google Sheets selected by the user</li>
          <li>Word templates uploaded by the user</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Information">
        <p>We use the information described above to:</p>
        <ul>
          <li>Authenticate users</li>
          <li>Generate HR letters</li>
          <li>Upload generated documents to Google Drive</li>
          <li>Read employee data from Google Sheets</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Google API Services">
        <p>
          This application only accesses Google Drive files and Google Sheets that the user
          explicitly selects.
        </p>
        <p>The application does not access unrelated files.</p>
        <p>
          Our use of information received from Google APIs adheres to the Google API Services
          User Data Policy, including the Limited Use requirements.
        </p>
      </LegalSection>

      <LegalSection title="4. Data Storage">
        <ul>
          <li>Files are processed only for document generation.</li>
          <li>We do not sell or share user data.</li>
          <li>Authentication is handled using Google OAuth.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Security">
        <p>
          We take reasonable technical and organizational measures to protect account and
          document data during processing. Access to Google services is performed with
          user-authorized OAuth tokens. You should also protect your Google account credentials
          and revoke Portal access from your Google Account settings if you no longer wish to
          use the service.
        </p>
      </LegalSection>

      <LegalSection title="6. User Rights">
        <p>Depending on applicable law, you may have the right to:</p>
        <ul>
          <li>Request access to personal information we hold about you</li>
          <li>Request correction or deletion of your information</li>
          <li>Withdraw consent by signing out and revoking Google OAuth access</li>
        </ul>
        <p>
          To exercise these rights, contact us using the email address listed in the Contact
          section below.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies">
        <p>
          The Portal may use session cookies or similar browser storage needed to keep you
          signed in and to operate core features after Google OAuth authentication. These are
          used for authentication and application functionality, not for third-party
          advertising.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. The Effective Date and Last
          updated date at the top of this page will reflect the latest revision. Continued use
          of the Portal after changes are posted constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          If you have questions about this Privacy Policy or our data practices, contact:
        </p>
        <p>
          <a href="mailto:solankidaksh97@gmail.com">solankidaksh97@gmail.com</a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
