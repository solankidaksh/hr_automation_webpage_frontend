export default function GenerateButton({
  disabled,
  busy,
  skipIfExists,
  onSkipChange,
  onGenerate,
  disabledReason,
  driveFolderName,
}) {
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
