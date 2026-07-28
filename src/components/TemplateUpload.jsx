import { useState } from "react";
import { api } from "../api/client";

export default function TemplateUpload({ template, onUploaded, onRemoved, disabled }) {
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleUseTemplate() {
    if (!link.trim()) {
      setError("Paste a Google Drive .docx or Google Docs URL");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const loaded = await api.fromDriveTemplate(link.trim());
      onUploaded(loaded);
    } catch (err) {
      setError(err.message || "Could not load template from Drive");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    if (!template?.id) return;
    if (!window.confirm(`Remove template “${template.original_filename}”?`)) return;

    setBusy(true);
    setError("");
    try {
      await api.deleteTemplate(template.id);
      onRemoved?.();
    } catch (err) {
      setError(err.message || "Could not remove template");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <h2>Letter template</h2>
      <p className="lede">
        Paste a Google Drive <strong>.docx</strong> or <strong>Google Docs</strong> link with
        placeholders like {"{{name}}"}, {"{{department}}"}, {"{{emp_no}}"}. Use one word only
        inside the braces (underscores OK) — not {"{{emp no}}"}.
      </p>

      <div className="field">
        <label htmlFor="template-drive-link">Google Drive / Docs URL or ID</label>
        <input
          id="template-drive-link"
          type="url"
          placeholder="https://drive.google.com/file/d/… or https://docs.google.com/document/d/…"
          value={link}
          disabled={disabled || busy}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <div className="file-row">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={disabled || busy || !link.trim()}
          onClick={handleUseTemplate}
        >
          {busy ? "Loading…" : template ? "Replace template" : "Use this template"}
        </button>
        {template ? (
          <>
            <span className="muted">
              {template.original_filename} (#{template.id})
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={disabled || busy}
              onClick={handleRemove}
            >
              Remove
            </button>
          </>
        ) : (
          <span className="muted">No template loaded yet</span>
        )}
      </div>

      {template?.placeholders?.length ? (
        <div className="pill-list" aria-label="Placeholders found">
          {template.placeholders.map((p) => (
            <span className="pill" key={p}>
              {`{{${p}}}`}
            </span>
          ))}
        </div>
      ) : null}

      {template?.rewrites?.length ? (
        <div className="alert alert-ok" style={{ marginTop: "0.75rem" }}>
          Auto-fixed placeholders so they work with the template engine:
          <ul>
            {template.rewrites.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          Match your sheet column to the new name (e.g. column &quot;Aadhar no.&quot; maps to{" "}
          {"{{aadhar_no}}"}).
        </div>
      ) : null}

      {error ? <div className="alert alert-danger">{error}</div> : null}
    </section>
  );
}
