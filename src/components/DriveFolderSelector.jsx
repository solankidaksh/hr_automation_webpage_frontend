import { useState } from "react";
import { api } from "../api/client";

export default function DriveFolderSelector({
  folder,
  onFolderChange,
  preview,
  onPreview,
  disabled,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck() {
    if (!folder.trim()) {
      setError("Paste a Google Drive folder URL or ID");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = await api.previewFolder(folder.trim());
      onPreview(data);
    } catch (err) {
      setError(err.message || "Could not open that Drive folder");
      onPreview(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <h2>Drive folder</h2>
      <p className="lede">
        Paste the Google Drive <strong>folder</strong> link where generated PDF letters
        should be uploaded.
      </p>

      <div className="field">
        <label htmlFor="drive-folder">Google Drive folder URL or ID</label>
        <input
          id="drive-folder"
          type="url"
          placeholder="https://drive.google.com/drive/folders/…"
          value={folder}
          disabled={disabled}
          onChange={(e) => {
            onFolderChange(e.target.value);
            onPreview(null);
          }}
        />
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        disabled={disabled || busy || !folder.trim()}
        onClick={handleCheck}
      >
        {busy ? "Checking…" : "Verify folder"}
      </button>

      {preview ? (
        <p className="muted" style={{ marginTop: "0.9rem" }}>
          Uploading to <strong>{preview.name}</strong>
          {" · "}
          <a href={preview.web_view_link} target="_blank" rel="noreferrer">
            Open folder
          </a>
        </p>
      ) : null}

      {error ? <div className="alert alert-danger">{error}</div> : null}
    </section>
  );
}
