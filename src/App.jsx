import { useEffect, useRef, useState } from "react";
import { api, captureAuthTokenFromHash, clearAuthToken } from "./api/client";
import LoginButton from "./components/LoginButton";
import TemplateUpload from "./components/TemplateUpload";
import SheetSelector from "./components/SheetSelector";
import DriveFolderSelector from "./components/DriveFolderSelector";
import GenerateButton from "./components/GenerateButton";
import ProgressReport from "./components/ProgressReport";

export default function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [template, setTemplate] = useState(null);
  const [sheet, setSheet] = useState("");
  const [preview, setPreview] = useState(null);
  const [validation, setValidation] = useState(null);
  const [driveFolder, setDriveFolder] = useState("");
  const [folderPreview, setFolderPreview] = useState(null);
  const [skipIfExists, setSkipIfExists] = useState(true);
  const [nameField1, setNameField1] = useState("");
  const [nameField2, setNameField2] = useState("");
  const [nameSuffix, setNameSuffix] = useState("");
  const [starting, setStarting] = useState(false);
  const [job, setJob] = useState(null);
  const [jobError, setJobError] = useState("");
  const [authError, setAuthError] = useState("");
  const pollRef = useRef(null);

  useEffect(() => {
    // OAuth callback redirects here with #auth_token=... (cross-origin session handoff)
    captureAuthTokenFromHash();

    const params = new URLSearchParams(window.location.search);
    const err = params.get("auth_error");
    if (err) {
      setAuthError(`Google sign-in failed: ${err.replaceAll("_", " ")}`);
      window.history.replaceState({}, "", "/");
    }

    let cancelled = false;
    (async () => {
      try {
        const me = await api.me();
        if (cancelled) return;
        setUser(me);
        const latest = await api.latestTemplate();
        if (!cancelled && latest) setTemplate(latest);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleLogout() {
    clearAuthToken();
    await api.logout();
    setUser(null);
    setTemplate(null);
    setPreview(null);
    setValidation(null);
    setDriveFolder("");
    setFolderPreview(null);
    setJob(null);
  }

  function startPolling(jobId) {
    if (pollRef.current) clearInterval(pollRef.current);

    const tick = async () => {
      try {
        const status = await api.jobStatus(jobId);
        setJob(status);
        if (status.status === "completed" || status.status === "failed") {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch (err) {
        setJobError(err.message || "Failed to fetch job status");
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    tick();
    pollRef.current = setInterval(tick, 1500);
  }

  async function handleGenerate() {
    setStarting(true);
    setJobError("");
    try {
      const started = await api.generate({
        sheet: sheet.trim(),
        template_id: template?.id,
        skip_if_exists: skipIfExists,
        drive_folder: driveFolder.trim(),
        drive_folder_id: folderPreview?.folder_id || undefined,
        name_field_1: nameField1,
        name_field_2: nameField2,
        name_suffix: nameSuffix.trim(),
      });
      setJob({
        job_id: started.job_id,
        status: started.status,
        total: 0,
        processed: 0,
        succeeded: 0,
        failed: 0,
        skipped: 0,
        message: started.message,
        progress_text: started.message,
        results: [],
        warnings: [],
      });
      startPolling(started.job_id);
    } catch (err) {
      setJobError(err.message || "Could not start generation");
    } finally {
      setStarting(false);
    }
  }

  const sheetHeaders = preview?.headers || validation?.headers || [];

  const hasPdfNamePart =
    Boolean(nameField1) || Boolean(nameField2) || Boolean(nameSuffix.trim());

  const canGenerate =
    Boolean(user) &&
    Boolean(template) &&
    Boolean(sheet.trim()) &&
    Boolean(validation?.ok) &&
    Boolean(folderPreview?.folder_id) &&
    hasPdfNamePart &&
    !(preview && preview.row_count > 1000);

  let disabledReason = "";
  if (!template) disabledReason = "Paste a Drive/Docs template link and click Use this template.";
  else if (!sheet.trim()) disabledReason = "Paste a Google Sheet URL or ID.";
  else if (!validation) disabledReason = "Click Preview & validate before generating.";
  else if (!validation.ok) disabledReason = "Fix missing columns, then validate again.";
  else if (!folderPreview?.folder_id) {
    disabledReason = "Paste a Drive folder link and click Verify folder.";
  } else if (!hasPdfNamePart) {
    disabledReason = "Fill at least one PDF name field (column or letter title).";
  } else if (preview && preview.row_count > 1000) {
    disabledReason = `This sheet has ${preview.row_count} rows. Max 1000 letters per generate. Split the sheet and try again.`;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">HR Letter Portal</div>
        <LoginButton user={user} onLogout={handleLogout} loading={authLoading} />
      </header>

      <section className="hero">
        <h1>HR Letter Portal</h1>
        <p>
          Fill DOCX letter templates from a Google Sheet, generate PDFs, and save them to
          your chosen Drive folder — with links written back for every employee.
        </p>
        {!user && !authLoading ? (
          <div className="hero-actions">
            <a className="btn btn-primary" href={api.loginUrl()}>
              Sign in with Google
            </a>
          </div>
        ) : null}
      </section>

      {authError ? <div className="alert alert-danger">{authError}</div> : null}

      {!user && !authLoading ? (
        <div className="gate">Sign in to upload templates and generate letters.</div>
      ) : null}

      {user ? (
        <div className="workspace">
          <TemplateUpload
            template={template}
            onUploaded={(t) => {
              setTemplate(t);
              setValidation(null);
            }}
            onRemoved={() => {
              setTemplate(null);
              setValidation(null);
            }}
          />

          <SheetSelector
            sheet={sheet}
            onSheetChange={(v) => {
              setSheet(v);
              setPreview(null);
              setValidation(null);
              setNameField1("");
              setNameField2("");
            }}
            preview={preview}
            validation={validation}
            onPreview={setPreview}
            onValidated={setValidation}
            templateId={template?.id}
          />

          <DriveFolderSelector
            folder={driveFolder}
            onFolderChange={setDriveFolder}
            preview={folderPreview}
            onPreview={setFolderPreview}
          />

          <GenerateButton
            disabled={!canGenerate}
            busy={starting || job?.status === "queued" || job?.status === "running"}
            skipIfExists={skipIfExists}
            onSkipChange={setSkipIfExists}
            onGenerate={handleGenerate}
            disabledReason={disabledReason}
            driveFolderName={folderPreview?.name}
            headers={sheetHeaders}
            nameField1={nameField1}
            nameField2={nameField2}
            nameSuffix={nameSuffix}
            onNameField1Change={setNameField1}
            onNameField2Change={setNameField2}
            onNameSuffixChange={setNameSuffix}
          />

          <ProgressReport job={job} error={jobError} />
        </div>
      ) : null}
    </div>
  );
}
