import LegalPageLayout from "../components/LegalPageLayout";
import LegalSection from "../components/LegalSection";

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" effectiveDate="July 2026">
      <p className="legal-intro">
        These Terms of Service govern your access to and use of HR Automation Portal
        (&quot;the Portal&quot;). By signing in or using the Portal, you agree to these Terms.
      </p>

      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using HR Automation Portal, you confirm that you have read,
          understood, and agree to be bound by these Terms of Service and our Privacy Policy.
          If you do not agree, do not use the Portal.
        </p>
      </LegalSection>

      <LegalSection title="2. User Responsibilities">
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the security of your Google account</li>
          <li>Ensuring you have authority to process employee or organizational data you upload</li>
          <li>Using the Portal only for lawful HR and business documentation purposes</li>
          <li>Reviewing generated letters before distributing them</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Google Account Usage">
        <p>
          The Portal uses Google OAuth to authenticate you and to access Google Sheets and
          Google Drive resources that you explicitly select. You must comply with Google&apos;s
          terms and policies. You may revoke the Portal&apos;s access at any time through your
          Google Account permissions.
        </p>
      </LegalSection>

      <LegalSection title="4. Uploaded Documents">
        <p>
          You retain ownership of Word templates, sheet data, and other materials you provide.
          By uploading or selecting content, you grant the Portal permission to process that
          content solely to generate letters and write results back as you request. You
          represent that you have the rights needed to process such content.
        </p>
      </LegalSection>

      <LegalSection title="5. Intellectual Property">
        <p>
          The Portal&apos;s software, branding, and interface design are owned by their respective
          owners. These Terms do not transfer ownership of your content to us, nor do they
          grant you rights to copy or redistribute the Portal itself except as needed to use
          the service.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Misuse Google APIs or attempt to access files you have not selected</li>
          <li>Upload malicious files or attempt to disrupt the service</li>
          <li>Use the Portal to generate deceptive, unlawful, or harmful documents</li>
          <li>Attempt to reverse engineer or abuse authentication mechanisms</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Disclaimer">
        <p>
          The Portal is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not warrant
          that document generation will be uninterrupted, error-free, or fit for every legal
          or compliance purpose. You remain responsible for verifying the accuracy and
          suitability of all generated letters before use.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, HR Automation Portal and its operators shall
          not be liable for any indirect, incidental, special, consequential, or punitive
          damages, or for any loss of data, profits, or business arising from your use of the
          Portal or from reliance on generated documents.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          We may suspend or terminate access to the Portal if you violate these Terms or if
          continued operation poses a security or legal risk. You may stop using the Portal at
          any time and revoke Google OAuth access from your Google Account settings.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>For questions about these Terms of Service, contact:</p>
        <p>
          <a href="mailto:solankidaksh97@gmail.com">solankidaksh97@gmail.com</a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
