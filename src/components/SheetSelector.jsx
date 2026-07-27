import { useState } from "react";
import { api } from "../api/client";

export default function SheetSelector({
  sheet,
  onSheetChange,
  preview,
  validation,
  onPreview,
  onValidated,
  templateId,
  disabled,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handlePreview() {
    if (!sheet.trim()) {
      setError("Paste a Google Sheet URL or ID");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = await api.previewSheet(sheet.trim());
      onPreview(data);

      if (templateId) {
        const result = await api.validate({
          template_id: templateId,
          sheet: sheet.trim(),
        });
        onValidated(result);
      } else {
        onValidated(null);
      }
    } catch (err) {
      setError(err.message || "Could not read sheet");
      onPreview(null);
      onValidated(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <h2>Employee sheet</h2>
      <p className="lede">
        Paste the Google Sheet that holds employee rows. Column names should match your
        template placeholders.
      </p>

      <div className="field">
        <label htmlFor="sheet">Google Sheet URL or ID</label>
        <input
          id="sheet"
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/…"
          value={sheet}
          disabled={disabled}
          onChange={(e) => onSheetChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        disabled={disabled || busy || !sheet.trim()}
        onClick={handlePreview}
      >
        {busy ? "Checking…" : "Preview & validate"}
      </button>

      {preview ? (
        <p className="muted" style={{ marginTop: "0.9rem" }}>
          <strong>{preview.title || "Untitled"}</strong> · {preview.row_count} data rows ·{" "}
          {preview.headers?.length || 0} columns
        </p>
      ) : null}

      {preview?.headers?.length ? (
        <div className="pill-list">
          {preview.headers.map((h) => (
            <span className="pill" key={h}>
              {h}
            </span>
          ))}
        </div>
      ) : null}

      {validation ? (
        <div className={`alert ${validation.ok ? "alert-ok" : "alert-warn"}`}>
          {validation.ok
            ? "Template placeholders match the sheet columns."
            : "Some placeholders are missing matching columns."}
          {validation.warnings?.length ? (
            <ul>
              {validation.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {error ? <div className="alert alert-danger">{error}</div> : null}
    </section>
  );
}
