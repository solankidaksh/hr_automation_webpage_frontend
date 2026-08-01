import { useRef, useState } from "react";
import { api } from "../api/client";

export default function TemplateUpload({ template, onUploaded, onRemoved, disabled }) {
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "Could not load template from Drive");
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Only .docx Word templates are supported");
      e.target.value = "";
      return;
    }

    setBusy(true);
    setError("");
    try {
      const loaded = await api.uploadTemplate(file);
      onUploaded(loaded);
      setLink("");
    } catch (err) {
      setError(err.message || "Could not upload template");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      setLink("");
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        Add a Word template with placeholders like {"{{name}}"}, {"{{department}}"},{" "}
        {"{{emp_no}}"}. Use a Drive/Docs link or upload a <strong>.docx</strong> file. Use one
        word only inside the braces (underscores OK) — not {"{{emp no}}"}.
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
          {busy ? "Loading…" : template ? "Replace from link" : "Use this template"}
        </button>
      </div>

      <div className="field" style={{ marginTop: "1rem" }}>
        <label htmlFor="template-file">Or upload a .docx file</label>
        <input
          id="template-file"
          ref={fileInputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          disabled={disabled || busy}
          onChange={handleFileChange}
        />
      </div>

      <div className="file-row">
        {template ? (
          <>
            <span className="muted">
              Loaded: {template.original_filename} (#{template.id})
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
