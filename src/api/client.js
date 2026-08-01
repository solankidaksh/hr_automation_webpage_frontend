const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const AUTH_TOKEN_KEY = "hr_auth_token";

export function captureAuthTokenFromHash() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return false;

  const params = new URLSearchParams(hash);
  const token = params.get("auth_token");
  if (!token) return false;

  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  window.history.replaceState({}, "", window.location.pathname + window.location.search);
  return true;
}

export function clearAuthToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) || "";
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }

  if (!res.ok) {
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join("; ")
          : res.statusText || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  baseUrl: API_BASE,
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  loginUrl: () => `${API_BASE}/api/auth/login`,

  uploadTemplate: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("/api/templates/upload", { method: "POST", body: form });
  },
  fromDriveTemplate: (file) =>
    request("/api/templates/from-drive", {
      method: "POST",
      body: JSON.stringify({ file }),
    }),
  latestTemplate: () => request("/api/templates/latest"),
  deleteTemplate: (templateId) =>
    request(`/api/templates/${templateId}`, { method: "DELETE" }),
  validate: (body) =>
    request("/api/templates/validate", { method: "POST", body: JSON.stringify(body) }),

  previewSheet: (sheet) =>
    request(`/api/sheets/preview?sheet=${encodeURIComponent(sheet)}&sample_limit=5`),

  previewFolder: (folder) =>
    request(`/api/drive/preview?folder=${encodeURIComponent(folder)}`),

  generate: (body) =>
    request("/api/jobs/generate", { method: "POST", body: JSON.stringify(body) }),
  jobStatus: (jobId) => request(`/api/jobs/status/${encodeURIComponent(jobId)}`),
  cancelJob: (jobId) =>
    request(`/api/jobs/cancel/${encodeURIComponent(jobId)}`, { method: "POST" }),
};
