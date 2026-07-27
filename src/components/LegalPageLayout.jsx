import { Link } from "react-router-dom";

export default function LegalPageLayout({ title, effectiveDate, children }) {
  return (
    <div className="app-shell legal-page">
      <header className="topbar">
        <Link to="/" className="brand-mark brand-link">
          HR Letter Portal
        </Link>
        <Link to="/" className="btn btn-ghost">
          Back to Home
        </Link>
      </header>

      <article className="legal-doc">
        <header className="legal-doc-header">
          <h1>{title}</h1>
          <p className="legal-meta">Effective Date: {effectiveDate}</p>
          <p className="legal-meta">Last updated: {effectiveDate}</p>
        </header>

        <div className="legal-doc-body">{children}</div>

        <footer className="legal-doc-footer">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </footer>
      </article>
    </div>
  );
}
