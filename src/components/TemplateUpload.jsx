import { useState } from "react";
import { api } from "../api/client";

export default function TemplateUpload({ template, onUploaded, onRemoved, disabled }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    try {
      const uploaded = await api.uploadTemplate(file);
      onUploaded(uploaded);
    } catch (err) {
      setError(err.message || "Upload failed");
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
        Upload a .docx with placeholders like {"{{name}}"}, {"{{department}}"},{" "}
        {"{{emp_no}}"}. Use one word only inside the braces (underscores OK) — not{" "}
        {"{{emp no}}"}.
      </p>

      <div className="file-row">
        <label className="btn btn-ghost">
          {busy ? "Working…" : template ? "Replace DOCX" : "Choose DOCX"}
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            disabled={disabled || busy}
            onChange={handleChange}
          />
        </label>
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
          <span className="muted">No template uploaded yet</span>
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
