export default function GenerateButton({
  disabled,
  busy,
  skipIfExists,
  onSkipChange,
  onGenerate,
  disabledReason,
  driveFolderName,
  headers = [],
  nameField1,
  nameField2,
  nameSuffix,
  onNameField1Change,
  onNameField2Change,
  onNameSuffixChange,
}) {
  const previewLabel =
    nameField1 && nameField2 && nameSuffix.trim()
      ? `{${nameField1}}_{${nameField2}}_${nameSuffix.trim()}.pdf`
      : null;

  return (
    <section className="section">
      <h2>Generate letters</h2>
      <p className="lede">
        Creates a PDF per row, uploads to your chosen Drive folder
        {driveFolderName ? (
          <>
            {" "}
            (<strong>{driveFolderName}</strong>)
          </>
        ) : null}
        , and writes the link into a <strong>PDF Link</strong> column. Up to{" "}
        <strong>1000 letters</strong> per generate. Safe to re-run: existing links are
        skipped by default.
      </p>

      <div className="field">
        <label htmlFor="name-field-1">PDF name — field 1 (from sheet)</label>
        <select
          id="name-field-1"
          value={nameField1}
          disabled={busy || !headers.length}
          onChange={(e) => onNameField1Change(e.target.value)}
        >
          <option value="">Select a column…</option>
          {headers.map((h) => (
            <option key={`f1-${h}`} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="name-field-2">PDF name — field 2 (from sheet)</label>
        <select
          id="name-field-2"
          value={nameField2}
          disabled={busy || !headers.length}
          onChange={(e) => onNameField2Change(e.target.value)}
        >
          <option value="">Select a column…</option>
          {headers.map((h) => (
            <option key={`f2-${h}`} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="name-suffix">PDF name — letter title</label>
        <input
          id="name-suffix"
          type="text"
          placeholder="Renewal Letter"
          value={nameSuffix}
          disabled={busy}
          onChange={(e) => onNameSuffixChange(e.target.value)}
        />
      </div>

      {previewLabel ? (
        <p className="muted" style={{ marginTop: "-0.25rem", marginBottom: "0.9rem" }}>
          Files will be saved as <strong>{previewLabel}</strong>
        </p>
      ) : (
        <p className="muted" style={{ marginTop: "-0.25rem", marginBottom: "0.9rem" }}>
          Example: <strong>E001_Daksh_Solanki_Renewal Letter.pdf</strong> when field 1 is Code,
          field 2 is Name, and title is “Renewal Letter”.
        </p>
      )}

      <label className="muted" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={skipIfExists}
          disabled={busy}
          onChange={(e) => onSkipChange(e.target.checked)}
        />
        Skip rows that already have a PDF link
      </label>

      <div style={{ marginTop: "1rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled || busy}
          onClick={onGenerate}
        >
          {busy ? "Working…" : "Generate Letters"}
        </button>
      </div>

      {disabled && disabledReason ? (
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          {disabledReason}
        </p>
      ) : null}
    </section>
  );
}
