import { useMemo, useState } from "react";

export default function ProgressReport({ job, error }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const rows = job?.results || [];
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [job?.results, filter]);

  const failedRows = useMemo(
    () => (job?.results || []).filter((r) => r.status === "failed"),
    [job?.results]
  );

  if (!job && !error) return null;

  const total = job?.total || 0;
  const processed = job?.processed || 0;
  const pct =
    total > 0
      ? Math.min(100, Math.round((processed / total) * 100))
      : job?.status === "completed"
        ? 100
        : 0;
  const running = job && (job.status === "queued" || job.status === "running");
  const done =
    job &&
    (job.status === "completed" || job.status === "failed" || job.status === "cancelled");

  return (
    <section className="section">
      <h2>Progress & results</h2>
      <p className="lede">
        {running
          ? "Generation is running. This view updates as each letter finishes."
          : "Batch summary for the latest job. Re-run safely with skip-existing enabled."}
      </p>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {job ? (
        <>
          {done && job.status === "completed" ? (
            <div className="alert alert-ok">
              Finished — {job.succeeded} generated
              {job.skipped ? `, ${job.skipped} skipped` : ""}
              {job.failed ? `, ${job.failed} failed` : ""}.
            </div>
          ) : null}

          {done && job.status === "cancelled" ? (
            <div className="alert alert-warn">
              Stopped — {job.succeeded} generated
              {job.skipped ? `, ${job.skipped} skipped` : ""}
              {job.failed ? `, ${job.failed} failed` : ""}. Already finished letters stay in
              Drive and the sheet.
            </div>
          ) : null}

          <div className="progress-wrap">
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Generation progress"
            >
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              <span>{job.progress_text || job.message || job.status}</span>
              <span>{pct}%</span>
            </div>
          </div>

          <div className="summary-row">
            <span>Status: {job.status}</span>
            <span className="status-success">Succeeded: {job.succeeded}</span>
            <span className="status-failed">Failed: {job.failed}</span>
            <span className="status-skipped">Skipped: {job.skipped}</span>
          </div>

          {job.error ? <div className="alert alert-danger">{job.error}</div> : null}

          {failedRows.length ? (
            <div className="alert alert-danger">
              <strong>{failedRows.length} row(s) failed</strong>
              <ul>
                {failedRows.slice(0, 8).map((r) => (
                  <li key={`fail-${r.row}`}>
                    Row {r.row}
                    {r.name ? ` (${r.name})` : ""}: {r.error || "Unknown error"}
                  </li>
                ))}
                {failedRows.length > 8 ? (
                  <li>…and {failedRows.length - 8} more (see table)</li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {job.warnings?.length ? (
            <div className="alert alert-warn">
              <ul>
                {job.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {job.results?.length ? (
            <>
              <div className="filter-row" role="tablist" aria-label="Filter results">
                {["all", "success", "failed", "skipped"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={filter === key}
                    className={`filter-btn ${filter === key ? "is-active" : ""}`}
                    onClick={() => setFilter(key)}
                  >
                    {key === "all" ? "All" : key}
                  </button>
                ))}
              </div>

              <table className="results">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>File</th>
                    <th>Link / error</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={`${r.row}-${r.status}-${r.filename || r.error || ""}`}>
                      <td>{r.row}</td>
                      <td>{r.name || r.code || "—"}</td>
                      <td className={`status-${r.status}`}>{r.status}</td>
                      <td>{r.filename || "—"}</td>
                      <td>
                        {r.pdf_link ? (
                          <a href={r.pdf_link} target="_blank" rel="noreferrer">
                            Open PDF
                          </a>
                        ) : (
                          <span className={r.error ? "status-failed" : ""}>
                            {r.error || "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
